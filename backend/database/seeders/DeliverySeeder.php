<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Delivery;
use App\Models\Order;
use Illuminate\Database\Seeder;

class DeliverySeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all()->keyBy('nom');
        $orders = Order::all()->keyBy('ref');

        $today = '2026-07-13';
        $tomorrow = '2026-07-14';

        $deliveries = [
            ['heure' => '10:00', 'date' => $today, 'client' => 'Julien Moreau', 'zone' => 'Almadies', 'contenu' => 'IRO-2045 · Costume indigo', 'order' => 'IRO-2045', 'type' => 'individuelle', 'statut' => 'en_route'],
            ['heure' => '11:30', 'date' => $today, 'client' => 'Aïssatou Diop', 'zone' => 'Ngor', 'contenu' => 'IRO-2049 · Ensemble enfant wax', 'order' => 'IRO-2049', 'type' => 'groupee', 'statut' => 'planifiee'],
            ['heure' => '15:00', 'date' => $today, 'client_label' => 'Zone Plateau (4 clients)', 'zone' => 'Plateau', 'contenu' => 'Tournée groupée', 'type' => 'groupee', 'statut' => 'planifiee'],
            ['heure' => '09:00', 'date' => $tomorrow, 'client' => 'Fatou Ndiaye', 'zone' => 'Saint-Louis', 'contenu' => 'IRO-2044 · Robe de mariée', 'order' => 'IRO-2044', 'type' => 'individuelle', 'statut' => 'a_planifier'],
            ['heure' => '14:00', 'date' => $tomorrow, 'client' => 'Mariama Sow', 'zone' => 'Thiès', 'contenu' => 'IRO-2046 · Ensemble kente', 'order' => 'IRO-2046', 'type' => 'individuelle', 'statut' => 'confirmee'],
        ];

        foreach ($deliveries as $delivery) {
            Delivery::create([
                'order_id' => isset($delivery['order']) ? $orders[$delivery['order']]->id : null,
                'client_id' => isset($delivery['client']) ? $clients[$delivery['client']]->id : null,
                'client_label' => $delivery['client'] ?? $delivery['client_label'],
                'date' => $delivery['date'],
                'heure' => $delivery['heure'],
                'zone' => $delivery['zone'],
                'contenu' => $delivery['contenu'],
                'type' => $delivery['type'],
                'statut' => $delivery['statut'],
            ]);
        }
    }
}
