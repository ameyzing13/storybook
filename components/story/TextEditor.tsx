'use client';

interface TextEditorProps {
  content: string;
  onChange: (content: string) => void;
  className?: string;
}

export default function TextEditor({ content, onChange, className }: TextEditorProps) {
  return (
    <div className={className}>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Start writing your story..."
        className="w-full min-h-[500px] bg-transparent focus:outline-none resize-none"
      />
    </div>
  );
} 