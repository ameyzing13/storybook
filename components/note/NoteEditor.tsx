'use client';

import { useCallback, useEffect, useRef } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Save } from 'lucide-react';

interface NoteEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  onEditorReady: (editor: Editor) => void;
  onSave: () => void;
}

export default function NoteEditor({ 
  content, 
  onChange, 
  className = '',
  onEditorReady,
  onSave
}: NoteEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: `prose focus:outline-none max-w-none ${className}`,
      },
    },
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Add keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        onSave();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSave]);

  return (
    <div className="relative min-h-[300px]" ref={editorRef}>
      {editor && (
        <EditorContent 
          editor={editor} 
          className={className}
        />
      )}
    </div>
  );
} 