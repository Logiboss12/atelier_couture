<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CashMovement;
use Illuminate\Http\Request;

class CashMovementController extends Controller
{
    public function index(Request $request)
    {
        $query = CashMovement::with('order');

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
            'date' => 'required|date',
            'moyen_paiement' => 'required|in:mobile_money,especes,carte,virement',
            'montant' => 'required|integer|min:0',
            'categorie' => 'nullable|string',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        return CashMovement::create($data);
    }

    public function show(CashMovement $cashMovement)
    {
        return $cashMovement->load('order');
    }

    public function update(Request $request, CashMovement $cashMovement)
    {
        $data = $request->validate([
            'type' => 'sometimes|required|in:in,out',
            'label' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'moyen_paiement' => 'sometimes|required|in:mobile_money,especes,carte,virement',
            'montant' => 'sometimes|required|integer|min:0',
            'categorie' => 'nullable|string',
            'order_id' => 'nullable|exists:orders,id',
        ]);

        $cashMovement->update($data);

        return $cashMovement;
    }

    public function destroy(CashMovement $cashMovement)
    {
        $cashMovement->delete();

        return response()->noContent();
    }
}
