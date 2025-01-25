import { Plus } from 'lucide-react';
import Link from 'next/link';

export default function CreateStorybookButton() {
  return (
    <Link
      href="/protected/create"
      className="fixed bottom-8 right-8 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 transition-colors"
    >
      <Plus className="h-6 w-6" />
    </Link>
  );
} 