<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Delivery;
use App\Models\DeliveryGroup;
use Illuminate\Http\Request;

class DeliveryGroupController extends Controller
{
    public function index(Request $request)
    {
        $query = DeliveryGroup::with(['deliveries.client', 'deliveries.order']);

        if ($request->filled('date')) {
            $query->whereDate('date', $request->string('date'));
        }

        return $query->orderBy('date')->orderBy('heure_depart')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'label' => 'required|string',
            'zone' => 'required|string',
            'date' => 'required|date',
            'heure_depart' => 'nullable|date_format:H:i',
            'statut' => 'nullable|in:a_planifier,planifiee,confirmee,en_route,livree',
        ]);

        return DeliveryGroup::create($data)->load('deliveries');
    }

    public function show(DeliveryGroup $deliveryGroup)
    {
        return $deliveryGroup->load('deliveries.client', 'deliveries.order');
    }

    public function update(Request $request, DeliveryGroup $deliveryGroup)
    {
        $data = $request->validate([
            'label' => 'sometimes|required|string',
            'zone' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'heure_depart' => 'nullable|date_format:H:i',
            'statut' => 'sometimes|required|in:a_planifier,planifiee,confirmee,en_route,livree',
        ]);

        $deliveryGroup->update($data);

        // Une tournée avance en bloc : ses livraisons suivent le même statut.
        if (isset($data['statut'])) {
            $deliveryGroup->deliveries()->update(['statut' => $data['statut']]);
        }

        return $deliveryGroup->load('deliveries.client', 'deliveries.order');
    }

    public function destroy(DeliveryGroup $deliveryGroup)
    {
        $deliveryGroup->deliveries()->update(['delivery_group_id' => null, 'type' => 'individuelle']);
        $deliveryGroup->delete();

        return response()->noContent();
    }

    public function addDelivery(DeliveryGroup $deliveryGroup, Delivery $delivery)
    {
        $delivery->update(['delivery_group_id' => $deliveryGroup->id, 'type' => 'groupee']);

        return $deliveryGroup->load('deliveries.client', 'deliveries.order');
    }

    public function removeDelivery(DeliveryGroup $deliveryGroup, Delivery $delivery)
    {
        abort_unless($delivery->delivery_group_id === $deliveryGroup->id, 404);

        $delivery->update(['delivery_group_id' => null, 'type' => 'individuelle']);

        return $deliveryGroup->load('deliveries.client', 'deliveries.order');
    }
}
