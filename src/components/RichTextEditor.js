'use client';
import { useEffect, useRef } from 'react';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const textareaRef = useRef(null);
  const editorRef = useRef(null);

  useEffect(() => {
    let checkInterval = null;

    const initEditor = () => {
      if (typeof window === 'undefined' || !window.tinymce) return false;

      window.tinymce.init({
        target: textareaRef.current,
        menubar: false,
        plugins: 'link lists code table help wordcount',
        toolbar: 'undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | bullist numlist | table | removeformat | code',
        skin: 'oxide-dark',
        content_css: 'dark',
        height: 350,
        setup: (editor) => {
          editorRef.current = editor;
          
          editor.on('init', () => {
            editor.setContent(value || '');
          });

          editor.on('change keyup undo redo', () => {
            const content = editor.getContent();
            onChange(content);
          });
        },
        placeholder: placeholder || 'Tulis sesuatu...',
      });

      return true;
    };

    const success = initEditor();
    if (!success) {
      checkInterval = setInterval(() => {
        if (typeof window !== 'undefined' && window.tinymce) {
          const ok = initEditor();
          if (ok) {
            clearInterval(checkInterval);
          }
        }
      }, 100);
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getContent()) {
      editorRef.current.setContent(value || '');
    }
  }, [value]);

  return (
    <div style={{ marginTop: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
      <textarea 
        ref={textareaRef} 
        defaultValue={value || ''} 
        style={{ 
          width: '100%', 
          minHeight: '150px', 
          padding: '0.75rem', 
          backgroundColor: 'rgba(20, 20, 23, 0.5)', 
          color: '#f0f0f2', 
          border: 'none', 
          resize: 'vertical',
          fontFamily: 'var(--font-sans)',
          fontSize: '0.9rem',
          outline: 'none'
        }}
        placeholder={placeholder}
      />
    </div>
  );
}
