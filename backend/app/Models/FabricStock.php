<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class FabricStock extends Model
{
    protected $fillable = ['textile_id', 'quantite_metres', 'niveau', 'statut'];

    public function textile(): BelongsTo
    {
        return $this->belongsTo(Textile::class);
    }

    public function movements(): HasMany
    {
        return $this->hasMany(StockMovement::class);
    }
}
