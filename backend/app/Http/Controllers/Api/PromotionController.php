<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Promotion;
use Illuminate\Http\Request;

class PromotionController extends Controller
{
    public function index()
    {
        return Promotion::latest('debut')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'debut' => 'required|date',
            'fin' => 'required|date|after_or_equal:debut',
            'cible' => 'required|string',
            'reduction' => 'required|string',
            'statut' => 'required|in:ok,info,neutral',
            'statut_label' => 'required|string',
            'ca' => 'nullable|integer|min:0',
        ]);

        return Promotion::create($data);
    }

    public function show(Promotion $promotion)
    {
        return $promotion;
    }

    public function update(Request $request, Promotion $promotion)
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'debut' => 'sometimes|required|date',
            'fin' => 'sometimes|required|date|after_or_equal:debut',
            'cible' => 'sometimes|required|string',
            'reduction' => 'sometimes|required|string',
            'statut' => 'sometimes|required|in:ok,info,neutral',
            'statut_label' => 'sometimes|required|string',
            'ca' => 'nullable|integer|min:0',
        ]);

        $promotion->update($data);

        return $promotion;
    }

    public function destroy(Promotion $promotion)
    {
        $promotion->delete();

        return response()->noContent();
    }
}
