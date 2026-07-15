<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['collection', 'textile']);

        if ($request->filled('categorie')) {
            $query->where('categorie', $request->string('categorie'));
        }

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        if ($request->boolean('publie_uniquement')) {
            $query->where('publie', true);
        }

        return $query->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'collection_id' => 'nullable|exists:collections,id',
            'textile_id' => 'nullable|exists:textiles,id',
            'nom' => 'required|string',
            'type' => 'nullable|in:vetement,mercerie',
            'categorie' => 'nullable|string',
            'variantes' => 'nullable|integer|min:1',
            'stock' => 'nullable|integer|min:0',
            'stock_niveau' => 'nullable|integer|min:0|max:100',
            'prix' => 'required|integer|min:0',
            'statut' => 'nullable|in:ok,warn,danger',
            'publie' => 'nullable|boolean',
            'tailles' => 'nullable|array',
            'couleurs' => 'nullable|array',
        ]);

        return Product::create($data);
    }

    public function show(Product $product)
    {
        return $product->load('collection', 'textile');
    }

    public function update(Request $request, Product $product)
    {
        $data = $request->validate([
            'collection_id' => 'nullable|exists:collections,id',
            'textile_id' => 'nullable|exists:textiles,id',
            'nom' => 'sometimes|required|string',
            'type' => 'nullable|in:vetement,mercerie',
            'categorie' => 'nullable|string',
            'variantes' => 'nullable|integer|min:1',
            'stock' => 'nullable|integer|min:0',
            'stock_niveau' => 'nullable|integer|min:0|max:100',
            'prix' => 'sometimes|required|integer|min:0',
            'statut' => 'nullable|in:ok,warn,danger',
            'publie' => 'nullable|boolean',
            'tailles' => 'nullable|array',
            'couleurs' => 'nullable|array',
        ]);

        $product->update($data);

        return $product;
    }

    public function uploadImage(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|max:4096',
        ]);

        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $path = $request->file('image')->store('products', 'public');
        $product->update(['image' => $path]);

        return $product;
    }

    public function destroy(Product $product)
    {
        if ($product->image) {
            Storage::disk('public')->delete($product->image);
        }

        $product->delete();

        return response()->noContent();
    }
}
