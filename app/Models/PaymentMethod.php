<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    use HasFactory;

    protected $fillable = [
        'method_name',
        'method_type',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
            'method_type' => 'string',
        ];
    }

    // Relationships
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeByType($query, string $type)
    {
        return $query->where('method_type', $type);
    }

    public function scopeCreditCards($query)
    {
        return $query->where('method_type', 'credit_card');
    }

    public function scopeDebitCards($query)
    {
        return $query->where('method_type', 'debit_card');
    }

    public function scopeDigitalWallets($query)
    {
        return $query->where('method_type', 'digital_wallet');
    }

    // Helper methods
    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function isCreditCard(): bool
    {
        return $this->method_type === 'credit_card';
    }

    public function isDebitCard(): bool
    {
        return $this->method_type === 'debit_card';
    }

    public function isDigitalWallet(): bool
    {
        return $this->method_type === 'digital_wallet';
    }

    public function getDisplayNameAttribute(): string
    {
        return $this->method_name;
    }
}