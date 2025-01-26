'use client';

import { User } from '@supabase/supabase-js';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { ChevronLeft, Edit2, Save } from 'lucide-react';
import Link from 'next/link';

interface StorybookSidebarProps {
  storybookId: string;
  user: User;
}

interface Storybook {
  id: string;
  title: string;
  target_audience: string;
  created_at: string;
}

export default function StorybookSidebar({ storybookId, user }: StorybookSidebarProps) {
  const [storybook, setStorybook] = useState<Storybook | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchStorybook();
  }, [storybookId]);

  async function fetchStorybook() {
    const { data } = await supabase
      .from('storybooks')
      .select('*')
      .eq('id', storybookId)
      .single();

    if (data) {
      setStorybook(data);
      setEditedTitle(data.title);
    }
  }

  async function handleSaveTitle() {
    if (!editedTitle.trim()) return;
    
    setIsSaving(true);
    const { error } = await supabase
      .from('storybooks')
      .update({ title: editedTitle })
      .eq('id', storybookId);

    if (!error) {
      setStorybook(prev => prev ? { ...prev, title: editedTitle } : null);
      setIsEditing(false);
    }
    setIsSaving(false);
  }

  if (!storybook) return null;

  return (
    <aside className="w-full lg:w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      <div className="p-4 lg:p-6">
        <Link
          href="/protected/journal"
          className="flex items-center text-sm text-gray-500 hover:text-gray-700 mb-4 lg:mb-6 py-2"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Library
        </Link>

        <div className="aspect-video bg-gray-100 rounded-lg mb-4 lg:mb-6"></div>
        
        <div className="mb-4 lg:mb-6">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="w-full px-3 py-2 text-lg font-semibold border rounded-md focus:border-blue-500 focus:outline-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveTitle}
                  disabled={isSaving}
                  className="px-3 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          ) : (
            <div className="group relative">
              <h1 className="text-xl font-semibold text-gray-900 pr-8 break-words">
                {storybook.title}
              </h1>
              <button
                onClick={() => setIsEditing(true)}
                className="absolute top-1 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="h-4 w-4 text-gray-400 hover:text-gray-600" />
              </button>
            </div>
          )}
          <p className="text-sm text-gray-500 mt-2">
            For: {storybook.target_audience}
          </p>
        </div>

        <div className="text-sm text-gray-500 py-2">
          Created {new Date(storybook.created_at).toLocaleDateString()}
        </div>
      </div>
    </aside>
  );
} 