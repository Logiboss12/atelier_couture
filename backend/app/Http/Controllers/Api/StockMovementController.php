<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\StockMovement;
use Illuminate\Http\Request;

class StockMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = StockMovement::with('fabricStock.textile', 'order');

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
            'order_id' => 'nullable|exists:orders,id',
        ]);

        return StockMovement::create($data);
    }

    public function show(StockMovement $stockMovement)
    {
        return $stockMovement->load('fabricStock.textile', 'order');
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
