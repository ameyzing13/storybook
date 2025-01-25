export default function StorybookLayout({
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