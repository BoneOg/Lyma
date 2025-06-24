<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Carbon\Carbon;

class Reservation extends Model
{
    use HasFactory;

    protected $fillable = [
        'guest_first_name',
        'guest_last_name',
        'guest_email',
        'guest_phone',
        'reservation_date',
        'time_slot_id',
        'guest_count',
        'status',
        'special_requests',
    ];

    protected function casts(): array
    {
        return [
            'reservation_date' => 'date',
            'guest_count' => 'integer',
            'status' => 'string',
        ];
    }

    // Relationships
    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    public function payment(): HasOne
    {
        return $this->hasOne(Payment::class);
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeConfirmed($query)
    {
        return $query->where('status', 'confirmed');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function scopeForDate($query, Carbon $date)
    {
        return $query->where('reservation_date', $date->format('Y-m-d'));
    }

    public function scopeUpcoming($query)
    {
        return $query->where('reservation_date', '>=', now()->format('Y-m-d'));
    }

    public function scopePast($query)
    {
        return $query->where('reservation_date', '<', now()->format('Y-m-d'));
    }

    // Accessors

    public function getFormattedDateAttribute(): string
    {
        return $this->reservation_date->format('M d, Y');
    }

    public function getIsUpcomingAttribute(): bool
    {
        return $this->reservation_date->isFuture() || $this->reservation_date->isToday();
    }

    public function getIsPastAttribute(): bool
    {
        return $this->reservation_date->isPast() && !$this->reservation_date->isToday();
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isConfirmed(): bool
    {
        return $this->status === 'confirmed';
    }

    public function isCompleted(): bool
    {
        return $this->status === 'completed';
    }

    public function isCancelled(): bool
    {
        return $this->status === 'cancelled';
    }

    public function canBeModified(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']) && $this->is_upcoming;
    }

    public function canBeCancelled(): bool
    {
        return in_array($this->status, ['pending', 'confirmed']) && $this->is_upcoming;
    }

    public function confirm(): void
    {
        $this->update(['status' => 'confirmed']);
    }

    public function cancel(): void
    {
        $this->update(['status' => 'cancelled']);
    }

    public function complete(): void
    {
        $this->update(['status' => 'completed']);
    }

    public function hasPaidPayment(): bool
    {
        return $this->payments()->where('payment_status', 'completed')->exists();
    }

    public function getReservationFee(): float
    {
        return SystemSetting::getReservationFee();
    }

}
