export default function StoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex">
      {children}
    </div>
  );
} 