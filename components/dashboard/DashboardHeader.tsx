'use client';

import { User } from '@supabase/supabase-js';
import { Search, LogOut } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

interface DashboardHeaderProps {
  user: User;
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        buttonRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await supabase.auth.signOut();
    router.push('/sign-in');
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="search"
                placeholder="Search storybooks..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          
          <div className="flex items-center relative">
            <button 
              ref={buttonRef}
              onClick={() => setShowDropdown(!showDropdown)}
              className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white hover:bg-blue-600 transition-colors"
            >
              {user.email?.[0].toUpperCase()}
            </button>
            
            {showDropdown && (
              <div 
                ref={dropdownRef}
                className="absolute right-0 top-full mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50"
              >
                <div className="py-1">
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
      <div className="bg-gray-50 px-6 py-4">
        <h1 className="text-2xl font-semibold text-gray-900">Your Storybooks</h1>
      </div>
    </>
  );
} 