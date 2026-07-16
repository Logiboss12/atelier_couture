<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class DeliveryGroup extends Model
{
    protected $fillable = ['label', 'zone', 'date', 'heure_depart', 'statut'];

    protected $casts = [
        'date' => 'date',
    ];

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }
}
