'use client';

export default function MobileOverlay() {
  const handleClick = () => {
    const sidebar = document.getElementById('mobile-sidebar');
    const overlay = document.getElementById('mobile-overlay');
    if (sidebar && overlay) {
      sidebar.classList.add('-translate-x-full');
      overlay.classList.remove('opacity-100', 'pointer-events-auto');
    }
  };

  return (
    <div 
      id="mobile-overlay"
      onClick={handleClick}
      className="fixed inset-0 bg-black bg-opacity-50 opacity-0 pointer-events-none transition-opacity duration-200 ease-in-out z-30 lg:hidden"
    />
  );
} 