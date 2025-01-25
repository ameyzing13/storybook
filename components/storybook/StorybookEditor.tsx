'use client';

import { User } from '@supabase/supabase-js';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import StoriesCarousel from './StoriesCarousel';
import { Story } from '@/types/supabase';

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
    try {
      const { data, error } = await supabase
        .from('stories')
        .select('id, title, content, created_at, updated_at, storybook_id, user_id, order')
        .eq('storybook_id', storybookId)
        .order('order', { ascending: true });

      if (error) {
        console.error('Error fetching stories:', error);
        return;
      }

      if (data) {
        console.log('Fetched stories:', data); // Debug log
        setStories(data);
      }
    } catch (error) {
      console.error('Error in fetchStories:', error);
    }
    setIsLoading(false);
  }

  async function createNewStory() {
    // Get the highest order number
    const { data: highestOrder } = await supabase
      .from('stories')
      .select('order')
      .eq('storybook_id', storybookId)
      .order('order', { ascending: false })
      .limit(1)
      .single();

    const nextOrder = (highestOrder?.order || 0) + 1;

    const { data: newStory, error } = await supabase
      .from('stories')
      .insert([
        {
          title: 'Untitled Story',
          storybook_id: storybookId,
          user_id: user.id,
          content: '',
          order: nextOrder,
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
      <header className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">Stories</h2>
          <button
            onClick={createNewStory}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2 shadow-sm"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Story</span>
          </button>
        </div>
      </header>

      {/* Stories Carousel */}
      <main className="flex-1 p-4 lg:p-6 overflow-hidden">
        {stories.length === 0 ? (
          <div className="text-center py-8 lg:py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No stories yet
            </h3>
            <p className="text-gray-500 mb-6 px-4">
              Start creating memories by adding your first story
            </p>
            <button
              onClick={createNewStory}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
            >
              <Plus className="h-4 w-4" />
              New Story
            </button>
          </div>
        ) : (
          <div className="h-full overflow-x-auto overflow-y-hidden">
            <StoriesCarousel
              stories={stories}
              onStoryClick={(storyId) => router.push(`/protected/storybook/${storybookId}/story/${storyId}`)}
            />
          </div>
        )}
      </main>
    </div>
  );
} 