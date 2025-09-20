import React from 'react';
import { Edit, Trash2 } from 'lucide-react';

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

interface JournalTableProps {
  entries: JournalEntry[];
  onEdit: (entry: JournalEntry) => void;
  onDelete: (entry: JournalEntry) => void;
}

const JournalTable: React.FC<JournalTableProps> = ({
  entries,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-card rounded-lg shadow border border-border">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Image</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Title</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Excerpt</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Published</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Status</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Featured</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Order</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider font-lexend">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {entries.map((entry) => (
              <tr key={entry.id} className="hover:bg-muted/50">
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <img 
                    src={entry.image.startsWith('/storage/') ? entry.image : `/storage/${entry.image}`} 
                    alt={entry.title}
                    className="w-16 h-16 object-cover rounded mx-auto"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="text-sm font-medium text-foreground font-lexend max-w-xs truncate">{entry.title}</div>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="text-sm text-muted-foreground font-lexend max-w-xs truncate">
                    {entry.excerpt || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground font-lexend">
                  {entry.published_at ? new Date(entry.published_at).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium font-lexend ${
                    entry.is_active 
                      ? 'bg-olive text-beige' 
                      : 'bg-destructive text-beige'
                  }`}>
                    {entry.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium font-lexend ${
                    entry.featured 
                      ? 'bg-olive text-beige' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {entry.featured ? 'Featured' : 'Regular'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-muted-foreground font-lexend">
                  {entry.sort_order}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                  <div className="flex gap-4 justify-center">
                    <button
                      onClick={() => onEdit(entry)}
                      className="text-primary hover:text-olive transition-colors p-1 rounded hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDelete(entry)}
                      className="text-destructive hover:text-destructive/80 transition-colors p-1 rounded hover:bg-destructive/10"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JournalTable;
