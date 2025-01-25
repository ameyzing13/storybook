import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StorybookEditor from "@/components/storybook/StorybookEditor";
import StorybookSidebar from "@/components/storybook/StorybookSidebar";
import { notFound } from "next/navigation";
import { Metadata } from "next";

interface PageProps {
  params: {
    storybookId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const supabase = await createClient();
  
  const { data: storybook } = await supabase
    .from('storybooks')
    .select('title')
    .eq('id', params.storybookId)
    .single();

  return {
    title: storybook?.title || 'Storybook',
  };
}

export default async function StorybookPage({
  params,
  searchParams,
}: PageProps) {
  const supabase = await createClient();
  const storybookId = params.storybookId;

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
    .eq('id', storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  return (
    <div className="flex-1 flex h-screen bg-gray-50">
      <StorybookSidebar storybookId={storybookId} user={user} />
      <StorybookEditor storybookId={storybookId} user={user} />
    </div>
  );
} 