<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Event;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index()
    {
        return Event::orderBy('date')->get();
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nom' => 'required|string',
            'date' => 'required|date',
            'lieu' => 'required|string',
            'statut' => 'required|in:ok,info,neutral',
            'statut_label' => 'required|string',
            'remplissage' => 'required|integer|min:0|max:100',
            'capacite' => 'required|string',
        ]);

        return Event::create($data);
    }

    public function show(Event $event)
    {
        return $event;
    }

    public function update(Request $request, Event $event)
    {
        $data = $request->validate([
            'nom' => 'sometimes|required|string',
            'date' => 'sometimes|required|date',
            'lieu' => 'sometimes|required|string',
            'statut' => 'sometimes|required|in:ok,info,neutral',
            'statut_label' => 'sometimes|required|string',
            'remplissage' => 'sometimes|required|integer|min:0|max:100',
            'capacite' => 'sometimes|required|string',
        ]);

        $event->update($data);

        return $event;
    }

    public function destroy(Event $event)
    {
        $event->delete();

        return response()->noContent();
    }
}
