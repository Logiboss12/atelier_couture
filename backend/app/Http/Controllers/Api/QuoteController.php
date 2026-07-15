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
            'montant' => 'required_without_all:montant_matieres,montant_main_oeuvre|nullable|integer|min:0',
            'montant_matieres' => 'nullable|integer|min:0',
            'montant_main_oeuvre' => 'nullable|integer|min:0',
            'echeance' => 'nullable|date',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        $data['ref'] ??= $this->generateRef();

        if (isset($data['montant_matieres']) || isset($data['montant_main_oeuvre'])) {
            $data['montant'] = ($data['montant_matieres'] ?? 0) + ($data['montant_main_oeuvre'] ?? 0);
        }

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
            'montant_matieres' => 'nullable|integer|min:0',
            'montant_main_oeuvre' => 'nullable|integer|min:0',
            'echeance' => 'nullable|date',
            'statut' => 'nullable|in:en_attente,accepte,refuse',
        ]);

        if (isset($data['montant_matieres']) || isset($data['montant_main_oeuvre'])) {
            $data['montant'] = ($data['montant_matieres'] ?? $quote->montant_matieres ?? 0)
                + ($data['montant_main_oeuvre'] ?? $quote->montant_main_oeuvre ?? 0);
        }

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
