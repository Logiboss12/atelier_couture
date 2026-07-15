<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Support\Facades\Storage;

class Textile extends Model
{
    protected $fillable = ['slug', 'nom', 'origine', 'tile', 'image', 'prix', 'publie'];

    protected $appends = ['image_url'];

    protected $casts = [
        'publie' => 'boolean',
    ];

    public function getImageUrlAttribute(): ?string
    {
        return $this->image ? Storage::disk('public')->url($this->image) : null;
    }

    public function products(): HasMany
    {
        return $this->hasMany(Product::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function fabricStocks(): HasMany
    {
        return $this->hasMany(FabricStock::class);
    }

    public function fabricStock(): HasOne
    {
        return $this->hasOne(FabricStock::class);
    }
}
