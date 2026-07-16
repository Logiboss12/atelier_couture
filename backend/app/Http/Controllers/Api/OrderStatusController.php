<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderStatus;
use Illuminate\Http\Request;

class OrderStatusController extends Controller
{
    public function index()
    {
        return OrderStatus::orderBy('position')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'slug' => 'required|string|alpha_dash|max:50|unique:order_statuses,slug',
            'label' => 'required|string|max:100',
            'color' => 'required|string|max:50',
            'is_final' => 'nullable|boolean',
        ]);

        $data['position'] = (int) OrderStatus::max('position') + 1;

        return OrderStatus::create($data);
    }

    public function update(Request $request, OrderStatus $orderStatus)
    {
        $data = $request->validate([
            'label' => 'sometimes|required|string|max:100',
            'color' => 'sometimes|required|string|max:50',
            'is_final' => 'nullable|boolean',
        ]);

        $orderStatus->update($data);

        return $orderStatus;
    }

    public function destroy(OrderStatus $orderStatus)
    {
        if (OrderStatus::count() <= 1) {
            return response()->json(['message' => 'Il doit rester au moins une étape dans le workflow.'], 422);
        }

        if (Order::where('statut', $orderStatus->slug)->exists()) {
            return response()->json(['message' => 'Des commandes utilisent encore cette étape. Déplacez-les avant de la supprimer.'], 422);
        }

        $orderStatus->delete();

        return response()->noContent();
    }

    public function reorder(Request $request)
    {
        $data = $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|integer|exists:order_statuses,id',
        ]);

        foreach ($data['ids'] as $index => $id) {
            OrderStatus::where('id', $id)->update(['position' => $index]);
        }

        return OrderStatus::orderBy('position')->get();
    }
}
