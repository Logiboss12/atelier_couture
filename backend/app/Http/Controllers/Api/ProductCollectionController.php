<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductCollection;
use Illuminate\Http\Request;

class ProductCollectionController extends Controller
{
    public function index()
    {
        return ProductCollection::withCount('products')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'tile' => 'nullable|string',
        ]);

        return ProductCollection::create($data);
    }

    public function show(ProductCollection $productCollection)
    {
        return $productCollection->load('products');
    }

    public function update(Request $request, ProductCollection $productCollection)
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'tile' => 'nullable|string',
        ]);

        $productCollection->update($data);

        return $productCollection;
    }

    public function destroy(ProductCollection $productCollection)
    {
        $productCollection->delete();

        return response()->noContent();
    }
}
