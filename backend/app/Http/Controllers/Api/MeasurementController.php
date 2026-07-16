<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Measurement;
use Illuminate\Http\Request;

class MeasurementController extends Controller
{
    public function index(Request $request)
    {
        $query = Measurement::query();

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->integer('client_id'));
        }

        return $query->latest('prise_le')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'type_vetement' => 'required|string',
            'label' => 'nullable|string',
            'valeurs' => 'required|array',
            'prise_le' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $data['prise_le'] ??= now();

        return Measurement::create($data);
    }

    public function show(Measurement $measurement)
    {
        return $measurement;
    }

    public function update(Request $request, Measurement $measurement)
    {
        $data = $request->validate([
            'type_vetement' => 'sometimes|required|string',
            'label' => 'nullable|string',
            'valeurs' => 'sometimes|required|array',
            'prise_le' => 'nullable|date',
            'notes' => 'nullable|string',
        ]);

        $measurement->update($data);

        return $measurement;
    }

    public function destroy(Measurement $measurement)
    {
        $measurement->delete();

        return response()->noContent();
    }
}
