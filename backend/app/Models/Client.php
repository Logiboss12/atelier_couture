<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'nom', 'ville', 'pays', 'tel', 'email', 'client_depuis',
        'poitrine', 'taille', 'hanches', 'epaule', 'manche', 'longueur',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    public function mensurations(): array
    {
        return [
            'poitrine' => $this->poitrine,
            'taille' => $this->taille,
            'hanches' => $this->hanches,
            'epaule' => $this->epaule,
            'manche' => $this->manche,
            'longueur' => $this->longueur,
        ];
    }
}
