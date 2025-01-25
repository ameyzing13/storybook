'use client';

import { useCallback, useEffect, useRef } from 'react';
import { EditorContent, useEditor, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import { Mic, Square, Loader2 } from 'lucide-react';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
  isRecording?: boolean;
  onToggleRecording: () => void;
  voiceRecorderComponent?: React.ReactNode;
  onEditorReady: (editor: Editor) => void;
}

export default function TextEditor({ 
  content, 
  onChange, 
  className = '',
  isRecording,
  onToggleRecording,
  voiceRecorderComponent,
  onEditorReady
}: TextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing your story...',
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
    editable: !isRecording,
    // Fix SSR hydration issues
    enableInputRules: false,
    enablePasteRules: false,
  });

  // Notify parent when editor is ready
  useEffect(() => {
    if (editor) {
      onEditorReady(editor);
    }
  }, [editor, onEditorReady]);

  // Update editor state when isRecording changes
  useEffect(() => {
    if (editor) {
      editor.setEditable(!isRecording);
    }
  }, [editor, isRecording]);

  return (
    <div className="relative min-h-[300px]" ref={editorRef}>
      {editor && (
        <EditorContent 
          editor={editor} 
          className={className}
        />
      )}
      
      {/* Permanent Voice Recorder Button */}
      <div className="sticky bottom-6 flex justify-center">
        {isRecording ? (
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-red-50 text-red-700 border border-red-200 rounded-full shadow-lg cursor-pointer hover:bg-red-100 transition-all animate-pulse"
               onClick={onToggleRecording}>
            {voiceRecorderComponent}
          </div>
        ) : (
          <button
            onClick={onToggleRecording}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 border border-blue-200 rounded-full shadow-lg hover:bg-blue-100 transition-all"
          >
            <Mic className="h-5 w-5" />
            <span className="font-medium">Start Recording</span>
          </button>
        )}
      </div>
    </div>
  );
} 