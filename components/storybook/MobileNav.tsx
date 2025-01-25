'use client';

import { Menu } from 'lucide-react';

export default function MobileNav() {
  const toggleSidebar = () => {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar && overlay) {
      sidebar.classList.toggle('translate-x-0');
      sidebar.classList.toggle('-translate-x-full');
      overlay.classList.toggle('opacity-100');
      overlay.classList.toggle('pointer-events-auto');
    }
  };

  return (
    <div className="lg:hidden">
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-md shadow-lg hover:bg-gray-50 active:bg-gray-100"
        aria-label="Toggle menu"
      >
        <Menu className="h-6 w-6 text-gray-600" />
      </button>
    </div>
  );
} 