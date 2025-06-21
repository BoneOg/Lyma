<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Payment extends Model
{
    use HasFactory;

    protected $fillable = [
        'reservation_id',
        'payment_method_id',
        'amount',
        'currency',
        'transaction_id',
        'gateway_response',
        'payment_status',
        'payment_date',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'gateway_response' => 'array',
            'payment_date' => 'datetime',
            'payment_status' => 'string',
        ];
    }

    // Relationships
    public function reservation(): BelongsTo
    {
        return $this->belongsTo(Reservation::class);
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('payment_status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('payment_status', 'completed');
    }

    public function scopeFailed($query)
    {
        return $query->where('payment_status', 'failed');
    }

    public function scopeForDateRange($query, Carbon $startDate, Carbon $endDate)
    {
        return $query->whereBetween('payment_date', [$startDate, $endDate]);
    }

    // Accessors
    public function getFormattedAmountAttribute(): string
    {
        return "₱" . number_format($this->amount, 2);
    }

    public function getPaymentDateFormattedAttribute(): string
    {
        return $this->payment_date ? $this->payment_date->format('M d, Y g:i A') : 'N/A';
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->payment_status === 'pending';
    }

    public function isCompleted(): bool
    {
        return $this->payment_status === 'completed';
    }

    public function isFailed(): bool
    {
        return $this->payment_status === 'failed';
    }

    public function markAsCompleted(string $transactionId = null, array $gatewayResponse = null): void
    {
        $this->update([
            'payment_status' => 'completed',
            'payment_date' => now(),
            'transaction_id' => $transactionId ?? $this->transaction_id,
            'gateway_response' => $gatewayResponse ?? $this->gateway_response,
        ]);

        // Auto-confirm reservation when payment is completed
        if ($this->reservation && $this->reservation->isPending()) {
            $this->reservation->confirm();
        }
    }

    public function markAsFailed(array $gatewayResponse = null): void
    {
        $this->update([
            'payment_status' => 'failed',
            'gateway_response' => $gatewayResponse ?? $this->gateway_response,
        ]);
    }

    public function getPayMayaPaymentId(): ?string
    {
        return $this->gateway_response['id'] ?? null;
    }

    public function getPayMayaStatus(): ?string
    {
        return $this->gateway_response['status'] ?? null;
    }

    public function hasGatewayResponse(): bool
    {
        return !empty($this->gateway_response);
    }
}