<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $query = Order::with(['client', 'textile', 'assignee', 'measurement']);

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
            'measurement_id' => 'nullable|exists:measurements,id',
            'team_member_id' => 'nullable|exists:team_members,id',
            'modele' => 'required|string',
            'instructions' => 'nullable|string',
            'statut' => 'required|exists:order_statuses,slug',
            'echeance' => 'required|date',
        ]);

        return Order::create($data);
    }

    public function show(Order $order)
    {
        return $order->load('client', 'textile', 'assignee', 'measurement', 'invoices', 'deliveries');
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'client_id' => 'sometimes|required|exists:clients,id',
            'textile_id' => 'nullable|exists:textiles,id',
            'measurement_id' => 'nullable|exists:measurements,id',
            'team_member_id' => 'nullable|exists:team_members,id',
            'modele' => 'sometimes|required|string',
            'instructions' => 'nullable|string',
            'statut' => 'sometimes|required|exists:order_statuses,slug',
            'echeance' => 'sometimes|required|date',
        ]);

        $previousStatut = $order->statut;

        $order->update($data);

        if (isset($data['statut']) && $data['statut'] !== $previousStatut) {
            $order->notifyStatusChange();
        }

        return $order;
    }

    public function uploadPhoto(Request $request, Order $order)
    {
        $request->validate([
            'photo' => 'required|image|max:4096',
        ]);

        $path = $request->file('photo')->store('orders');
        $order->update(['photos' => [...($order->photos ?? []), $path]]);

        return $order;
    }

    public function removePhoto(Request $request, Order $order)
    {
        $data = $request->validate([
            'path' => 'required|string',
        ]);

        if (in_array($data['path'], $order->photos ?? [], true)) {
            Storage::delete($data['path']);
            $order->update([
                'photos' => collect($order->photos)->reject(fn ($p) => $p === $data['path'])->values()->all(),
            ]);
        }

        return $order;
    }

    public function destroy(Order $order)
    {
        foreach ($order->photos ?? [] as $path) {
            Storage::delete($path);
        }

        $order->delete();

        return response()->noContent();
    }
}
