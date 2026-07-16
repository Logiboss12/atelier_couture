<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Measurement;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderStatus;
use App\Models\Product;
use App\Models\Quote;
use App\Models\Textile;
use App\Services\CinetPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class MeController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $client = $user->client()->with([
            'orders' => fn ($q) => $q->with('textile', 'measurement')->latest('echeance'),
            'quotes.order',
            'invoices.lines',
            'notifications' => fn ($q) => $q->latest(),
            'measurements',
        ])->first();

        return response()->json([
            'user' => $user,
            'client' => $client,
        ]);
    }

    public function markNotificationRead(Request $request, Notification $notification)
    {
        abort_unless($notification->client_id === $request->user()->client?->id, 403);

        $notification->update(['read_at' => now()]);

        return $notification;
    }

    public function storeOrder(Request $request)
    {
        $data = $request->validate([
            'modele' => 'required|string',
            'textile_id' => 'nullable|exists:textiles,id',
            'instructions' => 'nullable|string',
            'measurement_id' => 'nullable|exists:measurements,id',
            'poitrine' => 'nullable|integer',
            'taille' => 'nullable|integer',
            'hanches' => 'nullable|integer',
            'epaule' => 'nullable|integer',
            'manche' => 'nullable|integer',
            'longueur' => 'nullable|integer',
        ]);

        $client = $request->user()->client;

        if (! $client) {
            return response()->json(['message' => 'Profil client introuvable.'], 422);
        }

        $measurementId = $data['measurement_id'] ?? null;

        if ($measurementId) {
            abort_unless(Measurement::where('id', $measurementId)->where('client_id', $client->id)->exists(), 403);
        } else {
            $valeurs = collect($data)->only(['poitrine', 'taille', 'hanches', 'epaule', 'manche', 'longueur'])->filter(fn ($v) => $v !== null);

            if ($valeurs->isNotEmpty()) {
                $measurementId = $client->measurements()->create([
                    'type_vetement' => $data['modele'],
                    'valeurs' => $valeurs->toArray(),
                    'prise_le' => now(),
                ])->id;
            }
        }

        $order = Order::create([
            'ref' => $this->generateOrderRef(),
            'client_id' => $client->id,
            'textile_id' => $data['textile_id'] ?? null,
            'measurement_id' => $measurementId,
            'modele' => $data['modele'],
            'instructions' => $data['instructions'] ?? null,
            'statut' => OrderStatus::orderBy('position')->value('slug') ?? 'recue',
            'echeance' => now()->addWeeks(4),
        ]);

        return response()->json($order->load('textile', 'measurement'), 201);
    }

    public function storeMeasurement(Request $request)
    {
        $client = $request->user()->client;

        if (! $client) {
            return response()->json(['message' => 'Profil client introuvable.'], 422);
        }

        $data = $request->validate([
            'type_vetement' => 'required|string',
            'label' => 'nullable|string',
            'valeurs' => 'required|array',
            'notes' => 'nullable|string',
        ]);

        $data['prise_le'] = now();

        return response()->json($client->measurements()->create($data), 201);
    }

    public function uploadOrderPhoto(Request $request, Order $order)
    {
        abort_unless($order->client_id === $request->user()->client?->id, 403);

        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        $path = $request->file('photo')->store('orders');
        $order->update(['photos' => [...($order->photos ?? []), $path]]);

        return $order;
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required_without:items.*.textile_id|nullable|exists:products,id',
            'items.*.textile_id' => 'required_without:items.*.product_id|nullable|exists:textiles,id',
            'items.*.quantite' => 'required|integer|min:1',
            'mode_paiement' => 'required|in:carte,mobile_money,especes_livraison',
            'adresse_livraison' => 'required|string|max:255',
            'ville_livraison' => 'required|string|max:255',
            'tel_livraison' => 'required|string|max:50',
        ]);

        $client = $request->user()->client;

        if (! $client) {
            return response()->json(['message' => 'Profil client introuvable.'], 422);
        }

        $invoice = DB::transaction(function () use ($data, $client) {
            $total = 0;
            $lines = [];

            foreach ($data['items'] as $item) {
                if (! empty($item['product_id'])) {
                    $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                    if ($product->stock < $item['quantite']) {
                        abort(422, "Stock insuffisant pour \"{$product->nom}\".");
                    }

                    $montant = $product->prix * $item['quantite'];
                    $total += $montant;
                    $lines[] = ['label' => "{$product->nom} x{$item['quantite']}", 'montant' => $montant];

                    $product->decrement('stock', $item['quantite']);

                    continue;
                }

                $textile = Textile::findOrFail($item['textile_id']);
                $fabricStock = $textile->fabricStock()->lockForUpdate()->first();

                if ($fabricStock && $fabricStock->quantite_metres < $item['quantite']) {
                    abort(422, "Stock insuffisant pour \"{$textile->nom}\".");
                }

                $montant = $textile->prix * $item['quantite'];
                $total += $montant;
                $lines[] = ['label' => "{$textile->nom} — {$item['quantite']} m", 'montant' => $montant];

                $fabricStock?->decrement('quantite_metres', $item['quantite']);
            }

            $invoice = Invoice::create([
                'numero' => $this->generateInvoiceNumber(),
                'client_id' => $client->id,
                'date' => now(),
                'total' => $total,
                'statut' => 'en_attente',
                'mode_paiement' => $data['mode_paiement'],
                'adresse_livraison' => $data['adresse_livraison'],
                'ville_livraison' => $data['ville_livraison'],
                'tel_livraison' => $data['tel_livraison'],
            ]);

            $invoice->lines()->createMany($lines);

            return $invoice;
        });

        return response()->json($invoice->load('lines'), 201);
    }

    public function showInvoice(Request $request, Invoice $invoice)
    {
        abort_unless($invoice->client_id === $request->user()->client?->id, 403);

        return $invoice->load('lines', 'client');
    }

    public function downloadInvoicePdf(Request $request, Invoice $invoice)
    {
        abort_unless($invoice->client_id === $request->user()->client?->id, 403);
        abort_if($invoice->statut === 'en_attente', 422, 'Facture en attente de validation.');

        return InvoiceController::renderPdf($invoice);
    }

    public function payInvoiceCheckout(Request $request, Invoice $invoice, CinetPayService $cinetPay)
    {
        abort_unless($invoice->client_id === $request->user()->client?->id, 403);
        abort_unless($invoice->statut === 'en_attente', 422, 'Cette facture n\'est plus en attente de paiement.');
        abort_unless($invoice->mode_paiement === 'mobile_money', 422, 'Ce mode de règlement n\'est pas le paiement Mobile Money.');

        $invoice->load('client');
        $transactionId = "{$invoice->numero}-".time();
        $invoice->update(['cinetpay_transaction_id' => $transactionId]);

        $frontendUrl = config('cors.allowed_origins')[0] ?? config('app.url');
        [$prenom, $nom] = array_pad(explode(' ', $invoice->client->nom ?? 'Client Maison Iro', 2), 2, 'Maison Iro');

        try {
            $data = $cinetPay->initPayment([
                'transaction_id' => $transactionId,
                'amount' => (int) $invoice->total,
                'description' => "Facture {$invoice->numero} — Maison Ìró",
                'notify_url' => rtrim(config('app.url'), '/').'/api/webhooks/cinetpay',
                'return_url' => rtrim($frontendUrl, '/')."/facture/{$invoice->id}",
                'customer_name' => $prenom,
                'customer_surname' => $nom,
                'customer_email' => $invoice->client->email ?? 'client@maison-iro.com',
                'customer_phone_number' => $invoice->client->tel ?? '000000000',
                'customer_address' => $invoice->adresse_livraison ?? 'N/A',
                'customer_city' => $invoice->ville_livraison ?? $invoice->client->ville ?? 'Douala',
                'customer_country' => 'CM',
                'customer_state' => 'CM',
                'customer_zip_code' => '00000',
            ]);
        } catch (\RuntimeException $e) {
            return response()->json(['message' => $e->getMessage()], 422);
        }

        return response()->json(['payment_url' => $data['payment_url']]);
    }

    public function convertQuote(Request $request, Quote $quote)
    {
        $client = $request->user()->client;

        abort_unless($client && $quote->client_id === $client->id, 403);

        if ($quote->statut !== 'en_attente') {
            return response()->json(['message' => 'Ce devis a déjà été traité.'], 422);
        }

        $data = $request->validate([
            'mode_paiement' => 'required|in:carte,mobile_money,especes_livraison',
            'adresse_livraison' => 'required|string|max:255',
            'ville_livraison' => 'required|string|max:255',
            'tel_livraison' => 'required|string|max:50',
            'paiement_plan' => 'required|in:total,tranches',
        ]);

        $invoices = DB::transaction(function () use ($data, $client, $quote) {
            $quote->update(['statut' => 'accepte']);

            $baseAttributes = [
                'client_id' => $client->id,
                'order_id' => $quote->order_id,
                'date' => now(),
                'statut' => 'en_attente',
                'mode_paiement' => $data['mode_paiement'],
                'adresse_livraison' => $data['adresse_livraison'],
                'ville_livraison' => $data['ville_livraison'],
                'tel_livraison' => $data['tel_livraison'],
            ];

            if ($data['paiement_plan'] === 'tranches') {
                $acompte = (int) round($quote->montant * 0.5);
                $solde = $quote->montant - $acompte;

                $acompteInvoice = Invoice::create([...$baseAttributes, 'numero' => $this->generateInvoiceNumber(), 'total' => $acompte]);
                $acompteInvoice->lines()->create(['label' => "{$quote->modele} — Acompte 50%", 'montant' => $acompte]);

                $soldeInvoice = Invoice::create([...$baseAttributes, 'numero' => $this->generateInvoiceNumber(), 'total' => $solde]);
                $soldeInvoice->lines()->create(['label' => "{$quote->modele} — Solde (à régler à la livraison)", 'montant' => $solde]);

                return [$acompteInvoice, $soldeInvoice];
            }

            $invoice = Invoice::create([
                ...$baseAttributes,
                'numero' => $this->generateInvoiceNumber(),
                'total' => $quote->montant,
            ]);
            $invoice->lines()->create(['label' => $quote->modele, 'montant' => $quote->montant]);

            return [$invoice];
        });

        return response()->json([
            'quote' => $quote,
            'invoices' => collect($invoices)->map(fn ($i) => $i->load('lines')),
        ], 201);
    }

    private function generateOrderRef(): string
    {
        $last = Order::query()->orderByDesc('id')->value('ref');
        $lastNumber = $last ? (int) substr($last, strrpos($last, '-') + 1) : 2040;

        return 'IRO-'.($lastNumber + 1);
    }

    private function generateInvoiceNumber(): string
    {
        $year = now()->year;
        $count = Invoice::whereYear('created_at', $year)->count();

        return "FAC-{$year}-".str_pad((string) ($count + 1), 4, '0', STR_PAD_LEFT);
    }
}
