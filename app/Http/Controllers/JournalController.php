<?php

namespace App\Http\Controllers;

use App\Models\JournalEntry;
use Illuminate\Http\Request;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class JournalController extends Controller
{
    public function index()
    {
        $entries = JournalEntry::active()->ordered()->get();
        return response()->json($entries);
    }

    public function store(Request $request)
    {
        try {
            $request->validate([
                'title' => 'required|string|max:255',
                'excerpt' => 'nullable|string|max:500',
                'content' => 'nullable|string',
                'image' => 'required|file|mimes:jpeg,png,jpg,webp|max:5120',
                'meta_title' => 'nullable|string|max:255',
                'meta_description' => 'nullable|string|max:500',
                'sort_order' => 'nullable|integer|min:1',
                'featured' => 'nullable|in:0,1,true,false',
                'is_active' => 'nullable|in:0,1,true,false',
                'published_at' => 'nullable|date'
            ]);

            // Debug: Log the request data
            \Log::info('Journal creation request:', [
                'title' => $request->title,
                'has_image' => $request->hasFile('image'),
                'sort_order' => $request->sort_order,
                'all_data' => $request->all()
            ]);

            // Check for duplicate sort order
            if ($request->sort_order && JournalEntry::where('sort_order', $request->sort_order)->exists()) {
                return response()->json(['error' => 'Sort order already exists'], 422);
            }

            $imageFile = $request->file('image');
            $imagePath = $imageFile->store('journal', 'public');
            
            // Resize and optimize the image
            $this->resizeImage($imagePath);
            
            // Debug: Log the image path
            \Log::info('Image uploaded to: ' . $imagePath);

            // Convert string boolean values to actual booleans
            $isActive = $request->is_active;
            if (is_string($isActive)) {
                $isActive = in_array($isActive, ['1', 'true', 'on', 'yes']);
            }
            
            $featured = $request->featured;
            if (is_string($featured)) {
                $featured = in_array($featured, ['1', 'true', 'on', 'yes']);
            }

            // Ensure unique slug
            $baseSlug = Str::slug($request->title);
            $slug = $baseSlug;
            $counter = 2;
            while (JournalEntry::where('slug', $slug)->exists()) {
                $slug = $baseSlug . '-' . $counter;
                $counter++;
            }

            $entry = JournalEntry::create([
                'title' => $request->title,
                'excerpt' => $request->excerpt,
                'content' => $request->content,
                'image' => $imagePath,
                'meta_title' => $request->meta_title,
                'meta_description' => $request->meta_description,
                'sort_order' => max(1, (int)($request->sort_order ?? 1)),
                'is_active' => $isActive ?? true,
                'featured' => $featured ?? false,
                'published_at' => $request->published_at ?? now(),
                'slug' => $slug,
            ]);

            \Log::info('Journal entry created successfully:', ['id' => $entry->id]);
            return response()->json($entry, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Validation error:', $e->errors());
            return response()->json(['error' => 'Validation failed', 'details' => $e->errors()], 422);
        } catch (\Exception $e) {
            \Log::error('Journal creation error:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            return response()->json(['error' => 'Server error: ' . $e->getMessage()], 500);
        }
    }

    public function show($id)
    {
        try {
            $journalEntry = JournalEntry::findOrFail($id);
            return response()->json($journalEntry);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Journal entry not found for show:', ['id' => $id]);
            return response()->json(['error' => 'Journal entry not found'], 404);
        }
    }

    public function update(Request $request, $id)
    {
        \Log::info('Update method called', [
            'id' => $id,
            'method' => $request->method(),
            'content_type' => $request->header('Content-Type'),
            'all_data' => $request->all()
        ]);

        try {
            $journalEntry = JournalEntry::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Journal entry not found for update:', ['id' => $id]);
            return response()->json(['error' => 'Journal entry not found'], 404);
        }

        \Log::info('Update request received', [
            'id' => $journalEntry->id,
            'title' => $journalEntry->title,
            'data' => $request->all()
        ]);

        $request->validate([
            'title' => 'required|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'image' => 'nullable|file|mimes:jpeg,png,jpg,webp|max:5120',
            'meta_title' => 'nullable|string|max:255',
            'meta_description' => 'nullable|string|max:500',
            'sort_order' => 'nullable|integer|min:1',
            'is_active' => 'nullable|in:0,1,true,false',
            'featured' => 'nullable|in:0,1,true,false',
            'published_at' => 'nullable|date'
        ]);

        // Check for duplicate sort order (excluding current entry)
        if ($request->sort_order && (int)$request->sort_order > 0 && JournalEntry::where('sort_order', (int)$request->sort_order)->where('id', '!=', $journalEntry->id)->exists()) {
            return response()->json(['error' => 'Sort order already exists'], 422);
        }

        $data = $request->only(['title', 'excerpt', 'content', 'meta_title', 'meta_description', 'sort_order', 'is_active', 'featured', 'published_at']);
        if (isset($data['sort_order'])) {
            $data['sort_order'] = max(1, (int)$data['sort_order']);
        }
        
        // Convert string boolean values to actual booleans
        if (isset($data['is_active']) && is_string($data['is_active'])) {
            $data['is_active'] = in_array($data['is_active'], ['1', 'true', 'on', 'yes']);
        }
        
        if (isset($data['featured']) && is_string($data['featured'])) {
            $data['featured'] = in_array($data['featured'], ['1', 'true', 'on', 'yes']);
        }

        if ($request->hasFile('image')) {
            // Delete old image
            if ($journalEntry->image) {
                Storage::disk('public')->delete($journalEntry->image);
            }
            
            $imageFile = $request->file('image');
            $imagePath = $imageFile->store('journal', 'public');
            
            // Resize and optimize the image
            $this->resizeImage($imagePath);
            
            $data['image'] = $imagePath;
        }

        $journalEntry->update($data);

        \Log::info('Journal entry updated successfully', [
            'id' => $journalEntry->id,
            'updated_data' => $data
        ]);

        return response()->json($journalEntry);
    }

    public function destroy($id)
    {
        try {
            $journalEntry = JournalEntry::findOrFail($id);
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            \Log::error('Journal entry not found for deletion:', ['id' => $id]);
            return response()->json(['error' => 'Journal entry not found'], 404);
        }

        // Delete image file
        if ($journalEntry->image) {
            Storage::disk('public')->delete($journalEntry->image);
        }

        $journalEntry->delete();

        return response()->json(['message' => 'Journal entry deleted successfully']);
    }

    /**
     * Return the next available sort order (max + 1, at least 1)
     */
    public function nextSortOrder()
    {
        $max = JournalEntry::max('sort_order');
        $next = max(1, (int)$max + 1);
        return response()->json(['next' => $next]);
    }

    public function uploadImage(Request $request)
    {
        try {
            $request->validate([
                'file' => 'required|file|mimes:jpeg,png,jpg,webp|max:5120',
            ]);

            $file = $request->file('file');
            $filename = time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $path = $file->store('journal/content', 'public');
            
            // Resize and optimize the image
            $this->resizeImage($path);
            
            $url = Storage::disk('public')->url($path);

            \Log::info('Content image uploaded:', ['path' => $path, 'url' => $url]);

            return response()->json([
                'success' => true,
                'url' => $url,
                'filename' => $filename
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            \Log::error('Image upload validation error:', $e->errors());
            return response()->json(['success' => false, 'error' => 'Validation failed'], 422);
        } catch (\Exception $e) {
            \Log::error('Image upload error:', ['message' => $e->getMessage()]);
            return response()->json(['success' => false, 'error' => 'Upload failed'], 500);
        }
    }

    private function resizeImage($imagePath)
    {
        try {
            $manager = new ImageManager(new Driver());
            $image = $manager->read(Storage::disk('public')->path($imagePath));

            // Resize to a max width of 1920 while maintaining aspect ratio
            $image->scaleDown(width: 1920);

            // Save optimized image (overwrite)
            $image->save(Storage::disk('public')->path($imagePath), quality: 80);
        } catch (\Exception $e) {
            \Log::error('Image resize error:', ['message' => $e->getMessage(), 'path' => $imagePath]);
        }
    }
}
