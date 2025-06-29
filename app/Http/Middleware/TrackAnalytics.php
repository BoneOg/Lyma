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

        // Get or create session ID
        $sessionId = $request->session()->getId();

        // Get screen dimensions from request headers (if available)
        $screenWidth = $request->header('X-Screen-Width');
        $screenHeight = $request->header('X-Screen-Height');

        Analytics::create([
            'session_id' => $sessionId,
            'page_url' => $request->fullUrl(),
            'page_title' => $this->getPageTitle($request),
            'device_type' => $deviceType,
            'user_agent' => $userAgent,
            'ip_address' => $request->ip(),
            'referrer' => $request->header('Referer'),
            'browser' => $browser,
            'os' => $os,
            'screen_width' => $screenWidth ? (int) $screenWidth : null,
            'screen_height' => $screenHeight ? (int) $screenHeight : null,
            'is_bounce' => true, // Will be updated if user visits another page
            'time_on_page' => null, // Will be updated via JavaScript
        ]);
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
