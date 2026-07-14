<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::factory()->create([
            'name' => 'Admin Atelier',
            'email' => 'admin@atelier-couture.test',
            'password' => Hash::make('admin1234'),
            'role' => 'admin',
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
