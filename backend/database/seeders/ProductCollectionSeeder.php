<?php

namespace Database\Seeders;

use App\Models\ProductCollection;
use Illuminate\Database\Seeder;

class ProductCollectionSeeder extends Seeder
{
    public function run(): void
    {
        $collections = [
            ['nom' => 'Racines', 'tile' => 'tile-wax'],
            ['nom' => 'Horizon Paris', 'tile' => 'tile-jacquard'],
            ['nom' => 'Cérémonie', 'tile' => 'tile-kente'],
            ['nom' => 'Mariées', 'tile' => 'tile-dentelle'],
        ];

        foreach ($collections as $collection) {
            ProductCollection::create($collection);
        }
    }
}
