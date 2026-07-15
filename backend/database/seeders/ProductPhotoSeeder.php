<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Storage;

class ProductPhotoSeeder extends Seeder
{
    /**
     * Only fills products that don't already have a photo (never overwrites
     * an image an admin has already uploaded).
     */
    public function run(): void
    {
        $assetsPath = base_path('../frontend/src/assets/images');

        $photosByProductName = [
            'Grand boubou brodé' => 'images7.jpg',
            'Robe de soirée jacquard' => 'images3.jpg',
            'Tailleur trois pièces' => 'costume3.jpg',
            'Robe de mariée dentelle' => 'images2.jpg',
            'Ensemble kente cérémonie' => 'images10.jpg',
            'Boubou prêt-à-porter' => 'images5.jpg',
            'Costume indigo' => 'costume1.jpg',
            'Veste bazin brodée' => 'images1.jpg',
            'Boubou hibiscus enfant' => 'images4.jpg',
            'Robe soie duchesse' => 'images9.jpg',
        ];

        foreach ($photosByProductName as $nom => $filename) {
            $product = Product::where('nom', $nom)->whereNull('image')->first();
            $sourceFile = $assetsPath.DIRECTORY_SEPARATOR.$filename;

            if (! $product || ! is_file($sourceFile)) {
                continue;
            }

            $extension = pathinfo($filename, PATHINFO_EXTENSION);
            $targetPath = 'products/'.uniqid('seed_').'.'.$extension;

            Storage::put($targetPath, file_get_contents($sourceFile));
            $product->update(['image' => $targetPath]);
        }
    }
}
