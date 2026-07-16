<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<title>Facture {{ $invoice->numero }}</title>
<style>
    @page { margin: 32px 40px; }
    body { font-family: 'Helvetica', sans-serif; color: #1a1140; font-size: 13px; }
    .header { width: 100%; border-bottom: 2px solid #1a1140; padding-bottom: 12px; margin-bottom: 20px; }
    .header td { vertical-align: top; }
    .brand { font-size: 22px; font-weight: bold; letter-spacing: .5px; }
    .brand-sub { font-size: 11px; color: #6b6478; margin-top: 2px; }
    .doc-title { font-size: 16px; font-weight: bold; text-align: right; }
    .doc-meta { font-size: 11px; color: #6b6478; text-align: right; margin-top: 4px; }
    .block-title { font-size: 10px; text-transform: uppercase; letter-spacing: .5px; color: #6b6478; margin-bottom: 4px; }
    .parties { width: 100%; margin-bottom: 20px; }
    .parties td { vertical-align: top; width: 50%; }
    table.lines { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
    table.lines th { text-align: left; font-size: 10px; text-transform: uppercase; color: #6b6478; border-bottom: 1px solid #d9d5e8; padding: 6px 4px; }
    table.lines td { padding: 8px 4px; border-bottom: 1px solid #ece9f4; }
    table.lines td.amount, table.lines th.amount { text-align: right; }
    .total-row td { border-bottom: none; padding-top: 14px; font-size: 16px; font-weight: bold; }
    .total-row td.amount { color: #ff4d8d; }
    .status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 10px; text-transform: uppercase; }
    .status-payee { background: #d7f4e4; color: #0a6b3d; }
    .status-partielle { background: #d7e7f4; color: #0a4a6b; }
    .status-en_attente, .status-impayee { background: #fbe3d0; color: #a3450a; }
    .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #d9d5e8; font-size: 10px; color: #6b6478; text-align: center; }
</style>
</head>
<body>
    <table class="header">
        <tr>
            <td>
                <div class="brand">MAISON ÌRÓ</div>
                <div class="brand-sub">Couture sur-mesure · Dakar · Paris</div>
                <div class="brand-sub">contact@maison-iro.com · +221 77 000 00 00</div>
            </td>
            <td>
                <div class="doc-title">FACTURE #{{ $invoice->numero }}</div>
                <div class="doc-meta">Date : {{ optional($invoice->date)->format('d/m/Y') }}</div>
                <div class="doc-meta">
                    <span class="status status-{{ $invoice->statut }}">{{ $statusLabels[$invoice->statut] ?? $invoice->statut }}</span>
                </div>
            </td>
        </tr>
    </table>

    <table class="parties">
        <tr>
            <td>
                <div class="block-title">Facturé à</div>
                <div>{{ $invoice->client->nom ?? '—' }}</div>
                @if($invoice->client?->tel)<div>{{ $invoice->client->tel }}</div>@endif
                @if($invoice->client?->email)<div>{{ $invoice->client->email }}</div>@endif
            </td>
            <td>
                @if($invoice->adresse_livraison)
                    <div class="block-title">Livraison</div>
                    <div>{{ $invoice->adresse_livraison }}</div>
                    <div>{{ $invoice->ville_livraison }}</div>
                    <div>{{ $invoice->tel_livraison }}</div>
                @endif
                @if($invoice->order)
                    <div class="block-title" style="margin-top:8px;">Commande liée</div>
                    <div>{{ $invoice->order->ref }} — {{ $invoice->order->modele }}</div>
                @endif
            </td>
        </tr>
    </table>

    <table class="lines">
        <thead>
            <tr>
                <th>Désignation</th>
                <th class="amount">Montant</th>
            </tr>
        </thead>
        <tbody>
            @foreach($invoice->lines as $line)
                <tr>
                    <td>{{ $line->label }}</td>
                    <td class="amount">{{ number_format($line->montant, 0, ',', ' ') }} F</td>
                </tr>
            @endforeach
            <tr class="total-row">
                <td>TOTAL</td>
                <td class="amount">{{ number_format($invoice->total, 0, ',', ' ') }} F</td>
            </tr>
        </tbody>
    </table>

    @if($invoice->mode_paiement)
        <div>
            <div class="block-title">Moyen de paiement</div>
            <div>{{ $paymentLabels[$invoice->mode_paiement] ?? $invoice->mode_paiement }}</div>
        </div>
    @endif

    <div class="footer">
        Maison Ìró — Atelier de couture sur-mesure. Facture générée le {{ now()->format('d/m/Y à H:i') }}.
    </div>
</body>
</html>
