'use client';

import { User } from '@supabase/supabase-js';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface Story {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

interface StorybookEditorProps {
  storybookId: string;
  user: User;
}

export default function StorybookEditor({ storybookId, user }: StorybookEditorProps) {
  const [stories, setStories] = useState<Story[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchStories();
  }, [storybookId]);

  async function fetchStories() {
    const { data } = await supabase
      .from('stories')
      .select('*')
      .eq('storybook_id', storybookId)
      .order('created_at', { ascending: false });

    if (data) {
      setStories(data);
    }
    setIsLoading(false);
  }

  async function createNewStory() {
    const { data: newStory, error } = await supabase
      .from('stories')
      .insert([
        {
          title: 'Untitled Story',
          storybook_id: storybookId,
          user_id: user.id,
          content: '',
        },
      ])
      .select()
      .single();

    if (newStory) {
      setStories([newStory, ...stories]);
      router.push(`/protected/storybook/${storybookId}/story/${newStory.id}`);
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col min-w-0">
      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Stories</h2>
          <button
            onClick={createNewStory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            New Story
          </button>
        </div>
      </header>

      {/* Stories Grid */}
      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-7xl mx-auto w-full">
          {stories.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No stories yet
              </h3>
              <p className="text-gray-500 mb-6">
                Start creating memories by adding your first story
              </p>
              <button
                onClick={createNewStory}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="h-4 w-4" />
                New Story
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {stories.map((story) => (
                <div
                  key={story.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
                  onClick={() => {
                    router.push(`/protected/storybook/${storybookId}/story/${story.id}`);
                  }}
                >
                  <h3 className="font-medium text-gray-900 mb-2">{story.title}</h3>
                  <p className="text-sm text-gray-500">
                    Last updated: {new Date(story.updated_at).toLocaleDateString()}
                  </p>
                  {story.content && (
                    <p className="text-sm text-gray-700 mt-2 line-clamp-3">
                      {story.content}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 