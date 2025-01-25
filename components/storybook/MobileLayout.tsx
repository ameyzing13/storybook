'use client';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export default function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      {/* Main Content */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        {children}
      </div>
    </div>
  );
} 