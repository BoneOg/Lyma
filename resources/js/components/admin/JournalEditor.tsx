import React, { useRef, useEffect } from 'react';
import { useNotification } from '@/contexts/NotificationContext';
import { Editor } from '@tinymce/tinymce-react';

interface JournalEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageUpload?: (blobInfo: any, progress: any) => Promise<string>;
  placeholder?: string;
  height?: number;
  toolbarContainerId?: string; // Optional external toolbar container (sticky header)
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  content,
  onChange,
  onImageUpload,
  placeholder = "Start writing your journal post...",
  height = 600,
  toolbarContainerId,
}) => {
  const editorRef = useRef<any>(null);
  const { showNotification } = useNotification ? useNotification() : { showNotification: (_: string, __?: 'success' | 'error' | 'info') => {} };

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const handleImageUpload = async (blobInfo: any, progress: any): Promise<string> => {
    if (onImageUpload) {
      return onImageUpload(blobInfo, progress);
    }

    // Default image upload handler with 5MB limit and client-side WebP conversion
    const originalBlob: Blob = blobInfo.blob();

    // Enforce max size (5MB) on the incoming image
    const maxSizeBytes = 5 * 1024 * 1024;
    if (originalBlob.size > maxSizeBytes) {
      showNotification('Image exceeds the 5MB limit. Please choose a smaller file.', 'error');
      return Promise.reject('Image exceeds the 5MB limit. Please choose a smaller file.');
    }

    const convertToWebP = (inputBlob: Blob, inputFilename: string): Promise<{ blob: Blob; filename: string }> => {
      return new Promise((resolve, reject) => {
        // If already webp, keep as-is
        const lowerName = inputFilename.toLowerCase();
        if (inputBlob.type === 'image/webp' || lowerName.endsWith('.webp')) {
          resolve({ blob: inputBlob, filename: lowerName.endsWith('.webp') ? inputFilename : inputFilename.replace(/\.[^.]+$/, '') + '.webp' });
          return;
        }

        const img = new Image();
        const objectUrl = URL.createObjectURL(inputBlob);
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('Canvas not supported'));
            return;
          }
          ctx.drawImage(img, 0, 0);

          let quality = 0.85;
          const exportBlob = (q: number) => new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/webp', q));

          (async () => {
            let webpBlob = await exportBlob(quality);
            if (!webpBlob) {
              URL.revokeObjectURL(objectUrl);
              reject(new Error('Failed to export WebP'));
              return;
            }
            // If still over 5MB, try reducing quality down to 0.5
            while (webpBlob.size > maxSizeBytes && quality > 0.5) {
              quality -= 0.05;
              const next = await exportBlob(quality);
              if (next) webpBlob = next; else break;
            }
            URL.revokeObjectURL(objectUrl);
            resolve({ blob: webpBlob, filename: inputFilename.replace(/\.[^.]+$/, '') + '.webp' });
          })().catch(err => {
            URL.revokeObjectURL(objectUrl);
            reject(err);
          });
        };
        img.onerror = () => {
          URL.revokeObjectURL(objectUrl);
          reject(new Error('Failed to load image'));
        };
        img.src = objectUrl;
      });
    };

    try {
      const { blob: uploadBlob, filename } = await convertToWebP(originalBlob, blobInfo.filename());

      if (uploadBlob.size > maxSizeBytes) {
        showNotification('Image exceeds the 5MB limit after conversion. Please choose a smaller file.', 'error');
        return Promise.reject('Image exceeds the 5MB limit after conversion. Please choose a smaller file.');
      }

      const formData = new FormData();
      formData.append('file', uploadBlob, filename);
      formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');

      const response = await fetch('/admin/api/journal-entries/upload-image', {
        method: 'POST',
        body: formData,
      });
      const result = await response.json();
      if (result.success) {
        // Normalize to relative storage path to avoid APP_URL domain mismatch in local dev
        let finalUrl: string = result.url as string;
        try {
          if (typeof finalUrl === 'string' && /^https?:\/\//i.test(finalUrl)) {
            const u = new URL(finalUrl);
            finalUrl = u.pathname + (u.search || '');
          }
        } catch (_) {
          // keep as-is if URL parsing fails
        }
        showNotification('Image uploaded.', 'success');
        return finalUrl;
      }
      const message = result.error || 'Upload failed';
      showNotification(message, 'error');
      return Promise.reject(message);
    } catch (err: any) {
      const message = err?.message || 'Upload failed';
      showNotification(message, 'error');
      return Promise.reject(message);
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <Editor
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: false,
          // Render toolbar into an external sticky container if provided
          ...(toolbarContainerId ? { fixed_toolbar_container: `#${toolbarContainerId}` } : {}),
          toolbar_sticky: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount', 'quickbars'
          ],
          toolbar: [
            'undo redo | bold italic | alignleft aligncenter alignright alignjustify | forecolor | image | removeformat | help',
            'blocks | styles | fontsize | fontfamily ',
            'bullist numlist outdent indent'
          ],
          content_style: `
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Thin.ttf') format('truetype');
              font-weight: 100;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-ExtraLight.ttf') format('truetype');
              font-weight: 200;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Light.ttf') format('truetype');
              font-weight: 300;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Regular.ttf') format('truetype');
              font-weight: 400;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Medium.ttf') format('truetype');
              font-weight: 500;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-SemiBold.ttf') format('truetype');
              font-weight: 600;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Bold.ttf') format('truetype');
              font-weight: 700;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-ExtraBold.ttf') format('truetype');
              font-weight: 800;
              font-display: swap;
            }
            @font-face {
              font-family: 'LexendGiga';
              src: url('/assets/font/LexendGiga-Black.ttf') format('truetype');
              font-weight: 900;
              font-display: swap;
            }
            body { 
              font-family: "LexendGiga", sans-serif; 
              font-size: 14px; 
              line-height: 1.6;
              overflow: visible !important;
              background-color: #3D401E !important;
            }
            .mce-content-body {
              overflow: visible !important;
            }
            .mce-edit-area {
              overflow: visible !important;
            }
            /* Ensure images fit within the editor content area */
            .mce-content-body img, .mce-content-body figure.image img {
              max-width: 100% !important;
              height: auto !important;
              display: block;
            }
            .mce-content-body figure.image {
              margin: 1rem 0;
            }
          `,
          placeholder: placeholder,
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          image_advtab: true,
          image_uploadtab: true,
          paste_data_images: true,
          paste_enable_default_filters: false,
          paste_retain_style_properties: 'color font-size font-family background-color',
          convert_urls: false,
          relative_urls: false,
          remove_script_host: false,
          document_base_url: window.location.origin,
          image_caption: true,
          image_title: true,
          image_description: true,
          quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
          quickbars_insert_toolbar: 'quickimage quicktable',
          branding: false,
          statusbar: false,
          resize: false,
          elementpath: false,
          contextmenu: false,
          scrollbar: 'none',
          auto_focus: 'false',
          font_family_formats: 'LexendGiga=LexendGiga,sans-serif',
          fontsize_formats: '8pt 10pt 12pt 14pt 16pt 18pt 20pt 24pt 28pt 32pt 36pt 48pt 60pt 72pt',
          formats: {
            lexendthin: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '100' } 
            },
            lexendextralight: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '200' } 
            },
            lexendlight: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '300' } 
            },
            lexendregular: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '400' } 
            },
            lexendmedium: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '500' } 
            },
            lexendsemibold: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '600' } 
            },
            lexendbold: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '700' } 
            },
            lexendextrabold: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '800' } 
            },
            lexendblack: { 
              inline: 'span', 
              styles: { 'font-family': 'LexendGiga', 'font-weight': '900' } 
            }
          },
          style_formats: [
            { title: 'Lexend Thin (100)', format: 'lexendthin' },
            { title: 'Lexend Extra Light (200)', format: 'lexendextralight' },
            { title: 'Lexend Light (300)', format: 'lexendlight' },
            { title: 'Lexend Regular (400)', format: 'lexendregular' },
            { title: 'Lexend Medium (500)', format: 'lexendmedium' },
            { title: 'Lexend Semi Bold (600)', format: 'lexendsemibold' },
            { title: 'Lexend Bold (700)', format: 'lexendbold' },
            { title: 'Lexend Extra Bold (800)', format: 'lexendextrabold' },
            { title: 'Lexend Black (900)', format: 'lexendblack' }
          ],
          setup: (editor) => {
            editor.on('init', () => {
              editor.getContainer().style.border = 'none';
            });
          }
        }}
      />
    </div>
  );
};

export default JournalEditor;
