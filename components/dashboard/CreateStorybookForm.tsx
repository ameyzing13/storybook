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
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      {error && (
        <div className="mb-4 p-4 text-red-700 bg-red-100 rounded-md">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Storybook Title
          </label>
          <input
            type="text"
            name="title"
            id="title"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium text-gray-700">
            Target Audience
          </label>
          <input
            type="text"
            name="targetAudience"
            id="targetAudience"
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {isLoading ? 'Creating...' : 'Create Storybook'}
        </button>
      </div>
    </form>
  );
} 