<?php

namespace App\Http\Controllers;

use App\Models\SystemSetting;
use App\Models\JournalEntry;
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

    public function chef()
    {
        return Inertia::render('chef', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function contact()
    {
        return Inertia::render('contact', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function gallery()
    {
        return Inertia::render('gallery', [
            'footerData' => $this->getFooterData(),
        ]);
    }

    public function journal()
    {
        // Show all active entries regardless of timezone edge-cases on published_at
        $journalEntries = JournalEntry::active()->ordered()->get();
        
        return Inertia::render('journal', [
            'footerData' => $this->getFooterData(),
            'journalEntries' => $journalEntries,
        ]);
    }

    public function journalEntry(JournalEntry $journalEntry)
    {
        // Only check if the entry is active - ignore published_at for now
        if (!$journalEntry->is_active) {
            return Inertia::render('404', [
                'footerData' => $this->getFooterData(),
            ]);
        }
        
        // Get related entries (excluding current one) - only active ones
        $relatedEntries = JournalEntry::active()
            ->where('id', '!=', $journalEntry->id)
            ->ordered()
            ->limit(3)
            ->get();

        return Inertia::render('journal-entry', [
            'footerData' => $this->getFooterData(),
            'journalEntry' => $journalEntry,
            'relatedEntries' => $relatedEntries,
        ]);
    }
} 