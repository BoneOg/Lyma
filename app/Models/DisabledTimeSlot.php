<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DisabledTimeSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'date',
        'time_slot_id',
        'is_closed',
        'special_start',
        'special_end',
    ];
}
