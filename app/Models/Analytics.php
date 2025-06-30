<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Analytics extends Model
{
    use HasFactory;

    protected $fillable = [
        'session_id',
        'page_url',
        'page_title',
        'device_type',
        'user_agent',
        'ip_address',
        'referrer',
        'country',
        'city',
        'browser',
        'os',
        'screen_width',
        'screen_height',
        'is_bounce',
        'time_on_page',
    ];

    protected $casts = [
        'is_bounce' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get analytics data for charts
     */
    public static function getChartData($days = 30)
    {
        $startDate = Carbon::now()->subDays($days);
        
        // For longer periods, group by week or month to avoid too many data points
        $groupBy = 'DATE(created_at)';
        $dateFormat = 'Y-m-d';
        
        // Only group by week for very long periods (more than 1 year)
        if ($days > 365) {
            // For periods longer than 1 year, group by week
            $groupBy = 'YEARWEEK(created_at, 1)';
            $dateFormat = 'Y-W';
        }
        
        return self::selectRaw("
            {$groupBy} as date,
            SUM(CASE WHEN device_type = 'desktop' THEN 1 ELSE 0 END) as desktop,
            SUM(CASE WHEN device_type = 'mobile' THEN 1 ELSE 0 END) as mobile,
            SUM(CASE WHEN device_type = 'tablet' THEN 1 ELSE 0 END) as tablet
        ")
        ->where('created_at', '>=', $startDate)
        ->groupBy('date')
        ->orderBy('date')
        ->get()
        ->map(function ($item) use ($dateFormat) {
            // Convert week format back to readable date
            $date = $item->date;
            if (strpos($date, '-W') !== false) {
                // Convert YYYY-WW format to a readable date
                list($year, $week) = explode('-W', $date);
                $date = Carbon::now()->setISODate($year, $week)->format('Y-m-d');
            }
            
            return [
                'date' => $date,
                'desktop' => (int) $item->desktop,
                'mobile' => (int) $item->mobile,
                'tablet' => (int) $item->tablet,
            ];
        });
    }

    /**
     * Get real-time visitor count
     */
    public static function getRealTimeVisitors($minutes = 5)
    {
        $startTime = Carbon::now()->subMinutes($minutes);
        return self::where('created_at', '>=', $startTime)
            ->selectRaw('
                device_type,
                COUNT(DISTINCT CONCAT(ip_address, "_", user_agent)) as unique_visitors
            ')
            ->groupBy('device_type')
            ->get()
            ->pluck('unique_visitors', 'device_type')
            ->toArray();
    }

    /**
     * Get today's analytics summary
     */
    public static function getTodaySummary()
    {
        $today = Carbon::today();
        return self::whereDate('created_at', $today)
            ->selectRaw('
                device_type,
                COUNT(*) as total_visits,
                COUNT(DISTINCT CONCAT(ip_address, "_", user_agent)) as unique_visitors,
                AVG(time_on_page) as avg_time_on_page
            ')
            ->groupBy('device_type')
            ->get();
    }

    /**
     * Get popular pages
     */
    public static function getPopularPages($days = 7, $limit = 10)
    {
        $startDate = Carbon::now()->subDays($days);
        return self::where('created_at', '>=', $startDate)
            ->selectRaw('
                page_url,
                page_title,
                COUNT(*) as visits,
                COUNT(DISTINCT CONCAT(ip_address, "_", user_agent)) as unique_visitors
            ')
            ->groupBy('page_url', 'page_title')
            ->orderBy('visits', 'desc')
            ->limit($limit)
            ->get();
    }

    /**
     * Detect device type from user agent
     */
    public static function detectDeviceType($userAgent)
    {
        $userAgent = strtolower($userAgent);
        
        // Check for mobile devices
        if (preg_match('/(android|iphone|ipad|ipod|blackberry|windows phone)/', $userAgent)) {
            if (preg_match('/(ipad|tablet)/', $userAgent)) {
                return 'tablet';
            }
            return 'mobile';
        }
        
        return 'desktop';
    }

    /**
     * Extract browser information
     */
    public static function extractBrowser($userAgent)
    {
        $userAgent = strtolower($userAgent);
        
        if (strpos($userAgent, 'chrome') !== false) return 'Chrome';
        if (strpos($userAgent, 'firefox') !== false) return 'Firefox';
        if (strpos($userAgent, 'safari') !== false) return 'Safari';
        if (strpos($userAgent, 'edge') !== false) return 'Edge';
        if (strpos($userAgent, 'opera') !== false) return 'Opera';
        
        return 'Unknown';
    }

    /**
     * Extract OS information
     */
    public static function extractOS($userAgent)
    {
        $userAgent = strtolower($userAgent);
        
        if (strpos($userAgent, 'windows') !== false) return 'Windows';
        if (strpos($userAgent, 'mac') !== false) return 'macOS';
        if (strpos($userAgent, 'linux') !== false) return 'Linux';
        if (strpos($userAgent, 'android') !== false) return 'Android';
        if (strpos($userAgent, 'ios') !== false) return 'iOS';
        
        return 'Unknown';
    }
}
