import { User } from '@supabase/supabase-js';
import { Book, Users, PlusCircle, Settings, HelpCircle } from 'lucide-react';
import Link from 'next/link';

interface DashboardSidebarProps {
  user: User;
}

export default function DashboardSidebar({ user }: DashboardSidebarProps) {
  const menuItems = [
    { icon: <Book className="w-5 h-5" />, label: 'My Storybooks', href: '/protected' },
    { icon: <Users className="w-5 h-5" />, label: 'Shared with Me', href: '/protected/shared' },
    { icon: <PlusCircle className="w-5 h-5" />, label: 'Create New', href: '/protected/create' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings', href: '/protected/settings' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Help', href: '/protected/help' },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
          {user.email?.[0].toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
        </div>
      </div>

      <nav className="space-y-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
} 