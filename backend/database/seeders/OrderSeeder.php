<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Order;
use App\Models\TeamMember;
use App\Models\Textile;
use Illuminate\Database\Seeder;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all()->keyBy('nom');
        $textiles = Textile::all()->keyBy('slug');
        $team = TeamMember::all()->keyBy('nom');

        $orders = [
            ['ref' => 'IRO-2041', 'client' => 'Aïssatou Diop', 'modele' => 'Grand boubou brodé', 'tissu' => 'wax', 'statut' => 'encours', 'echeance' => '2026-07-15', 'assigne' => 'Khady Sarr'],
            ['ref' => 'IRO-2042', 'client' => 'Camille Dubois', 'modele' => 'Robe de soirée jacquard', 'tissu' => 'jacquard', 'statut' => 'finition', 'echeance' => '2026-07-14', 'assigne' => 'Omar Diallo'],
            ['ref' => 'IRO-2043', 'client' => 'Moussa Fall', 'modele' => 'Tailleur trois pièces', 'tissu' => 'bazin', 'statut' => 'recue', 'echeance' => '2026-07-22', 'assigne' => 'Khady Sarr'],
            ['ref' => 'IRO-2044', 'client' => 'Fatou Ndiaye', 'modele' => 'Robe de mariée dentelle', 'tissu' => 'dentelle', 'statut' => 'finition', 'echeance' => '2026-07-18', 'assigne' => 'Marième Cissé'],
            ['ref' => 'IRO-2045', 'client' => 'Julien Moreau', 'modele' => 'Costume indigo', 'tissu' => 'indigo', 'statut' => 'prete', 'echeance' => '2026-07-13', 'assigne' => 'Omar Diallo'],
            ['ref' => 'IRO-2046', 'client' => 'Mariama Sow', 'modele' => 'Ensemble kente cérémonie', 'tissu' => 'kente', 'statut' => 'livree', 'echeance' => '2026-07-10', 'assigne' => 'Khady Sarr'],
            ['ref' => 'IRO-2047', 'client' => 'Ibrahima Ba', 'modele' => 'Boubou prêt-à-porter', 'tissu' => 'hibiscus', 'statut' => 'recue', 'echeance' => '2026-07-25', 'assigne' => 'Marième Cissé'],
            ['ref' => 'IRO-2048', 'client' => 'Léa Girard', 'modele' => 'Robe soie duchesse', 'tissu' => 'soie', 'statut' => 'encours', 'echeance' => '2026-07-16', 'assigne' => 'Omar Diallo'],
            ['ref' => 'IRO-2049', 'client' => 'Aïssatou Diop', 'modele' => 'Ensemble enfant wax', 'tissu' => 'wax', 'statut' => 'prete', 'echeance' => '2026-07-13', 'assigne' => 'Khady Sarr'],
            ['ref' => 'IRO-2050', 'client' => 'Camille Dubois', 'modele' => 'Veste bazin brodée', 'tissu' => 'bazin', 'statut' => 'encours', 'echeance' => '2026-07-19', 'assigne' => 'Marième Cissé'],
            ['ref' => 'IRO-2051', 'client' => 'Moussa Fall', 'modele' => 'Chemise jacquard', 'tissu' => 'jacquard', 'statut' => 'livree', 'echeance' => '2026-07-08', 'assigne' => 'Omar Diallo'],
            ['ref' => 'IRO-2052', 'client' => 'Fatou Ndiaye', 'modele' => 'Grand boubou kente', 'tissu' => 'kente', 'statut' => 'recue', 'echeance' => '2026-07-28', 'assigne' => 'Khady Sarr'],
        ];

        foreach ($orders as $order) {
            Order::create([
                'ref' => $order['ref'],
                'client_id' => $clients[$order['client']]->id,
                'textile_id' => $textiles[$order['tissu']]->id,
                'team_member_id' => $team[$order['assigne']]->id,
                'modele' => $order['modele'],
                'statut' => $order['statut'],
                'echeance' => $order['echeance'],
            ]);
        }
    }
}
