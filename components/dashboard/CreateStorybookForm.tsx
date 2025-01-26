'use client';

import { User } from '@supabase/supabase-js';
import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface CreateStorybookFormProps {
  user: User;
}

export default function CreateStorybookForm({ user }: CreateStorybookFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const title = formData.get('title') as string;
    const targetAudience = formData.get('targetAudience') as string;

    const supabase = createClient();

    const { error: insertError } = await supabase
      .from('storybooks')
      .insert([
        {
          title,
          target_audience: targetAudience,
          user_id: user.id,
          story_count: 0,
        },
      ]);

    if (insertError) {
      setError(insertError.message);
      setIsLoading(false);
      return;
    }

    router.push('/protected');
    router.refresh();
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-r from-blue-50 to-violet-50 dark:from-blue-950 dark:to-violet-950 p-8 rounded-t-2xl border-t border-x border-gray-200 dark:border-gray-800">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Create Your Storybook</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          A storybook is your personal journal space where you can collect and organize your stories, thoughts, and memories. Think of it as a digital diary that you can dedicate to different purposes or people in your life.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-lg rounded-b-2xl p-8 border-b border-x border-gray-200 dark:border-gray-800">
        {error && (
          <div className="mb-6 p-4 text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-8">
          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Storybook Title
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Give your storybook a meaningful name that reflects its purpose.
            </p>
            <input
              type="text"
              name="title"
              id="title"
              required
              placeholder="e.g., My Personal Journey, Letters to My Children"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="targetAudience" className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              For:
            </label>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              Specify who this storybook is for - it could be for yourself, your children, future generations, or anyone special in your life.
            </p>
            <input
              type="text"
              name="targetAudience"
              id="targetAudience"
              required
              placeholder="e.g., Myself, My Kids, My Future Self"
              className="mt-1 block w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all duration-200"
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating...
              </span>
            ) : (
              'Begin Your Journey'
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 