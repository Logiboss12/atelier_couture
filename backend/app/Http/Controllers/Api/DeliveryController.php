<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use Illuminate\Http\Request;

class DeliveryController extends Controller
{
    public function index(Request $request)
    {
        $query = Delivery::with('order', 'client');

        if ($request->filled('date')) {
            $query->whereDate('date', $request->string('date'));
        }

        return $query->orderBy('date')->orderBy('heure')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'order_id' => 'nullable|exists:orders,id',
            'client_id' => 'nullable|exists:clients,id',
            'client_label' => 'required|string',
            'date' => 'required|date',
            'heure' => 'required|date_format:H:i',
            'zone' => 'required|string',
            'contenu' => 'required|string',
            'type' => 'required|in:individuelle,groupee',
            'statut' => 'required|in:a_planifier,planifiee,confirmee,en_route,livree',
        ]);

        return Delivery::create($data);
    }

    public function show(Delivery $delivery)
    {
        return $delivery->load('order', 'client');
    }

    public function update(Request $request, Delivery $delivery)
    {
        $data = $request->validate([
            'order_id' => 'nullable|exists:orders,id',
            'client_id' => 'nullable|exists:clients,id',
            'client_label' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'heure' => 'sometimes|required|date_format:H:i',
            'zone' => 'sometimes|required|string',
            'contenu' => 'sometimes|required|string',
            'type' => 'sometimes|required|in:individuelle,groupee',
            'statut' => 'sometimes|required|in:a_planifier,planifiee,confirmee,en_route,livree',
        ]);

        $delivery->update($data);

        return $delivery;
    }

    public function destroy(Delivery $delivery)
    {
        $delivery->delete();

        return response()->noContent();
    }
}
