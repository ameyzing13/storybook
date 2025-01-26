import { BookOpen, PenTool } from 'lucide-react';
import Link from 'next/link';

interface ToolCard {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const tools: ToolCard[] = [
  {
    title: "AI Journal",
    description: "Write and reflect with AI-powered journaling tools. Create multiple journals for different aspects of your life.",
    icon: <BookOpen className="h-6 w-6" />,
    href: "/protected/journal",
    color: "from-blue-600 to-violet-600",
  },
  {
    title: "AI Notepad",
    description: "Quick notes and thoughts with AI assistance. Perfect for brainstorming and capturing ideas.",
    icon: <PenTool className="h-6 w-6" />,
    href: "/protected/notes-library",
    color: "from-emerald-600 to-teal-600",
  },
];

export default function ToolsRouter() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tools Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a tool to begin your journey of self-discovery and growth.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="group relative bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-200"
          >
            <div className="p-6">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${tool.color} text-white mb-4 group-hover:scale-110 transition-transform duration-200`}>
                {tool.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {tool.title}
              </h3>
              <p className="text-sm text-gray-500">
                {tool.description}
              </p>
            </div>
            <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r ${tool.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200`} />
          </Link>
        ))}
      </div>
    </div>
  );
} 