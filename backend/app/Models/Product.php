<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Storage;

class Product extends Model
{
    protected $fillable = [
        'collection_id', 'textile_id', 'nom', 'type', 'categorie', 'variantes',
        'stock', 'stock_niveau', 'prix', 'statut', 'publie', 'tailles', 'couleurs', 'image',
    ];

    protected $appends = ['image_url'];

    protected $casts = [
        'tailles' => 'array',
        'couleurs' => 'array',
        'publie' => 'boolean',
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(ProductCollection::class, 'collection_id');
    }

    public function textile(): BelongsTo
    {
        return $this->belongsTo(Textile::class);
    }

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }
}
