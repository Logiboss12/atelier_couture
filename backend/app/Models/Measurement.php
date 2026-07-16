<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Measurement extends Model
{
    protected $fillable = [
        'client_id', 'type_vetement', 'label', 'valeurs', 'prise_le', 'notes',
    ];

    protected $casts = [
        'valeurs' => 'array',
        'prise_le' => 'date',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }
}
