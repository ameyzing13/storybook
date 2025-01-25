import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StoryEditor from "@/components/story/StoryEditor";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: {
    storybookId: string;
    storyId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  
  const { data: story } = await supabase
    .from('stories')
    .select('title')
    .eq('id', params.storyId)
    .single();

  return {
    title: story?.title || 'Story',
  };
}

export default async function StoryPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = await createClient();
  const { storybookId, storyId } = params;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // First verify the storybook exists and user has access
  const { data: storybook } = await supabase
    .from('storybooks')
    .select('*')
    .eq('id', storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  // Then verify the story exists and belongs to this storybook
  const { data: story } = await supabase
    .from('stories')
    .select('*')
    .eq('id', storyId)
    .eq('storybook_id', storybookId)
    .single();

  if (!story) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <StoryEditor 
        storybookId={storybookId} 
        storyId={storyId}
        user={user}
      />
    </div>
  );
} 