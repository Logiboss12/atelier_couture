<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    public function run(): void
    {
        $clients = [
            ['nom' => 'Aïssatou Diop', 'ville' => 'Dakar', 'pays' => 'Sénégal', 'tel' => '+221 77 512 34 56', 'email' => 'aissatou.diop@example.com', 'client_depuis' => 2023, 'poitrine' => 96, 'taille' => 74, 'hanches' => 102, 'epaule' => 39, 'manche' => 58, 'longueur' => 142],
            ['nom' => 'Moussa Fall', 'ville' => 'Dakar', 'pays' => 'Sénégal', 'tel' => '+221 76 220 98 10', 'email' => 'moussa.fall@example.com', 'client_depuis' => 2024, 'poitrine' => 104, 'taille' => 92, 'hanches' => 100, 'epaule' => 46, 'manche' => 63, 'longueur' => 108],
            ['nom' => 'Camille Dubois', 'ville' => 'Paris', 'pays' => 'France', 'tel' => '+33 6 12 34 56 78', 'email' => 'camille.dubois@example.com', 'client_depuis' => 2022, 'poitrine' => 88, 'taille' => 68, 'hanches' => 96, 'epaule' => 37, 'manche' => 56, 'longueur' => 138],
            ['nom' => 'Fatou Ndiaye', 'ville' => 'Saint-Louis', 'pays' => 'Sénégal', 'tel' => '+221 78 340 11 22', 'email' => 'fatou.ndiaye@example.com', 'client_depuis' => 2021, 'poitrine' => 100, 'taille' => 82, 'hanches' => 108, 'epaule' => 40, 'manche' => 59, 'longueur' => 144],
            ['nom' => 'Julien Moreau', 'ville' => 'Lyon', 'pays' => 'France', 'tel' => '+33 6 98 76 54 32', 'email' => 'julien.moreau@example.com', 'client_depuis' => 2025, 'poitrine' => 100, 'taille' => 88, 'hanches' => 98, 'epaule' => 45, 'manche' => 62, 'longueur' => 110],
            ['nom' => 'Mariama Sow', 'ville' => 'Thiès', 'pays' => 'Sénégal', 'tel' => '+221 70 654 32 10', 'email' => 'mariama.sow@example.com', 'client_depuis' => 2023, 'poitrine' => 92, 'taille' => 72, 'hanches' => 100, 'epaule' => 38, 'manche' => 57, 'longueur' => 140],
            ['nom' => 'Ibrahima Ba', 'ville' => 'Dakar', 'pays' => 'Sénégal', 'tel' => '+221 77 888 45 90', 'email' => 'ibrahima.ba@example.com', 'client_depuis' => 2026, 'poitrine' => 108, 'taille' => 96, 'hanches' => 104, 'epaule' => 47, 'manche' => 64, 'longueur' => 112],
            ['nom' => 'Léa Girard', 'ville' => 'Paris', 'pays' => 'France', 'tel' => '+33 6 45 12 78 90', 'email' => 'lea.girard@example.com', 'client_depuis' => 2022, 'poitrine' => 90, 'taille' => 70, 'hanches' => 98, 'epaule' => 37, 'manche' => 56, 'longueur' => 140],
        ];

        foreach ($clients as $client) {
            Client::create($client);
        }
    }
}
