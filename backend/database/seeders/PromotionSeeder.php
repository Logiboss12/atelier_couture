<?php

namespace Database\Seeders;

use App\Models\Promotion;
use Illuminate\Database\Seeder;

class PromotionSeeder extends Seeder
{
    public function run(): void
    {
        $promotions = [
            ['nom' => 'Soldes Tabaski', 'debut' => '2026-07-01', 'fin' => '2026-07-15', 'cible' => 'Toutes collections', 'reduction' => '-20%', 'statut' => 'ok', 'statut_label' => 'Active', 'ca' => 4200000],
            ['nom' => 'Semaine Mariées', 'debut' => '2026-07-20', 'fin' => '2026-07-27', 'cible' => 'Collection Mariées', 'reduction' => '-15%', 'statut' => 'info', 'statut_label' => 'Planifiée', 'ca' => null],
            ['nom' => 'Fête des Pères', 'debut' => '2026-06-01', 'fin' => '2026-06-08', 'cible' => 'Costumes & tailleurs', 'reduction' => '-30%', 'statut' => 'neutral', 'statut_label' => 'Terminée', 'ca' => 2850000],
        ];

        foreach ($promotions as $promotion) {
            Promotion::create($promotion);
        }
    }
}
