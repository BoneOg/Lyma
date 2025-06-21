<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Carbon\Carbon;

class TimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'start_time',
        'end_time',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'start_time' => 'datetime:H:i:s',
            'end_time' => 'datetime:H:i:s',
            'is_active' => 'boolean',
        ];
    }

    // Relationships
    public function reservations(): HasMany
    {
        return $this->hasMany(Reservation::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeInactive($query)
    {
        return $query->where('is_active', false);
    }

    // Accessors
    public function getFormattedTimeAttribute(): string
    {
        return Carbon::parse($this->start_time)->format('g:i A') . ' - ' . 
               Carbon::parse($this->end_time)->format('g:i A');
    }

    public function getStartTimeFormattedAttribute(): string
    {
        return Carbon::parse($this->start_time)->format('g:i A');
    }

    public function getEndTimeFormattedAttribute(): string
    {
        return Carbon::parse($this->end_time)->format('g:i A');
    }

    // Helper methods
    public function isActive(): bool
    {
        return $this->is_active;
    }

    public function getDurationInMinutes(): int
    {
        $start = Carbon::parse($this->start_time);
        $end = Carbon::parse($this->end_time);
        return $end->diffInMinutes($start);
    }

    public function getAvailableTablesForDate(Carbon $date, int $guestCount = 1)
    {
        return RestaurantTable::available()
            ->byCapacity($guestCount)
            ->whereDoesntHave('reservations', function ($query) use ($date) {
                $query->where('reservation_date', $date->format('Y-m-d'))
                      ->where('time_slot_id', $this->id)
                      ->whereIn('status', ['pending', 'confirmed']);
            })
            ->get();
    }
}
