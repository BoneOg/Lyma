<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\JournalEntry;
use Illuminate\Support\Facades\Storage;

class FixJournalFilenames extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'journal:fix-filenames';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fix journal image filenames that contain spaces or special characters';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting journal filename fix...');
        
        $entries = JournalEntry::whereNotNull('image')->get();
        $fixedCount = 0;
        
        foreach ($entries as $entry) {
            $currentPath = $entry->image;
            $filename = basename($currentPath);
            
            // Check if filename contains spaces or special characters
            if (preg_match('/[^a-zA-Z0-9._-]/', $filename)) {
                $this->info("Fixing journal entry {$entry->id} filename: {$filename}");
                
                // Generate clean filename
                $pathInfo = pathinfo($filename);
                $cleanName = preg_replace('/[^a-zA-Z0-9_-]/', '_', $pathInfo['filename']);
                $newFilename = $cleanName . '_' . uniqid() . '.' . $pathInfo['extension'];
                $newPath = 'journal/' . $newFilename;
                
                // Check if old file exists
                if (Storage::disk('public')->exists($currentPath)) {
                    // Copy file to new location
                    $oldContent = Storage::disk('public')->get($currentPath);
                    Storage::disk('public')->put($newPath, $oldContent);
                    
                    // Update database record
                    $entry->update(['image' => $newPath]);
                    
                    // Delete old file
                    Storage::disk('public')->delete($currentPath);
                    
                    $this->info("  -> Renamed to: {$newFilename}");
                    $fixedCount++;
                } else {
                    $this->warn("  -> Old file not found, skipping...");
                }
            }
        }
        
        $this->info("Fixed {$fixedCount} journal image filenames.");
        return Command::SUCCESS;
    }
}