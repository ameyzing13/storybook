'use client';

import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft, Save, BookOpen, MessageCircle, RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';
import TextEditor from './TextEditor';
import VoiceRecorder from './VoiceRecorder';
import { Editor } from '@tiptap/react';

interface StoryEditorProps {
  storybookId: string;
  storyId: string;
  user: User;
}

interface LifeCoachQuestion {
  id: string;
  question: string;
  category: 'reflection' | 'growth' | 'action' | 'emotion';
}

interface DynamicQuestion extends LifeCoachQuestion {
  isLoading?: boolean;
  isSelected?: boolean;
}

const SAMPLE_QUESTIONS: LifeCoachQuestion[] = [
  { id: '1', question: "What emotions were you feeling during this experience?", category: 'emotion' },
  { id: '2', question: "How did this experience change your perspective?", category: 'reflection' },
  { id: '3', question: "What actions could you take based on these insights?", category: 'action' },
  { id: '4', question: "How might this experience contribute to your personal growth?", category: 'growth' },
];

const getCategoryColor = (category: LifeCoachQuestion['category']) => {
  switch (category) {
    case 'reflection': return 'bg-blue-100 text-blue-800';
    case 'growth': return 'bg-green-100 text-green-800';
    case 'action': return 'bg-purple-100 text-purple-800';
    case 'emotion': return 'bg-rose-100 text-rose-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default function StoryEditor({ storybookId, storyId, user }: StoryEditorProps) {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [wordCount, setWordCount] = useState(0);
  const supabase = createClient();
  const [questions, setQuestions] = useState<DynamicQuestion[]>(SAMPLE_QUESTIONS);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

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

  // Update word count when content changes
  useEffect(() => {
    const words = content.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
  }, [content]);

  const generateQuestions = async () => {
    if (!content.trim() || isAnalyzing) return;

    setIsAnalyzing(true);
    // Show loading state for existing questions
    setQuestions(questions.map(q => ({ ...q, isLoading: true })));

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze content');
      }

      const data = await response.json();
      if (data.questions) {
        setQuestions(data.questions.map((q: DynamicQuestion, index: number) => ({
          ...q,
          id: `dynamic-${index}`,
          isLoading: false,
        })));
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      // Restore original questions on error
      setQuestions(SAMPLE_QUESTIONS);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addQuestionToContent = (question: string) => {
    const questionText = `\n\nReflection Question: ${question}\nMy Answer:\n`;
    setContent((prev) => prev + questionText);
    // Scroll the editor to the bottom
    const editorElement = document.querySelector('.ProseMirror');
    if (editorElement) {
      editorElement.scrollTop = editorElement.scrollHeight;
    }
  };

  const handleQuestionClick = (questionId: string, question: string) => {
    if (editor) {
      // Insert at current cursor position or at the end
      const questionText = `\n\nReflection Question: ${question}\nMy Answer:\n`;
      editor.commands.insertContent(questionText);
      editor.commands.focus();
      
      // Scroll to the inserted text
      const element = document.querySelector('.ProseMirror');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } else {
      // Fallback if editor is not ready
      setContent((prev) => `${prev}\n\nReflection Question: ${question}\nMy Answer:\n`);
    }

    // Mark the question as selected
    setQuestions(questions.map(q => ({
      ...q,
      isSelected: q.id === questionId ? true : q.isSelected
    })));
  };

  const handleTranscription = async (text: string) => {
    // First insert the transcribed text
    if (editor) {
      const { from } = editor.state.selection;
      editor.commands.insertContent(`\n${text}\n`);
      editor.commands.focus();
      
      // Scroll to the inserted text
      const element = document.querySelector('.ProseMirror');
      if (element) {
        element.scrollTop = element.scrollHeight;
      }
    } else {
      setContent((prev) => `${prev}\n${text}\n`);
    }
    
    setIsRecording(false);

    // Save the story
    await handleSave();

    // Generate new questions based on updated content
    await generateQuestions();
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row h-full">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <button
                onClick={async () => {
                  await handleSave();
                  router.push(`/protected/storybook/${storybookId}`);
                }}
                className="flex items-center text-sm text-gray-500 hover:text-gray-700"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back to Storybook
              </button>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {wordCount} {wordCount === 1 ? 'word' : 'words'}
                </span>
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
              isRecording={isRecording}
              onToggleRecording={() => setIsRecording(!isRecording)}
              onEditorReady={setEditor}
              voiceRecorderComponent={
                isRecording && (
                  <VoiceRecorder
                    onClose={() => setIsRecording(false)}
                    onTranscription={handleTranscription}
                  />
                )
              }
            />
          </div>
        </main>
      </div>

      {/* Life Coach Analysis */}
      <div className="border-t lg:border-t-0 lg:border-l border-gray-200 lg:w-80 xl:w-96 flex-shrink-0 bg-gray-50">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">Life Coach Analysis</h2>
            </div>
            <button
              onClick={generateQuestions}
              disabled={isAnalyzing || !content.trim()}
              className={`p-2 rounded-full transition-all ${
                isAnalyzing 
                  ? 'bg-gray-100 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              }`}
            >
              <RefreshCw className={`h-5 w-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          
          <div className="space-y-3">
            {questions.map((q) => (
              <div
                key={q.id}
                onClick={() => !q.isLoading && handleQuestionClick(q.id, q.question)}
                className={`group relative bg-white rounded-lg p-3 shadow-sm transition-all ${
                  q.isLoading ? 'opacity-50 cursor-not-allowed' : 
                  q.isSelected ? 'ring-2 ring-blue-500 shadow-md' :
                  'hover:shadow-md cursor-pointer transform hover:-translate-y-0.5'
                }`}
              >
                <div className="flex flex-col space-y-2">
                  <div className={`inline-block px-2 py-0.5 text-xs font-medium rounded-md ${getCategoryColor(q.category)}`}>
                    {q.category.charAt(0).toUpperCase() + q.category.slice(1)}
                  </div>
                  <p className="text-sm text-gray-700">{q.question}</p>
                  
                  {/* Click to add indicator */}
                  {!q.isSelected && !q.isLoading && (
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-white via-white to-transparent opacity-0 group-hover:opacity-100 transition-opacity text-center">
                      <span className="text-xs text-blue-600 font-medium">
                        Click to add to your story
                      </span>
                    </div>
                  )}
                  
                  {/* Selected indicator */}
                  {q.isSelected && (
                    <div className="flex items-center gap-1 text-green-600 text-xs font-medium">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to story
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 