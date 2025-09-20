import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmationModal from '@/components/admin/AdminConfirmationModal';
import JournalPreview from '@/components/admin/JournalPreview';
import JournalTable from '@/components/admin/JournalTable';
import { useNotification } from '@/contexts/NotificationContext';

interface JournalEntry {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image: string;
  gallery_images?: string[];
  meta_title?: string;
  meta_description?: string;
  sort_order: number;
  is_active: boolean;
  featured: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
}

const Journal: React.FC = () => {
  const { showNotification } = useNotification();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<JournalEntry | null>(null);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      const response = await fetch('/admin/api/journal-entries');
      if (response.ok) {
      const data = await response.json();
      setEntries(data);
      } else {
        showNotification('Failed to fetch journal entries', 'error');
      }
    } catch (error) {
      console.error('Error fetching journal entries:', error);
      showNotification('Network error: Unable to fetch entries', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (entry: JournalEntry) => {
    window.location.href = `/admin/journal/edit/${entry.id}`;
  };

  const handleDelete = (entry: JournalEntry) => {
    setEntryToDelete(entry);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!entryToDelete) return;

    try {
      const response = await fetch(`/admin/api/journal-entries/${entryToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
        }
      });

      if (response.ok) {
        showNotification('Journal entry deleted successfully!', 'success');
        await fetchEntries();
        setPreviewIndex(0);
      } else {
        showNotification('Failed to delete journal entry', 'error');
      }
    } catch (error) {
      console.error('Error deleting journal entry:', error);
      showNotification('Network error: Unable to delete entry', 'error');
    } finally {
      setShowDeleteModal(false);
      setEntryToDelete(null);
    }
  };

  const nextPreview = () => {
    if (entries.length > 0) {
    setPreviewIndex((prev) => (prev + 1) % entries.length);
    }
  };

  const prevPreview = () => {
    if (entries.length > 0) {
    setPreviewIndex((prev) => (prev - 1 + entries.length) % entries.length);
    }
  };

  const goToPreview = (index: number) => {
    setPreviewIndex(index);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-12 py-6 sm:py-8 md:py-10 lg:py-10 xl:py-10 2xl:py-10 space-y-6 sm:space-y-6 md:space-y-8 lg:space-y-8 xl:space-y-8 2xl:space-y-8 font-lexend">
        {/* Header */}
        <div className="text-center">
          <div className="mb-4 sm:mb-4 md:mb-4 lg:mb-4 xl:mb-4 2xl:mb-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-6xl font-thin font-lexend text-olive">
              JOURNAL
            </h1>
          </div>
          <div className="w-20 sm:w-24 md:w-28 lg:w-32 xl:w-32 2xl:w-32 h-[1px] bg-olive mx-auto" style={{ opacity: 0.5 }} />
        </div>

        {/* Journal Preview */}
        <JournalPreview
          entries={entries}
          previewIndex={previewIndex}
          onNextPreview={nextPreview}
          onPrevPreview={prevPreview}
          onGoToPreview={goToPreview}
          onAddNew={() => window.location.href = '/admin/journal/new'}
        />

        {/* Entries List */}
        <JournalTable
          entries={entries}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setEntryToDelete(null);
          }}
          onConfirm={confirmDelete}
          title="Delete Journal Entry"
          message={`Are you sure you want to delete "${entryToDelete?.title}"? This action cannot be undone.`}
          type="cancel"
        />
      </div>
    </AdminLayout>
  );
};

export default Journal;