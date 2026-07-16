<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Invoice extends Model
{
    protected $fillable = [
        'numero', 'client_id', 'order_id', 'date', 'total', 'statut',
        'mode_paiement', 'cinetpay_transaction_id', 'adresse_livraison', 'ville_livraison', 'tel_livraison',
    ];

    protected $casts = [
        'date' => 'date',
    ];

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    public function lines(): HasMany
    {
        return $this->hasMany(InvoiceLine::class);
    }

    public function markAsPaid(): void
    {
        $previousStatut = $this->statut;
        $wasUnpaid = $previousStatut !== 'payee';

        $this->update(['statut' => 'payee']);

        if ($wasUnpaid) {
            CashMovement::create([
                'type' => 'in',
                'label' => "Facture {$this->numero}",
                'date' => now(),
                'moyen_paiement' => $this->cashMoyenPaiement(),
                'montant' => $this->total,
                'order_id' => $this->order_id,
            ]);
        }

        if (! in_array($previousStatut, ['payee', 'partielle']) && $this->order && $this->order->statut === 'recue') {
            $this->order->update(['statut' => 'encours']);
            $this->order->notifyStatusChange();
        }
    }

    public function cashMoyenPaiement(): string
    {
        return match ($this->mode_paiement) {
            'especes_livraison' => 'especes',
            'carte', 'mobile_money' => $this->mode_paiement,
            default => 'especes',
        };
    }
}
