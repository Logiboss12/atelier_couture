<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Models\Order;
use App\Models\Product;
use App\Models\Quote;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MeController extends Controller
{
    public function show(Request $request)
    {
        $user = $request->user();

        $client = $user->client()->with([
            'orders' => fn ($q) => $q->with('textile')->latest('echeance'),
            'quotes.order',
            'invoices.lines',
        ])->first();

        return response()->json([
            'user' => $user,
            'client' => $client,
        ]);
    }

    public function storeOrder(Request $request)
    {
        $data = $request->validate([
            'modele' => 'required|string',
            'textile_id' => 'nullable|exists:textiles,id',
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

        $client->fill(collect($data)->only([
            'poitrine', 'taille', 'hanches', 'epaule', 'manche', 'longueur',
        ])->toArray());
        $client->save();

        $order = Order::create([
            'ref' => $this->generateOrderRef(),
            'client_id' => $client->id,
            'textile_id' => $data['textile_id'] ?? null,
            'modele' => $data['modele'],
            'statut' => 'recue',
            'echeance' => now()->addWeeks(4),
        ]);

        return response()->json($order->load('textile'), 201);
    }

    public function checkout(Request $request)
    {
        $data = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
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
                $product = Product::lockForUpdate()->findOrFail($item['product_id']);

                if ($product->stock < $item['quantite']) {
                    abort(422, "Stock insuffisant pour \"{$product->nom}\".");
                }

                $montant = $product->prix * $item['quantite'];
                $total += $montant;
                $lines[] = ['label' => "{$product->nom} x{$item['quantite']}", 'montant' => $montant];

                $product->decrement('stock', $item['quantite']);
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
