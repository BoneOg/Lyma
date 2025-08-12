<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use Inertia\Inertia;

class PageController extends Controller
{
    protected function getFooterData()
    {
        return [
            'restaurant_address' => SystemSetting::getRestaurantAddress(),
            'restaurant_email' => SystemSetting::getRestaurantEmail(),
            'restaurant_phone' => SystemSetting::getRestaurantPhone(),
            'restaurant_name' => SystemSetting::getRestaurantName(),
        ];
    }

    public function home()
    {
        return Inertia::render('home', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function menu()
    {
        return Inertia::render('menu', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function about()
    {
        return Inertia::render('about', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function contact()
    {
        return Inertia::render('contact', [
            'footerData' => $this->getFooterData(),
        ]);
    }
} 