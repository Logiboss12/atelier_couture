<?php

namespace Database\Seeders;

use App\Models\Event;
use Illuminate\Database\Seeder;

class EventSeeder extends Seeder
{
    public function run(): void
    {
        $events = [
            ['nom' => 'Défilé Racines x Horizon', 'date' => '2026-08-02', 'lieu' => 'Dakar, Terrou-Bi', 'statut' => 'info', 'statut_label' => 'Planifiée', 'remplissage' => 62, 'capacite' => '120 invités'],
            ['nom' => 'Pop-up Boutique Paris', 'date' => '2026-07-20', 'lieu' => 'Paris, Le Marais', 'statut' => 'ok', 'statut_label' => 'Active', 'remplissage' => 88, 'capacite' => '60 places'],
            ['nom' => 'Journée essayage Mariées', 'date' => '2026-07-30', 'lieu' => 'Atelier Dakar', 'statut' => 'info', 'statut_label' => 'Planifiée', 'remplissage' => 40, 'capacite' => '20 rendez-vous'],
        ];

        foreach ($events as $event) {
            Event::create($event);
        }
    }
}
