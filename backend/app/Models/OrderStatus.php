<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OrderStatus extends Model
{
    protected $fillable = ['slug', 'label', 'color', 'position', 'is_final'];

    protected $casts = [
        'position' => 'integer',
        'is_final' => 'boolean',
    ];
}
