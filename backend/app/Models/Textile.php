<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Textile extends Model
{
    protected $fillable = ['slug', 'nom', 'origine', 'tile'];

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
}
