<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['client', 'textile', 'assignee']);

        if ($request->filled('statut')) {
            $query->where('statut', $request->string('statut'));
        }

        return $query->latest('echeance')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'ref' => 'required|string|unique:orders,ref',
            'client_id' => 'required|exists:clients,id',
            'textile_id' => 'nullable|exists:textiles,id',
            'team_member_id' => 'nullable|exists:team_members,id',
            'modele' => 'required|string',
            'statut' => 'required|in:recue,encours,finition,prete,livree',
            'echeance' => 'required|date',
        ]);

        return Order::create($data);
    }

    public function show(Order $order)
    {
        return $order->load('client', 'textile', 'assignee', 'invoices', 'deliveries');
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'textile_id' => 'nullable|exists:textiles,id',
            'team_member_id' => 'nullable|exists:team_members,id',
            'modele' => 'sometimes|required|string',
            'statut' => 'sometimes|required|in:recue,encours,finition,prete,livree',
            'echeance' => 'sometimes|required|date',
        ]);

        $previousStatut = $order->statut;

        $order->update($data);

        if (isset($data['statut']) && $data['statut'] !== $previousStatut) {
            $order->notifyStatusChange();
        }

        return $order;
    }

    public function destroy(Order $order)
    {
        $order->delete();

        return response()->noContent();
    }
}
