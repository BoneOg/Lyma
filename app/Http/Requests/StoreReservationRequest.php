<?php

namespace App\Http\Requests;

use App\Models\SystemSetting;
use App\Models\TimeSlot;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreReservationRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'guest_first_name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z\s]+$/',
            ],
            'guest_last_name' => [
                'required',
                'string',
                'max:50',
                'regex:/^[a-zA-Z\s]+$/',
            ],
            'guest_email' => [
                'required',
                'email',
                'max:100',
            ],
            'guest_phone' => [
                'required',
                'string',
                'max:20',
                'regex:/^[\d\s\-\+]+$/',
            ],
            'special_requests' => [
                'nullable',
                'string',
                'max:500',
            ],
            'reservation_date' => [
                'required',
                'date',
                'after_or_equal:' . $this->getMinBookingDate(),
                'before_or_equal:' . $this->getMaxBookingDate(),
            ],
            'time_slot_id' => [
                'nullable',
                'exists:time_slots,id',
                function ($attribute, $value, $fail) {
                    if ($value !== null) {
                        $timeSlot = TimeSlot::find($value);
                        if (!$timeSlot || !$timeSlot->is_active) {
                            $fail('The selected time slot is not available.');
                        }
                    }
                },
                function ($attribute, $value, $fail) {
                    $isSpecialHours = $this->input('is_special_hours', false);
                    if ($value === null && !$isSpecialHours) {
                        $fail('Either a time slot must be selected or special hours must be enabled.');
                    }
                },
            ],
            'is_special_hours' => [
                'boolean',
            ],
            'guest_count' => [
                'required',
                'integer',
                'min:' . SystemSetting::get('min_guest_size', 1),
                'max:' . SystemSetting::get('max_guest_size', 10),
            ],
        ];
    }

    /**
     * Get the validation error messages.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        $maxAdvanceDays = SystemSetting::getMaxAdvanceBookingDays();

        return [
            'guest_first_name.required' => 'First name is required.',
            'guest_first_name.regex' => 'First name may only contain letters and spaces.',
            'guest_last_name.required' => 'Last name is required.',
            'guest_last_name.regex' => 'Last name may only contain letters and spaces.',
            'guest_email.required' => 'Email address is required.',
            'guest_email.email' => 'Please enter a valid email address.',
            'guest_phone.required' => 'Phone number is required.',
            'guest_phone.regex' => 'Phone number may only contain numbers, spaces, hyphens, and plus signs.',
            'special_requests.max' => 'Special requests cannot exceed 500 characters.',
            'reservation_date.required' => 'Reservation date is required.',
            'reservation_date.after_or_equal' => "Reservations must be made for future dates.",
            'reservation_date.before_or_equal' => "Reservations can only be made up to {$maxAdvanceDays} days in advance.",

            'time_slot_id.exists' => 'Selected time slot is invalid.',
            'guest_count.required' => 'Number of guests is required.',
            'guest_count.min' => 'At least ' . SystemSetting::get('min_guest_size', 1) . ' guest is required.',
            'guest_count.max' => 'Maximum of ' . SystemSetting::get('max_guest_size', 10) . ' guests allowed.',
        ];
    }

    /**
     * Get the minimum booking date based on system settings.
     */
    private function getMinBookingDate(): string
    {
        return Carbon::now()->format('Y-m-d H:i:s');
    }

    /**
     * Get the maximum booking date based on system settings.
     */
    private function getMaxBookingDate(): string
    {
        $maxAdvanceDays = SystemSetting::getMaxAdvanceBookingDays();
        return Carbon::now()->addDays($maxAdvanceDays)->format('Y-m-d H:i:s');
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Trim whitespace from string inputs
        $this->merge([
            'guest_first_name' => trim($this->guest_first_name ?? ''),
            'guest_last_name' => trim($this->guest_last_name ?? ''),
            'guest_email' => trim($this->guest_email ?? ''),
            'guest_phone' => trim($this->guest_phone ?? ''),
            'special_requests' => trim($this->special_requests ?? ''),
        ]);
    }
}