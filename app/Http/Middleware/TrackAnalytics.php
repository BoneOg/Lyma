<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use App\Models\Analytics;
use Symfony\Component\HttpFoundation\Response;

class TrackAnalytics
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track analytics for web requests (not API calls)
        if ($request->is('api/*') || $request->is('admin/*') || $request->is('staff/*')) {
            return $response;
        }

        // Skip tracking for admin/staff pages
        if (auth()->check() && (auth()->user()->isAdmin() || auth()->user()->isStaff())) {
            return $response;
        }

        try {
            $this->trackPageView($request);
        } catch (\Exception $e) {
            // Log error but don't break the application
            \Log::error('Analytics tracking failed: ' . $e->getMessage());
        }

        return $response;
    }

    /**
     * Track page view analytics
     */
    private function trackPageView(Request $request): void
    {
        $userAgent = $request->header('User-Agent', '');
        $deviceType = Analytics::detectDeviceType($userAgent);
        $browser = Analytics::extractBrowser($userAgent);
        $os = Analytics::extractOS($userAgent);
        $ipAddress = $request->ip();
        $screenWidth = $request->header('X-Screen-Width');
        $screenHeight = $request->header('X-Screen-Height');
        $pageUrl = $request->fullUrl();
        $pageTitle = $this->getPageTitle($request);
        $now = now();
        $windowStart = $now->copy()->subMinutes($now->minute % 30)->setSecond(0)->setMicrosecond(0);
        $sessionId = session()->getId();
        // Only create a new record if not already tracked in this 30-min window for this session (site-wide unique)
        $exists = Analytics::where('session_id', $sessionId)
            ->where('window_start', $windowStart)
            ->exists();
        if (!$exists) {
            Analytics::create([
                'session_id' => $sessionId,
                'window_start' => $windowStart,
                'page_url' => $pageUrl, // This will be the first page visited in the session/window
                'page_title' => $pageTitle,
                'device_type' => $deviceType,
                'user_agent' => $userAgent,
                'ip_address' => $ipAddress,
                'referrer' => $request->header('Referer'),
                'browser' => $browser,
                'os' => $os,
                'screen_width' => $screenWidth ? (int) $screenWidth : null,
                'screen_height' => $screenHeight ? (int) $screenHeight : null,
                'is_bounce' => true,
                'time_on_page' => null,
            ]);
        }
    }

    /**
     * Get page title based on route
     */
    private function getPageTitle(Request $request): string
    {
        $path = $request->path();
        
        $titles = [
            '' => 'Home',
            'menu' => 'Menu',
            'about' => 'About',
            'contact' => 'Contact',
            'reservation' => 'Reservation',
            'checkout' => 'Checkout',
        ];

        return $titles[$path] ?? ucfirst($path);
    }
}
