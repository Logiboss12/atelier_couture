<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['collection', 'textile']);

        if ($request->filled('categorie')) {
            $query->where('categorie', $request->string('categorie'));
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
            'categorie' => 'nullable|string',
            'variantes' => 'nullable|integer|min:1',
            'stock' => 'nullable|integer|min:0',
            'stock_niveau' => 'nullable|integer|min:0|max:100',
            'prix' => 'required|integer|min:0',
            'statut' => 'nullable|in:ok,warn,danger',
            'publie' => 'nullable|boolean',
            'tailles' => 'nullable|array',
            'couleurs' => 'nullable|array',
            'image' => 'nullable|string',
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
            'categorie' => 'nullable|string',
            'variantes' => 'nullable|integer|min:1',
            'stock' => 'nullable|integer|min:0',
            'stock_niveau' => 'nullable|integer|min:0|max:100',
            'prix' => 'sometimes|required|integer|min:0',
            'statut' => 'nullable|in:ok,warn,danger',
            'publie' => 'nullable|boolean',
            'tailles' => 'nullable|array',
            'couleurs' => 'nullable|array',
            'image' => 'nullable|string',
        ]);

        $product->update($data);

        return $product;
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return response()->noContent();
    }
}
