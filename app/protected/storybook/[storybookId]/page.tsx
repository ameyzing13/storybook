import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StorybookEditor from "@/components/storybook/StorybookEditor";
import { notFound } from "next/navigation";

export default async function StorybookPage({
  params,
}: {
  params: { storybookId: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify the storybook exists and user has access
  const { data: storybook } = await supabase
    .from('storybooks')
    .select('*')
    .eq('id', params.storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen bg-gray-50">
      <StorybookEditor storybookId={params.storybookId} user={user} />
    </div>
  );
} 