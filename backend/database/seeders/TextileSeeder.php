<?php

namespace Database\Seeders;

use App\Models\Textile;
use Illuminate\Database\Seeder;

class TextileSeeder extends Seeder
{
    public function run(): void
    {
        $textiles = [
            ['slug' => 'wax', 'nom' => 'Wax Hollandais', 'origine' => 'Dakar', 'tile' => 'tile-wax'],
            ['slug' => 'kente', 'nom' => 'Kente tissé', 'origine' => 'Accra', 'tile' => 'tile-kente'],
            ['slug' => 'indigo', 'nom' => 'Bogolan Indigo', 'origine' => 'Bamako', 'tile' => 'tile-indigo'],
            ['slug' => 'hibiscus', 'nom' => 'Percale Hibiscus', 'origine' => 'Dakar', 'tile' => 'tile-hibiscus'],
            ['slug' => 'bazin', 'nom' => 'Bazin Riche', 'origine' => 'Thiès', 'tile' => 'tile-bazin'],
            ['slug' => 'jacquard', 'nom' => 'Jacquard Lyonnais', 'origine' => 'Paris', 'tile' => 'tile-jacquard'],
            ['slug' => 'dentelle', 'nom' => 'Dentelle de Calais', 'origine' => 'Paris', 'tile' => 'tile-dentelle'],
            ['slug' => 'soie', 'nom' => 'Soie Duchesse', 'origine' => 'Paris', 'tile' => 'tile-soie'],
        ];

        foreach ($textiles as $textile) {
            Textile::create($textile);
        }
    }
}
