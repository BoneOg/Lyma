<?php

namespace App\Http\Controllers;

use App\Models\Analytics;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get chart data for dashboard
     */
    public function getChartData(Request $request): JsonResponse
    {
        $days = $request->get('days', 30);
        $data = Analytics::getChartData($days);
        
        return response()->json($data);
    }

    /**
     * Get real-time visitor count
     */
    public function getRealTimeVisitors(Request $request): JsonResponse
    {
        $minutes = $request->get('minutes', 5);
        $data = Analytics::getRealTimeVisitors($minutes);
        
        return response()->json($data);
    }

    /**
     * Get today's analytics summary
     */
    public function getTodaySummary(): JsonResponse
    {
        $data = Analytics::getTodaySummary();
        
        return response()->json($data);
    }

    /**
     * Get popular pages
     */
    public function getPopularPages(Request $request): JsonResponse
    {
        $days = $request->get('days', 7);
        $limit = $request->get('limit', 10);
        $data = Analytics::getPopularPages($days, $limit);
        
        return response()->json($data);
    }

    /**
     * Track page view with additional data from frontend
     */
    public function trackPageView(Request $request): JsonResponse
    {
        $request->validate([
            'page_url' => 'required|string',
            'page_title' => 'nullable|string',
            'time_on_page' => 'nullable|integer',
            'screen_width' => 'nullable|integer',
            'screen_height' => 'nullable|integer',
        ]);

        $sessionId = $request->session()->getId();
        $userAgent = $request->header('User-Agent', '');
        $deviceType = Analytics::detectDeviceType($userAgent);

        // Update existing analytics record or create new one
        $analytics = Analytics::where('session_id', $sessionId)
            ->where('page_url', $request->page_url)
            ->where('created_at', '>=', Carbon::now()->subMinutes(5))
            ->first();

        if ($analytics) {
            // Update existing record
            $analytics->update([
                'time_on_page' => $request->time_on_page,
                'is_bounce' => false, // User stayed on the page
            ]);
        } else {
            // Create new record
            Analytics::create([
                'session_id' => $sessionId,
                'page_url' => $request->page_url,
                'page_title' => $request->page_title,
                'device_type' => $deviceType,
                'user_agent' => $userAgent,
                'ip_address' => $request->ip(),
                'referrer' => $request->header('Referer'),
                'browser' => Analytics::extractBrowser($userAgent),
                'os' => Analytics::extractOS($userAgent),
                'screen_width' => $request->screen_width,
                'screen_height' => $request->screen_height,
                'time_on_page' => $request->time_on_page,
                'is_bounce' => false,
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Get analytics dashboard data
     */
    public function getDashboardData(): JsonResponse
    {
        $today = Carbon::today();
        $yesterday = Carbon::yesterday();
        
        // Today's data
        $todayData = Analytics::whereDate('created_at', $today)
            ->selectRaw('
                device_type,
                COUNT(*) as visits,
                COUNT(DISTINCT session_id) as unique_visitors
            ')
            ->groupBy('device_type')
            ->get();

        // Yesterday's data for comparison
        $yesterdayData = Analytics::whereDate('created_at', $yesterday)
            ->selectRaw('
                device_type,
                COUNT(*) as visits,
                COUNT(DISTINCT session_id) as unique_visitors
            ')
            ->groupBy('device_type')
            ->get();

        // Real-time visitors (last 5 minutes)
        $realTimeData = Analytics::getRealTimeVisitors(5);

        // Chart data for last 30 days
        $chartData = Analytics::getChartData(30);

        // Popular pages
        $popularPages = Analytics::getPopularPages(7, 5);

        return response()->json([
            'today' => $todayData,
            'yesterday' => $yesterdayData,
            'real_time' => $realTimeData,
            'chart_data' => $chartData,
            'popular_pages' => $popularPages,
        ]);
    }
}
