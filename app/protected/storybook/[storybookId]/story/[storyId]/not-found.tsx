import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Story Not Found</h2>
        <p className="text-gray-500 mb-6">The story you're looking for doesn't exist or you don't have access to it.</p>
        <Link
          href="/protected"
          className="text-blue-600 hover:text-blue-700"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 