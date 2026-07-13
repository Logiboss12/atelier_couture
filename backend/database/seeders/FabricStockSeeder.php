<?php

namespace Database\Seeders;

use App\Models\FabricStock;
use App\Models\Textile;
use Illuminate\Database\Seeder;

class FabricStockSeeder extends Seeder
{
    public function run(): void
    {
        $textiles = Textile::all()->keyBy('slug');

        $stocks = [
            ['tissu' => 'wax', 'quantite_metres' => 320, 'niveau' => 78, 'statut' => 'ok'],
            ['tissu' => 'kente', 'quantite_metres' => 95, 'niveau' => 42, 'statut' => 'warn'],
            ['tissu' => 'indigo', 'quantite_metres' => 180, 'niveau' => 65, 'statut' => 'ok'],
            ['tissu' => 'dentelle', 'quantite_metres' => 4, 'niveau' => 8, 'statut' => 'danger'],
            ['tissu' => 'soie', 'quantite_metres' => 7, 'niveau' => 15, 'statut' => 'danger'],
        ];

        foreach ($stocks as $stock) {
            FabricStock::create([
                'textile_id' => $textiles[$stock['tissu']]->id,
                'quantite_metres' => $stock['quantite_metres'],
                'niveau' => $stock['niveau'],
                'statut' => $stock['statut'],
            ]);
        }
    }
}
