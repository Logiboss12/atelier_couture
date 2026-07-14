<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quote;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    public function index()
    {
        return Quote::with('client', 'order')->latest()->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ref' => 'nullable|string|unique:quotes,ref',
            'client_id' => 'required|exists:clients,id',
            'order_id' => 'nullable|exists:orders,id',
            'modele' => 'required|string',
            'montant' => 'required|integer|min:0',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        $data['ref'] ??= $this->generateRef();

        return Quote::create($data);
    }

    public function show(Quote $quote)
    {
        return $quote->load('client', 'order');
    }

    public function update(Request $request, Quote $quote)
    {
        $data = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'order_id' => 'nullable|exists:orders,id',
            'modele' => 'sometimes|required|string',
            'montant' => 'sometimes|required|integer|min:0',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        $quote->update($data);

        return $quote;
    }

    private function generateRef(): string
    {
        $last = Quote::query()->orderByDesc('id')->value('ref');
        $lastNumber = $last ? (int) substr($last, strrpos($last, '-') + 1) : 122;

        return 'DEV-'.($lastNumber + 1);
    }

    public function destroy(Quote $quote)
    {
        $quote->delete();

        return response()->noContent();
    }
}
