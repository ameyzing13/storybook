import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StoryEditor from "@/components/story/StoryEditor";
import { notFound } from "next/navigation";

export default async function StoryPage({
  params,
}: {
  params: { storybookId: string; storyId: string };
}) {
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
    .eq('id', params.storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  // Then verify the story exists and belongs to this storybook
  const { data: story } = await supabase
    .from('stories')
    .select('*')
    .eq('id', params.storyId)
    .eq('storybook_id', params.storybookId)
    .single();

  if (!story) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <StoryEditor 
        storybookId={params.storybookId} 
        storyId={params.storyId}
        user={user}
      />
    </div>
  );
} 