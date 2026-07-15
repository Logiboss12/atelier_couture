<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FabricStock;
use App\Models\Product;
use App\Models\StockMovement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with('fabricStock.textile', 'product', 'order');

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return $query->latest('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'type' => 'required|in:in,out',
            'label' => 'required|string',
            'quantite_valeur' => 'required|numeric|min:0',
            'quantite_unite' => 'nullable|string',
            'fournisseur' => 'nullable|string',
            'date' => 'required|date',
            'fabric_stock_id' => 'nullable|exists:fabric_stocks,id',
            'product_id' => 'nullable|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $movement = DB::transaction(function () use ($data) {
            $movement = StockMovement::create($data);
            $sign = $data['type'] === 'in' ? 1 : -1;

            if (! empty($data['fabric_stock_id'])) {
                $fabricStock = FabricStock::find($data['fabric_stock_id']);
                $fabricStock->quantite_metres = max(0, $fabricStock->quantite_metres + $sign * $data['quantite_valeur']);
                $fabricStock->save();
            }

            if (! empty($data['product_id'])) {
                $product = Product::find($data['product_id']);
                $product->stock = max(0, $product->stock + $sign * $data['quantite_valeur']);
                $product->save();
            }

            return $movement;
        });

        return $movement->load('fabricStock.textile', 'product', 'order');
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load('fabricStock.textile', 'product', 'order');
    }

    public function update(Request $request, StockMovement $stockMovement)
    {
        $data = $request->validate([
            'type' => 'sometimes|required|in:in,out',
            'label' => 'sometimes|required|string',
            'quantite_valeur' => 'sometimes|required|numeric|min:0',
            'quantite_unite' => 'nullable|string',
            'fournisseur' => 'nullable|string',
            'date' => 'sometimes|required|date',
            'fabric_stock_id' => 'nullable|exists:fabric_stocks,id',
            'product_id' => 'nullable|exists:products,id',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $stockMovement->update($data);

        return $stockMovement;
    }

    public function destroy(StockMovement $stockMovement)
    {
        $stockMovement->delete();

        return response()->noContent();
    }
}
