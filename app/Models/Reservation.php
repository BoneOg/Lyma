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
        'expires_at',
        'is_special_hours',
        'special_hours_start',
        'special_hours_end',
    ];

    protected function casts(): array
    {
        return [
            'reservation_date' => 'date',
            'guest_count' => 'integer',
            'status' => 'string',
            'expires_at' => 'datetime',
            'is_special_hours' => 'boolean',
            'special_hours_start' => 'datetime',
            'special_hours_end' => 'datetime',
        ];
    }

    // Relationships
    public function timeSlot(): BelongsTo
    {
        return $this->belongsTo(TimeSlot::class);
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

    // Timer methods
    public function setExpirationTime(): void
    {
        $this->update(['expires_at' => now()->addMinutes(30)]);
    }

    public function isExpired(): bool
    {
        return $this->expires_at && $this->expires_at->isPast();
    }

    public function getRemainingSeconds(): int
    {
        if (!$this->expires_at) {
            return 0;
        }
        
        $remaining = $this->expires_at->diffInSeconds(now(), false);
        return max(0, $remaining);
    }

    public function getRemainingTimeFormatted(): string
    {
        $seconds = $this->getRemainingSeconds();
        $minutes = floor($seconds / 60);
        $remainingSeconds = $seconds % 60;
        return sprintf('%02d:%02d', $minutes, $remainingSeconds);
    }

    // Scope to get expired reservations
    public function scopeExpired($query)
    {
        return $query->where('expires_at', '<', now());
    }

    // Scope to get non-expired reservations
    public function scopeNotExpired($query)
    {
        return $query->where(function ($q) {
            $q->whereNull('expires_at')
              ->orWhere('expires_at', '>', now());
        });
    }

}
