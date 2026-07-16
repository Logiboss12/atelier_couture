<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private const DEFAULT_WHATSAPP_TEMPLATE = 'Bonjour {client}, votre commande {ref} ({modele}) est passée à « {statut} ». — Maison Ìró';

    public function index()
    {
        return Setting::pluck('value', 'key');
    }

    /**
     * Lecture non sensible, accessible au personnel (admin + employé) pour préparer
     * le message WhatsApp depuis le Kanban des commandes.
     */
    public function whatsappTemplate()
    {
        return response()->json([
            'whatsapp_template_status' => Setting::get('whatsapp_template_status', self::DEFAULT_WHATSAPP_TEMPLATE),
        ]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => 'required|array',
            'settings.*' => 'nullable|string',
        ]);

        foreach ($data['settings'] as $key => $value) {
            Setting::set($key, $value);
        }

        return Setting::pluck('value', 'key');
    }
}
