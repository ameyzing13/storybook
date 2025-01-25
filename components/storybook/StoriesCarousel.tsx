'use client';

import { Story } from '@/types/supabase';
import { useState, useEffect } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import StoryCard from './StoryCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

interface StoriesCarouselProps {
  stories: Story[];
  onStoryClick: (storyId: string) => void;
}

export default function StoriesCarousel({ stories: initialStories, onStoryClick }: StoriesCarouselProps) {
  const [stories, setStories] = useState(initialStories);
  const [scrollPosition, setScrollPosition] = useState(0);
  const supabase = createClient();

  // Update local state when prop changes
  useEffect(() => {
    setStories(initialStories);
  }, [initialStories]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setStories((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        
        // Update order numbers
        const updatedItems = newItems.map((item, index) => ({
          ...item,
          order: index + 1,
        }));

        // Save new order to database
        updateStoriesOrder(updatedItems);
        
        return updatedItems;
      });
    }
  }

  async function updateStoriesOrder(updatedStories: Story[]) {
    const updates = updatedStories.map((story) => ({
      id: story.id,
      order: story.order,
      storybook_id: story.storybook_id, // Include this to satisfy RLS policies
      user_id: story.user_id, // Include this to satisfy RLS policies
    }));

    const { error } = await supabase
      .from('stories')
      .upsert(updates, { 
        onConflict: 'id',
        ignoreDuplicates: false,
      });

    if (error) {
      console.error('Error updating story order:', error);
      // Revert to initial state if update fails
      setStories(initialStories);
    }
  }

  function scrollLeft() {
    setScrollPosition(Math.max(0, scrollPosition - 300));
  }

  function scrollRight() {
    const maxScroll = stories.length * 300 - window.innerWidth + 64;
    setScrollPosition(Math.min(maxScroll, scrollPosition + 300));
  }

  return (
    <div className="relative">
      {/* Scroll Buttons */}
      {scrollPosition > 0 && (
        <button
          onClick={scrollLeft}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {scrollPosition < stories.length * 300 - window.innerWidth + 64 && (
        <button
          onClick={scrollRight}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-md hover:bg-gray-50"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Stories Container */}
      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-300"
          style={{ transform: `translateX(-${scrollPosition}px)` }}
        >
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={stories}
              strategy={horizontalListSortingStrategy}
            >
              {stories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => onStoryClick(story.id)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </div>
  );
} 