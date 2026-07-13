<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\FabricStock;
use Illuminate\Http\Request;

class FabricStockController extends Controller
{
    public function index()
    {
        return FabricStock::with('textile')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'textile_id' => 'required|exists:textiles,id',
            'quantite_metres' => 'required|integer|min:0',
            'niveau' => 'required|integer|min:0|max:100',
            'statut' => 'required|in:ok,warn,danger',
        ]);

        return FabricStock::create($data);
    }

    public function show(FabricStock $fabricStock)
    {
        return $fabricStock->load('textile', 'movements');
    }

    public function update(Request $request, FabricStock $fabricStock)
    {
        $data = $request->validate([
            'textile_id' => 'sometimes|required|exists:textiles,id',
            'quantite_metres' => 'sometimes|required|integer|min:0',
            'niveau' => 'sometimes|required|integer|min:0|max:100',
            'statut' => 'sometimes|required|in:ok,warn,danger',
        ]);

        $fabricStock->update($data);

        return $fabricStock;
    }

    public function destroy(FabricStock $fabricStock)
    {
        $fabricStock->delete();

        return response()->noContent();
    }
}
