<?php

namespace App\Services;

use App\Models\Setting;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;
use RuntimeException;

class CinetPayService
{
    private const CHECKOUT_URL = 'https://api-checkout.cinetpay.com/v2/payment';

    private const VERIFY_URL = 'https://api-checkout.cinetpay.com/v2/payment/check';

    public function isConfigured(): bool
    {
        return (bool) Setting::get('cinetpay_api_key') && (bool) Setting::get('cinetpay_site_id');
    }

    /**
     * Initialise un paiement CinetPay et retourne l'URL de paiement hébergée.
     */
    public function initPayment(array $payload): array
    {
        if (! $this->isConfigured()) {
            throw new RuntimeException('Le paiement Mobile Money n\'est pas configuré. Contactez l\'atelier.');
        }

        try {
            $response = Http::asJson()->timeout(15)->post(self::CHECKOUT_URL, [
                'apikey' => Setting::get('cinetpay_api_key'),
                'site_id' => Setting::get('cinetpay_site_id'),
                'currency' => 'XAF',
                'channels' => 'MOBILE_MONEY',
                'lang' => 'fr',
                ...$payload,
            ]);
        } catch (ConnectionException) {
            throw new RuntimeException('Impossible de joindre le service de paiement. Réessayez dans un instant.');
        }

        $body = $response->json() ?? [];

        if (($body['code'] ?? null) !== '201' || empty($body['data']['payment_url'])) {
            throw new RuntimeException($body['description'] ?? $body['message'] ?? 'Échec de l\'initialisation du paiement.');
        }

        return $body['data'];
    }

    /**
     * Vérifie le statut réel d'une transaction auprès de CinetPay (jamais se fier au seul webhook).
     */
    public function verify(string $transactionId): array
    {
        try {
            $response = Http::asJson()->timeout(15)->post(self::VERIFY_URL, [
                'apikey' => Setting::get('cinetpay_api_key'),
                'site_id' => Setting::get('cinetpay_site_id'),
                'transaction_id' => $transactionId,
            ]);
        } catch (ConnectionException) {
            return [];
        }

        return $response->json() ?? [];
    }
}
