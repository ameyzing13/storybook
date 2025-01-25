'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Storybook } from '@/types/supabase';
import { Share2, Settings } from 'lucide-react';
import Link from 'next/link';

interface StorybookSidebarProps {
  storybookId: string;
}

export default function StorybookSidebar({ storybookId }: StorybookSidebarProps) {
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStorybook() {
      const { data } = await supabase
        .from('storybooks')
        .select('*')
        .eq('id', storybookId)
        .single();

      if (data) {
        setStorybook(data);
      }
    }

    fetchStorybook();
  }, [storybookId]);

  if (!storybook) return null;

  return (
    <aside className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link
          href="/protected"
          className="text-sm text-gray-500 hover:text-gray-700 mb-6 block"
        >
          ← Back to Dashboard
        </Link>

        <div className="aspect-video bg-gray-100 rounded-lg mb-6"></div>
        
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          {storybook.title}
        </h1>
        
        <p className="text-sm text-gray-500 mb-6">
          For: {storybook.target_audience}
        </p>

        <div className="space-y-4">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Share2 className="h-4 w-4" />
            Share Storybook
          </button>
          
          <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Settings className="h-4 w-4" />
            Settings
          </button>
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Collaborators</h3>
        <div className="flex -space-x-2">
          <div className="w-8 h-8 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white text-xs">
            You
          </div>
        </div>
      </div>
    </aside>
  );
} 