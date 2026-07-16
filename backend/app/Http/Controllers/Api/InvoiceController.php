<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function pdf(Invoice $invoice)
    {
        return $this->renderPdf($invoice);
    }

    public static function renderPdf(Invoice $invoice)
    {
        $invoice->load('client', 'lines', 'order');

        $statusLabels = [
            'en_attente' => 'En attente',
            'payee' => 'Payée',
            'partielle' => 'Partielle',
            'impayee' => 'Impayée',
        ];

        $paymentLabels = [
            'carte' => 'Carte bancaire',
            'mobile_money' => 'Mobile Money',
            'especes_livraison' => 'Espèces à la livraison',
        ];

        return Pdf::loadView('pdf.invoice', compact('invoice', 'statusLabels', 'paymentLabels'))
            ->download("facture-{$invoice->numero}.pdf");
    }

    public function index()
    {
        return Invoice::with('client', 'lines', 'order')->latest('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'numero' => 'required|string|unique:invoices,numero',
            'client_id' => 'required|exists:clients,id',
            'order_id' => 'nullable|exists:orders,id',
            'date' => 'required|date',
            'total' => 'required|integer|min:0',
            'statut' => 'nullable|in:en_attente,payee,partielle,impayee',
            'lignes' => 'nullable|array',
            'lignes.*.label' => 'required_with:lignes|string',
            'lignes.*.montant' => 'required_with:lignes|integer|min:0',
        ]);

        $lines = $data['lignes'] ?? [];
        unset($data['lignes']);

        $invoice = Invoice::create($data);

        if (! empty($lines)) {
            $invoice->lines()->createMany($lines);
        }

        return $invoice->load('lines');
    }

    public function show(Invoice $invoice)
    {
        return $invoice->load('client', 'lines', 'order');
    }

    public function update(Request $request, Invoice $invoice)
    {
        $data = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'order_id' => 'nullable|exists:orders,id',
            'date' => 'sometimes|required|date',
            'total' => 'sometimes|required|integer|min:0',
            'statut' => 'nullable|in:en_attente,payee,partielle,impayee',
        ]);

        $previousStatut = $invoice->statut;

        if (($data['statut'] ?? null) === 'payee') {
            unset($data['statut']);
            $invoice->update($data);
            $invoice->markAsPaid();

            return $invoice;
        }

        $invoice->update($data);

        $becamePartial = $invoice->statut === 'partielle' && ! in_array($previousStatut, ['payee', 'partielle']);

        if ($becamePartial && $invoice->order && $invoice->order->statut === 'recue') {
            $invoice->order->update(['statut' => 'encours']);
            $invoice->order->notifyStatusChange();
        }

        return $invoice;
    }

    public function destroy(Invoice $invoice)
    {
        $invoice->delete();

        return response()->noContent();
    }
}
