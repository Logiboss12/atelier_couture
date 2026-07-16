<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Client extends Model
{
    protected $fillable = [
        'user_id', 'nom', 'ville', 'pays', 'tel', 'email', 'client_depuis',
        'poitrine', 'taille', 'hanches', 'epaule', 'manche', 'longueur',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

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

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function measurements(): HasMany
    {
        return $this->hasMany(Measurement::class)->latest('prise_le');
    }
}
