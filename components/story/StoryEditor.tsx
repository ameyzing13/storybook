'use client';

import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Mic, MicOff, ChevronLeft, Save } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TextEditor from './TextEditor';
import VoiceRecorder from './VoiceRecorder';

interface StoryEditorProps {
  storybookId: string;
  storyId: string;
  user: User;
}

export default function StoryEditor({ storybookId, storyId, user }: StoryEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadStory() {
      setIsLoading(true);
      try {
        const { data: story } = await supabase
          .from('stories')
          .select('*')
          .eq('id', storyId)
          .single();

        if (story) {
          setTitle(story.title);
          setContent(story.content || '');
          setLastSaved(new Date(story.updated_at));
        }
      } catch (error) {
        console.error('Error loading story:', error);
      }
      setIsLoading(false);
    }

    loadStory();
  }, [storyId]);

  async function handleSave() {
    setIsSaving(true);
    
    const { error } = await supabase
      .from('stories')
      .update({
        title,
        content,
      })
      .eq('id', storyId);

    setIsSaving(false);
    if (!error) {
      setLastSaved(new Date());
    }
  }

  // Autosave every 30 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastSaved === null || new Date().getTime() - lastSaved.getTime() > 30000) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [title, content, lastSaved]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4 flex items-center justify-between">
            <button
              onClick={() => router.push(`/protected/storybook/${storybookId}`)}
              className="flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Storybook
            </button>
            <div className="flex items-center gap-3">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Last saved {lastSaved.toLocaleTimeString()}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter story title..."
            className="w-full text-3xl font-semibold bg-transparent border-b border-gray-200 pb-2 mb-8 focus:outline-none focus:border-blue-500"
          />

          <TextEditor
            content={content}
            onChange={setContent}
            className="prose max-w-none"
          />
        </div>
      </main>

      {/* Voice Recording FAB */}
      <button
        onClick={() => setIsRecording(!isRecording)}
        className={`fixed bottom-8 right-8 p-4 rounded-full shadow-lg transition-all ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isRecording ? (
          <MicOff className="h-6 w-6 text-white" />
        ) : (
          <Mic className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Voice Recording Modal */}
      {isRecording && (
        <VoiceRecorder
          onClose={() => setIsRecording(false)}
          onTranscription={(text) => {
            setContent((prev) => prev + ' ' + text);
            setIsRecording(false);
          }}
        />
      )}
    </>
  );
} 