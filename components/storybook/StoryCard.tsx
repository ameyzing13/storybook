'use client';

import { Story } from '@/types/supabase';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface StoryCardProps {
  story: Story;
  onClick: () => void;
}

export default function StoryCard({ story, onClick }: StoryCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: story.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-lg shadow-md border border-gray-200 w-72 h-96 flex flex-col cursor-pointer transition-shadow hover:shadow-lg ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 right-2 p-1 rounded-md hover:bg-gray-100 cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>

      {/* Story Number */}
      <div className="absolute top-2 left-2 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
        {story.order}
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col" onClick={onClick}>
        {/* Page Design */}
        <div className="flex-1 bg-gray-50 rounded-md p-4 mb-4 relative">
          <div className="absolute top-0 right-0 w-8 h-8 bg-gray-100 rounded-bl-lg" /> {/* Page curl */}
          <div className="space-y-2">
            <div className="h-2 bg-gray-200 rounded w-3/4" />
            <div className="h-2 bg-gray-200 rounded w-1/2" />
            <div className="h-2 bg-gray-200 rounded w-2/3" />
          </div>
        </div>

        {/* Story Info */}
        <h3 className="font-medium text-gray-900 mb-1 line-clamp-1">
          {story.title}
        </h3>
        <p className="text-sm text-gray-500">
          Last updated: {new Date(story.updated_at).toLocaleDateString()}
        </p>
        {story.content && (
          <p className="text-sm text-gray-700 mt-2 line-clamp-2">
            {story.content}
          </p>
        )}
      </div>
    </div>
  );
} 