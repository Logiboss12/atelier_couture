<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Quote extends Model
{
    protected $fillable = ['ref', 'client_id', 'modele', 'montant', 'statut'];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
