<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invoice;
use App\Models\Order;
use Illuminate\Database\Seeder;

class InvoiceSeeder extends Seeder
{
    public function run(): void
    {
        $clients = Client::all()->keyBy('nom');
        $orders = Order::all()->keyBy('ref');

        $acompte = Invoice::create([
            'numero' => 'FAC-2026-0298',
            'client_id' => $clients['Aïssatou Diop']->id,
            'order_id' => $orders['IRO-2041']->id,
            'date' => '2026-07-01',
            'total' => 90000,
            'statut' => 'impayee',
        ]);
        $acompte->lines()->create(['label' => 'Grand boubou brodé — acompte', 'montant' => 90000]);

        $facture = Invoice::create([
            'numero' => 'FAC-2026-0341',
            'client_id' => $clients['Camille Dubois']->id,
            'order_id' => $orders['IRO-2042']->id,
            'date' => '2026-07-13',
            'total' => 469000,
            'statut' => 'impayee',
        ]);
        $facture->lines()->createMany([
            ['label' => 'Robe de soirée jacquard — confection sur-mesure', 'montant' => 380000],
            ['label' => 'Tissu jacquard lyonnais (3,2 m)', 'montant' => 64000],
            ['label' => 'Essayages & retouches', 'montant' => 25000],
        ]);
    }
}
