export default function StorybookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 flex flex-col lg:flex-row relative w-full">
      {children}
    </div>
  );
} 