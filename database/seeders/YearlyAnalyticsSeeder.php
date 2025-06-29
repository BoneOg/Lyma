<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Analytics;
use Carbon\Carbon;

class YearlyAnalyticsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Generate sample analytics data for the last 365 days
        $startDate = Carbon::now()->subDays(365);
        
        for ($i = 0; $i < 365; $i++) {
            $date = $startDate->copy()->addDays($i);
            
            // Generate realistic visitor data with some seasonal variation
            $baseDesktop = 80;
            $baseMobile = 60;
            
            // Add some seasonal variation (more visitors on weekends and holidays)
            $dayOfWeek = $date->dayOfWeek;
            $isWeekend = $dayOfWeek == 0 || $dayOfWeek == 6;
            $seasonalMultiplier = $isWeekend ? 1.5 : 1.0;
            
            // Add some random variation
            $randomMultiplier = rand(80, 120) / 100;
            
            $desktopVisitors = (int) ($baseDesktop * $seasonalMultiplier * $randomMultiplier);
            $mobileVisitors = (int) ($baseMobile * $seasonalMultiplier * $randomMultiplier);
            $tabletVisitors = (int) ($desktopVisitors * 0.1); // 10% of desktop visitors
            
            // Create records for each day
            for ($j = 0; $j < $desktopVisitors; $j++) {
                Analytics::create([
                    'session_id' => 'session_' . $date->format('Y-m-d') . '_desktop_' . $j,
                    'page_url' => $this->getRandomPage(),
                    'page_title' => $this->getRandomPageTitle(),
                    'device_type' => 'desktop',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'ip_address' => '192.168.1.' . rand(1, 254),
                    'browser' => 'Chrome',
                    'os' => 'Windows',
                    'screen_width' => rand(1024, 1920),
                    'screen_height' => rand(768, 1080),
                    'is_bounce' => rand(0, 1),
                    'time_on_page' => rand(10, 300),
                    'created_at' => $date->copy()->addMinutes(rand(0, 1439)),
                ]);
            }
            
            for ($j = 0; $j < $mobileVisitors; $j++) {
                Analytics::create([
                    'session_id' => 'session_' . $date->format('Y-m-d') . '_mobile_' . $j,
                    'page_url' => $this->getRandomPage(),
                    'page_title' => $this->getRandomPageTitle(),
                    'device_type' => 'mobile',
                    'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                    'ip_address' => '192.168.1.' . rand(1, 254),
                    'browser' => 'Safari',
                    'os' => 'iOS',
                    'screen_width' => rand(320, 414),
                    'screen_height' => rand(568, 896),
                    'is_bounce' => rand(0, 1),
                    'time_on_page' => rand(5, 180),
                    'created_at' => $date->copy()->addMinutes(rand(0, 1439)),
                ]);
            }
            
            for ($j = 0; $j < $tabletVisitors; $j++) {
                Analytics::create([
                    'session_id' => 'session_' . $date->format('Y-m-d') . '_tablet_' . $j,
                    'page_url' => $this->getRandomPage(),
                    'page_title' => $this->getRandomPageTitle(),
                    'device_type' => 'tablet',
                    'user_agent' => 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                    'ip_address' => '192.168.1.' . rand(1, 254),
                    'browser' => 'Safari',
                    'os' => 'iOS',
                    'screen_width' => rand(768, 1024),
                    'screen_height' => rand(1024, 1366),
                    'is_bounce' => rand(0, 1),
                    'time_on_page' => rand(15, 240),
                    'created_at' => $date->copy()->addMinutes(rand(0, 1439)),
                ]);
            }
        }
    }
    
    private function getRandomPage(): string
    {
        $pages = [
            'http://localhost/',
            'http://localhost/menu',
            'http://localhost/about',
            'http://localhost/contact',
            'http://localhost/reservation',
        ];
        
        return $pages[array_rand($pages)];
    }
    
    private function getRandomPageTitle(): string
    {
        $titles = [
            'Home',
            'Menu',
            'About',
            'Contact',
            'Reservation',
        ];
        
        return $titles[array_rand($titles)];
    }
} 