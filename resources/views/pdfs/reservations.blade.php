<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Reservations - {{ $date }}</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
            background-color: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #3D401E;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .restaurant-name {
            font-size: 28px;
            font-weight: bold;
            color: #3D401E;
            margin-bottom: 5px;
        }
        .restaurant-subtitle {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .restaurant-info {
            font-size: 12px;
            color: #888;
            line-height: 1.4;
        }
        .date-header {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 25px;
            text-align: center;
        }
        .date-title {
            font-size: 20px;
            font-weight: bold;
            color: #3D401E;
            margin-bottom: 5px;
        }
        .date-subtitle {
            font-size: 14px;
            color: #666;
        }
        .reservations-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .reservations-table th {
            background-color: #3D401E;
            color: white;
            padding: 12px 8px;
            text-align: left;
            font-weight: bold;
            font-size: 12px;
        }
        .reservations-table td {
            padding: 10px 8px;
            border-bottom: 1px solid #eee;
            font-size: 12px;
        }
        .reservations-table tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        .status-confirmed {
            background-color: #28a745;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-completed {
            background-color: #17a2b8;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        .status-cancelled {
            background-color: #dc3545;
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: bold;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            font-size: 10px;
            color: #888;
        }
        .no-reservations {
            text-align: center;
            padding: 40px;
            color: #666;
            font-style: italic;
        }
        .summary {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        .summary-title {
            font-size: 16px;
            font-weight: bold;
            color: #3D401E;
            margin-bottom: 10px;
        }
        .summary-item {
            display: inline-block;
            margin-right: 20px;
            font-size: 12px;
        }
        .summary-label {
            color: #666;
        }
        .summary-value {
            color: #3D401E;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="restaurant-name">{{ $restaurantName }}</div>
        <div class="restaurant-subtitle">Fine Dining Restaurant</div>
        <div class="restaurant-info">
            {{ $restaurantAddress }}<br>
            Phone: {{ $restaurantPhone }} | Email: {{ $restaurantEmail }}
        </div>
    </div>

    <div class="date-header">
        <div class="date-title">Reservations for {{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }}</div>
        <div class="date-subtitle">Generated on {{ \Carbon\Carbon::now()->format('F j, Y \a\t g:i A') }}</div>
    </div>

    @if($reservations->count() > 0)
        <div class="summary">
            <div class="summary-title">Summary</div>
            <div class="summary-item">
                <span class="summary-label">Total Reservations:</span>
                <span class="summary-value">{{ $reservations->count() }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Total Guests:</span>
                <span class="summary-value">{{ $reservations->sum('guest_count') }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Confirmed:</span>
                <span class="summary-value">{{ $reservations->where('status', 'confirmed')->count() }}</span>
            </div>
            <div class="summary-item">
                <span class="summary-label">Completed:</span>
                <span class="summary-value">{{ $reservations->where('status', 'completed')->count() }}</span>
            </div>
        </div>

        <table class="reservations-table">
            <thead>
                <tr>
                    <th>Time</th>
                    <th>Guest Name</th>
                    <th>Contact</th>
                    <th>Guests</th>
                    <th>Status</th>
                    <th>Special Requests</th>
                </tr>
            </thead>
            <tbody>
                @foreach($reservations as $reservation)
                    <tr>
                        <td>
                            @if($reservation->timeSlot)
                                {{ \Carbon\Carbon::parse($reservation->timeSlot->start_time)->format('g:i A') }} - 
                                {{ \Carbon\Carbon::parse($reservation->timeSlot->end_time)->format('g:i A') }}
                            @else
                                Special Hours
                            @endif
                        </td>
                        <td>
                            <strong>{{ $reservation->guest_first_name }} {{ $reservation->guest_last_name }}</strong>
                        </td>
                        <td>
                            {{ $reservation->guest_email }}<br>
                            {{ $reservation->guest_phone }}
                        </td>
                        <td>{{ $reservation->guest_count }}</td>
                        <td>
                            <span class="status-{{ $reservation->status }}">
                                {{ ucfirst($reservation->status) }}
                            </span>
                        </td>
                        <td>
                            @if($reservation->special_requests)
                                {{ Str::limit($reservation->special_requests, 50) }}
                            @else
                                <span style="color: #999;">None</span>
                            @endif
                        </td>
                    </tr>
                @endforeach
            </tbody>
        </table>
    @else
        <div class="no-reservations">
            <h3>No Reservations Found</h3>
            <p>There are no reservations scheduled for {{ \Carbon\Carbon::parse($date)->format('l, F j, Y') }}.</p>
        </div>
    @endif

    <div class="footer">
        <p>This report was generated automatically by the Lyma Restaurant Management System.</p>
        <p>For questions or support, please contact the restaurant management.</p>
    </div>
</body>
</html>
