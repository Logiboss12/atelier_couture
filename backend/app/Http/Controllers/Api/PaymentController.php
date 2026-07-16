<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use App\Services\CinetPayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    public function __construct(private CinetPayService $cinetPay) {}

    /**
     * Webhook CinetPay : ne jamais se fier au corps de la requête, on revérifie
     * toujours le statut réel de la transaction via l'API avant de valider.
     */
    public function cinetpayWebhook(Request $request)
    {
        $transactionId = $request->input('cpm_trans_id');

        if (! $transactionId) {
            return response()->json(['message' => 'cpm_trans_id manquant.'], 400);
        }

        $invoice = Invoice::where('cinetpay_transaction_id', $transactionId)->first();

        if (! $invoice) {
            Log::warning('Webhook CinetPay : facture introuvable pour la transaction.', ['transaction_id' => $transactionId]);

            return response()->json(['message' => 'Transaction inconnue.'], 404);
        }

        $result = $this->cinetPay->verify($transactionId);

        if (($result['data']['status'] ?? null) === 'ACCEPTED' && $invoice->statut !== 'payee') {
            $invoice->markAsPaid();
        }

        return response()->json(['message' => 'ok']);
    }
}
