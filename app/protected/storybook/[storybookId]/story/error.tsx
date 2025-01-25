'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong!</h2>
        <p className="text-gray-500 mb-6">Unable to load the story.</p>
        <div className="space-x-4">
          <button
            onClick={reset}
            className="text-blue-600 hover:text-blue-700"
          >
            Try again
          </button>
          <Link
            href="/protected"
            className="text-blue-600 hover:text-blue-700"
          >
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
} 