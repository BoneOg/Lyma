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
        // Hide inactive or not-yet-published entries from the public
        if (!$journalEntry->is_active || ($journalEntry->published_at && $journalEntry->published_at->isFuture())) {
            abort(404);
        }
        // Get related entries (excluding current one)
        $relatedEntries = JournalEntry::published()
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