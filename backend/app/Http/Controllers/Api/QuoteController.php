<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        return Quote::with('client')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ref' => 'required|string|unique:quotes,ref',
            'client_id' => 'required|exists:clients,id',
            'modele' => 'required|string',
            'montant' => 'required|integer|min:0',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        return Quote::create($data);
    }

    public function show(Quote $quote)
    {
        return $quote->load('client');
    }

    public function update(Request $request, Quote $quote)
    {
        $data = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'modele' => 'sometimes|required|string',
            'montant' => 'sometimes|required|integer|min:0',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        $quote->update($data);

        return $quote;
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();

        return response()->noContent();
    }
}
