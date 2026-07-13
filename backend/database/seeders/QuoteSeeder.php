<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Quote;
use Illuminate\Database\Seeder;

class QuoteSeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all()->keyBy('nom');

        $quotes = [
            ['ref' => 'DEV-118', 'client' => 'Ibrahima Ba', 'modele' => 'Boubou prêt-à-porter', 'montant' => 185000],
            ['ref' => 'DEV-119', 'client' => 'Léa Girard', 'modele' => 'Robe soie duchesse', 'montant' => 420000],
            ['ref' => 'DEV-120', 'client' => 'Julien Moreau', 'modele' => 'Costume indigo', 'montant' => 365000],
            ['ref' => 'DEV-121', 'client' => 'Mariama Sow', 'modele' => 'Ensemble kente cérémonie', 'montant' => 275000],
            ['ref' => 'DEV-122', 'client' => 'Fatou Ndiaye', 'modele' => 'Grand boubou kente', 'montant' => 210000],
        ];

        foreach ($quotes as $quote) {
            Quote::create([
                'ref' => $quote['ref'],
                'client_id' => $clients[$quote['client']]->id,
                'modele' => $quote['modele'],
                'montant' => $quote['montant'],
                'statut' => 'en_attente',
            ]);
        }
    }
}
