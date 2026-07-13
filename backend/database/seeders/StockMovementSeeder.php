<?php

namespace Database\Seeders;

use App\Models\FabricStock;
use App\Models\Order;
use App\Models\StockMovement;
use App\Models\Textile;
use Illuminate\Database\Seeder;

class StockMovementSeeder extends Seeder
{
    public function run(): void
    {
        $fabricStocks = FabricStock::with('textile')->get()->keyBy(fn ($f) => $f->textile->slug);
        $orders = Order::all()->keyBy('ref');

        $movements = [
            ['type' => 'in', 'label' => 'Wax Hollandais — réception fournisseur', 'date' => '2026-07-12', 'valeur' => 50, 'unite' => 'm', 'fabric' => 'wax', 'fournisseur' => 'Sotiba'],
            ['type' => 'out', 'label' => 'Robe de mariée dentelle — commande IRO-2044', 'date' => '2026-07-12', 'valeur' => 1, 'unite' => 'unité', 'order' => 'IRO-2044'],
            ['type' => 'out', 'label' => 'Soie Duchesse — commande IRO-2048', 'date' => '2026-07-11', 'valeur' => 3, 'unite' => 'm', 'fabric' => 'soie', 'order' => 'IRO-2048'],
            ['type' => 'in', 'label' => 'Bazin Riche — réception fournisseur', 'date' => '2026-07-10', 'valeur' => 80, 'unite' => 'm', 'fabric' => 'bazin', 'fournisseur' => 'Thiès Textile'],
            ['type' => 'out', 'label' => 'Grand boubou brodé — commande IRO-2041', 'date' => '2026-07-09', 'valeur' => 1, 'unite' => 'unité', 'order' => 'IRO-2041'],
            ['type' => 'in', 'label' => 'Kente tissé — réception fournisseur', 'date' => '2026-07-06', 'valeur' => 30, 'unite' => 'm', 'fabric' => 'kente', 'fournisseur' => 'Accra Looms'],
        ];

        foreach ($movements as $movement) {
            StockMovement::create([
                'type' => $movement['type'],
                'label' => $movement['label'],
                'quantite_valeur' => $movement['valeur'],
                'quantite_unite' => $movement['unite'],
                'fournisseur' => $movement['fournisseur'] ?? null,
                'date' => $movement['date'],
                'fabric_stock_id' => isset($movement['fabric']) ? $fabricStocks->get($movement['fabric'])?->id : null,
                'order_id' => isset($movement['order']) ? $orders[$movement['order']]->id : null,
            ]);
        }
    }
}
