<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class Order extends Model
{
    private const STATUS_LABELS = [
        'recue' => 'Reçue',
        'encours' => 'En cours',
        'finition' => 'Finition',
        'prete' => 'Prête',
        'livree' => 'Livrée',
    ];

    protected $fillable = [
        'ref', 'client_id', 'textile_id', 'measurement_id', 'team_member_id', 'modele', 'instructions', 'photos', 'statut', 'echeance',
    ];

    protected $appends = ['photo_urls'];

    protected $casts = [
        'echeance' => 'date',
        'photos' => 'array',
    ];

    public function getPhotoUrlsAttribute(): array
    {
        return collect($this->photos ?? [])
            ->map(fn (string $path) => ['path' => $path, 'url' => Storage::url($path)])
            ->values()
            ->all();
    }

    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    public function textile(): BelongsTo
    {
        return $this->belongsTo(Textile::class);
    }

    public function measurement(): BelongsTo
    {
        return $this->belongsTo(Measurement::class);
    }

    public function assignee(): BelongsTo
    {
        return $this->belongsTo(TeamMember::class, 'team_member_id');
    }

    public function invoices(): HasMany
    {
        return $this->hasMany(Invoice::class);
    }

    public function quotes(): HasMany
    {
        return $this->hasMany(Quote::class);
    }

    public function deliveries(): HasMany
    {
        return $this->hasMany(Delivery::class);
    }

    public function cashMovements(): HasMany
    {
        return $this->hasMany(CashMovement::class);
    }

    public function notifications(): HasMany
    {
        return $this->hasMany(Notification::class);
    }

    public function notifyStatusChange(): void
    {
        if (! $this->client_id) {
            return;
        }

        $label = self::STATUS_LABELS[$this->statut] ?? $this->statut;

        $this->notifications()->create([
            'client_id' => $this->client_id,
            'type' => 'order_status',
            'message' => "Votre commande {$this->ref} ({$this->modele}) est passée à « {$label} ».",
        ]);
    }
}
