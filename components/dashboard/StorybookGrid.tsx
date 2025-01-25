'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { Storybook } from '@/types/supabase';
import { Trash2, Edit } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StorybookGrid() {
  const [storybooks, setStorybooks] = useState<Storybook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchStorybooks();
  }, []);

  async function fetchStorybooks() {
    const { data, error } = await supabase
      .from('storybooks')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setStorybooks(data);
    }
    setIsLoading(false);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm('Are you sure you want to delete this storybook?');
    if (!confirmed) return;

    const { error } = await supabase
      .from('storybooks')
      .delete()
      .eq('id', id);

    if (!error) {
      setStorybooks(storybooks.filter(book => book.id !== id));
      router.refresh();
    }
  }

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {storybooks.map((storybook) => (
          <div
            key={storybook.id}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-all cursor-pointer"
            onClick={() => router.push(`/protected/storybook/${storybook.id}`)}
          >
            <div className="aspect-video bg-gray-100 rounded-md mb-4"></div>
            <h3 className="font-medium text-gray-900">{storybook.title}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {storybook.story_count || 0} stories · For: {storybook.target_audience}
            </p>
            <div className="mt-4 flex items-center justify-end space-x-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/protected/storybook/${storybook.id}/edit`);
                }}
                className="p-2 text-gray-600 hover:text-blue-600"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(storybook.id);
                }}
                className="p-2 text-gray-600 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 