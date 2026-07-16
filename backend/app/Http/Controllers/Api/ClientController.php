<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Client;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function index()
    {
        return Client::withCount('orders')->with('measurements')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'ville' => 'nullable|string',
            'pays' => 'nullable|string',
            'tel' => 'nullable|string',
            'email' => 'required|email|unique:clients,email',
            'client_depuis' => 'nullable|integer',
        ]);

        return Client::create($data);
    }

    public function show(Client $client)
    {
        return $client->load('orders', 'quotes', 'invoices', 'measurements');
    }

    public function update(Request $request, Client $client)
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'ville' => 'nullable|string',
            'pays' => 'nullable|string',
            'tel' => 'nullable|string',
            'email' => 'sometimes|required|email|unique:clients,email,'.$client->id,
            'client_depuis' => 'nullable|integer',
        ]);

        $client->update($data);

        return $client;
    }

    public function destroy(Client $client)
    {
        $client->delete();

        return response()->noContent();
    }
}
