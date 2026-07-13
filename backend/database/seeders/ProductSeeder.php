<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductCollection;
use App\Models\Textile;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $collections = ProductCollection::all()->keyBy('nom');
        $textiles = Textile::all()->keyBy('slug');

        $products = [
            ['nom' => 'Grand boubou brodé', 'collection' => 'Racines', 'tissu' => 'wax', 'categorie' => 'Grand boubou', 'variantes' => 4, 'stock' => 12, 'stock_niveau' => 60, 'prix' => 145000, 'statut' => 'ok', 'publie' => true, 'tailles' => ['S', 'M', 'L', 'XL'], 'couleurs' => ['#ff8a3d', '#d1451b', '#160a12']],
            ['nom' => 'Robe de soirée jacquard', 'collection' => 'Horizon Paris', 'tissu' => 'jacquard', 'categorie' => 'Robe', 'variantes' => 3, 'stock' => 5, 'stock_niveau' => 30, 'prix' => 380000, 'statut' => 'warn', 'publie' => true, 'tailles' => ['S', 'M', 'L'], 'couleurs' => ['#7b5cff', '#4a34b8']],
            ['nom' => 'Tailleur trois pièces', 'collection' => 'Horizon Paris', 'tissu' => 'bazin', 'categorie' => 'Tailleur', 'variantes' => 5, 'stock' => 8, 'stock_niveau' => 55, 'prix' => 265000, 'statut' => 'ok', 'publie' => true, 'tailles' => ['M', 'L', 'XL', 'XXL'], 'couleurs' => ['#c9a227', '#160a12']],
            ['nom' => 'Robe de mariée dentelle', 'collection' => 'Mariées', 'tissu' => 'dentelle', 'categorie' => 'Robe', 'variantes' => 2, 'stock' => 2, 'stock_niveau' => 12, 'prix' => 650000, 'statut' => 'danger', 'publie' => true, 'tailles' => ['S', 'M'], 'couleurs' => ['#f4f0ea']],
            ['nom' => 'Ensemble kente cérémonie', 'collection' => 'Cérémonie', 'tissu' => 'kente', 'categorie' => 'Grand boubou', 'variantes' => 4, 'stock' => 10, 'stock_niveau' => 68, 'prix' => 210000, 'statut' => 'ok', 'publie' => true, 'tailles' => ['S', 'M', 'L', 'XL'], 'couleurs' => ['#f2c94c', '#0a7d3c', '#c8102e']],
            ['nom' => 'Boubou prêt-à-porter', 'collection' => 'Racines', 'tissu' => 'hibiscus', 'categorie' => 'Prêt-à-porter', 'variantes' => 3, 'stock' => 0, 'stock_niveau' => 0, 'prix' => 98000, 'statut' => 'danger', 'publie' => false, 'tailles' => ['S', 'M', 'L'], 'couleurs' => ['#ff5da2', '#8a1e5a']],
            ['nom' => 'Costume indigo', 'collection' => 'Horizon Paris', 'tissu' => 'indigo', 'categorie' => 'Tailleur', 'variantes' => 3, 'stock' => 6, 'stock_niveau' => 38, 'prix' => 365000, 'statut' => 'warn', 'publie' => true, 'tailles' => ['M', 'L', 'XL'], 'couleurs' => ['#2233a8', '#38208f']],
            ['nom' => 'Veste bazin brodée', 'collection' => 'Cérémonie', 'tissu' => 'bazin', 'categorie' => 'Prêt-à-porter', 'variantes' => 4, 'stock' => 15, 'stock_niveau' => 82, 'prix' => 155000, 'statut' => 'ok', 'publie' => false, 'tailles' => ['S', 'M', 'L', 'XL'], 'couleurs' => ['#c9a227']],
            ['nom' => 'Boubou hibiscus enfant', 'collection' => 'Racines', 'tissu' => 'hibiscus', 'categorie' => 'Enfant', 'variantes' => 1, 'stock' => 0, 'stock_niveau' => 0, 'prix' => 68000, 'statut' => 'danger', 'publie' => true, 'tailles' => ['4A', '6A', '8A'], 'couleurs' => ['#ff5da2']],
            ['nom' => 'Robe soie duchesse', 'collection' => 'Mariées', 'tissu' => 'soie', 'categorie' => 'Robe', 'variantes' => 1, 'stock' => 6, 'stock_niveau' => 45, 'prix' => 298000, 'statut' => 'ok', 'publie' => true, 'tailles' => ['S', 'M', 'L'], 'couleurs' => ['#ff9ecb']],
        ];

        foreach ($products as $product) {
            Product::create([
                'collection_id' => $collections[$product['collection']]->id,
                'textile_id' => $textiles[$product['tissu']]->id,
                'nom' => $product['nom'],
                'categorie' => $product['categorie'],
                'variantes' => $product['variantes'],
                'stock' => $product['stock'],
                'stock_niveau' => $product['stock_niveau'],
                'prix' => $product['prix'],
                'statut' => $product['statut'],
                'publie' => $product['publie'],
                'tailles' => $product['tailles'],
                'couleurs' => $product['couleurs'],
            ]);
        }
    }
}
