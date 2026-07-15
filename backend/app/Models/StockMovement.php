<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StockMovement extends Model
{
    protected $fillable = [
        'type', 'label', 'quantite_valeur', 'quantite_unite', 'fournisseur', 'date', 'fabric_stock_id', 'product_id', 'order_id',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function fabricStock(): BelongsTo
    {
        return $this->belongsTo(FabricStock::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
