import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface RichTextEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  height = 400,
  placeholder = "Start writing your journal entry..."
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  const handleImageUpload = (blobInfo: any, progress: any): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('file', blobInfo.blob(), blobInfo.filename());
      formData.append('_token', document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '');

      fetch('/admin/api/journal-entries/upload-image', {
        method: 'POST',
        body: formData,
      })
      .then(response => response.json())
      .then(result => {
        if (result.success) {
          resolve(result.url);
        } else {
          reject(result.error || 'Upload failed');
        }
      })
      .catch(error => {
        reject(error);
      });
    });
  };

  return (
    <div className="border border-input rounded-md overflow-hidden">
      <Editor
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@6/tinymce.min.js"
        onInit={(evt, editor) => editorRef.current = editor}
        value={value}
        onEditorChange={handleEditorChange}
        init={{
          height: height,
          menubar: false,
          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'help', 'wordcount'
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
            }
          `,
          placeholder: placeholder,
          images_upload_handler: handleImageUpload,
          automatic_uploads: true,
          file_picker_types: 'image',
          image_advtab: true,
          image_uploadtab: true,
          branding: false,
          statusbar: false,
          resize: false,
          elementpath: false,
          contextmenu: false,
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

export default RichTextEditor;
