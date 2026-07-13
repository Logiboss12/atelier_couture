<?php

namespace Database\Seeders;

use App\Models\CashMovement;
use App\Models\Order;
use Illuminate\Database\Seeder;

class CashMovementSeeder extends Seeder
{
    public function run(): void
    {
        $orders = Order::all()->keyBy('ref');

        $movements = [
            ['type' => 'in', 'label' => 'Commande IRO-2045 — solde final', 'date' => '2026-07-13', 'moyen_paiement' => 'mobile_money', 'montant' => 365000, 'order' => 'IRO-2045'],
            ['type' => 'out', 'label' => 'Achat tissu — Sotiba', 'date' => '2026-07-12', 'moyen_paiement' => 'virement', 'montant' => 640000, 'categorie' => 'Matières premières'],
            ['type' => 'in', 'label' => 'Commande IRO-2049 — acompte', 'date' => '2026-07-12', 'moyen_paiement' => 'especes', 'montant' => 90000, 'order' => 'IRO-2049'],
            ['type' => 'out', 'label' => 'Salaires équipe atelier', 'date' => '2026-07-10', 'moyen_paiement' => 'virement', 'montant' => 1800000, 'categorie' => 'Salaires'],
            ['type' => 'in', 'label' => 'Boutique en ligne — 4 ventes', 'date' => '2026-07-09', 'moyen_paiement' => 'carte', 'montant' => 214000],
        ];

        foreach ($movements as $movement) {
            CashMovement::create([
                'type' => $movement['type'],
                'label' => $movement['label'],
                'date' => $movement['date'],
                'moyen_paiement' => $movement['moyen_paiement'],
                'montant' => $movement['montant'],
                'categorie' => $movement['categorie'] ?? null,
                'order_id' => isset($movement['order']) ? $orders[$movement['order']]->id : null,
            ]);
        }
    }
}
