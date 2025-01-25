import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StoryEditor from "@/components/story/StoryEditor";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";

interface StoryParams {
  storybookId: string;
  storyId: string;
}

interface PageProps {
  params: Promise<StoryParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { params } = props;
  const resolvedParams = await params;
  const supabase = await createClient();
  
  const { data: story } = await supabase
    .from('stories')
    .select('title')
    .eq('id', resolvedParams.storyId)
    .single();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: story?.title || 'Story',
    openGraph: {
      images: [...previousImages],
    },
  };
}

export default async function StoryPage(props: PageProps) {
  const { params } = props;
  const resolvedParams = await params;
  const supabase = await createClient();

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
    .eq('id', resolvedParams.storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  // Then verify the story exists and belongs to this storybook
  const { data: story } = await supabase
    .from('stories')
    .select('*')
    .eq('id', resolvedParams.storyId)
    .eq('storybook_id', resolvedParams.storybookId)
    .single();

  if (!story) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <StoryEditor 
        storybookId={resolvedParams.storybookId} 
        storyId={resolvedParams.storyId}
        user={user}
      />
    </div>
  );
} 