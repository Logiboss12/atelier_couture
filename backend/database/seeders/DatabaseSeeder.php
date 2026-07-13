<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $this->call([
            TextileSeeder::class,
            TeamMemberSeeder::class,
            ClientSeeder::class,
            ProductCollectionSeeder::class,
            ProductSeeder::class,
            OrderSeeder::class,
            QuoteSeeder::class,
            InvoiceSeeder::class,
            FabricStockSeeder::class,
            StockMovementSeeder::class,
            PromotionSeeder::class,
            EventSeeder::class,
            CashMovementSeeder::class,
            DeliverySeeder::class,
        ]);
    }
}
