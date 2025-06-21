<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class RestaurantTable extends Model
{
    use HasFactory;

    protected $fillable = [
        'table_number',
        'capacity',
        'status',
        'location_description',
    ];

    protected function casts(): array
    {
        return [
            'capacity' => 'integer',
            'status' => 'string',
        ];
    }

    // Relationships
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class, 'table_id');
    }

    // Scopes
    public function scopeAvailable($query)
    {
        return $query->where('status', 'available');
    }

    public function scopeUnderMaintenance($query)
    {
        return $query->where('status', 'under_maintenance');
    }

    public function scopeByCapacity($query, int $minCapacity)
    {
        return $query->where('capacity', '>=', $minCapacity);
    }

    // Helper methods
    public function isAvailable(): bool
    {
        return $this->status === 'available';
    }

    public function isUnderMaintenance(): bool
    {
        return $this->status === 'under_maintenance';
    }

    public function canAccommodate(int $guestCount): bool
    {
        return $this->capacity >= $guestCount && $this->isAvailable();
    }

    public function isAvailableForDateTime(Carbon $date, int $timeSlotId): bool
    {
        if (!$this->isAvailable()) {
            return false;
        }

        return !$this->reservations()
            ->where('reservation_date', $date->format('Y-m-d'))
            ->where('time_slot_id', $timeSlotId)
            ->whereIn('status', ['pending', 'confirmed'])
            ->exists();
    }

    public function getReservationsForDate(Carbon $date)
    {
        return $this->reservations()
            ->where('reservation_date', $date->format('Y-m-d'))
            ->whereIn('status', ['pending', 'confirmed'])
            ->with(['timeSlot', 'user'])
            ->get();
    }
}
