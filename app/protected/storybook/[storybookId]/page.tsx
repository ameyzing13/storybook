import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StorybookEditor from "@/components/storybook/StorybookEditor";
import StorybookSidebar from "@/components/storybook/StorybookSidebar";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { validateAndGetParams, StorybookParams } from "@/utils/params";

interface PageProps {
  params: StorybookParams | Promise<StorybookParams>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata(
  props: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { params } = props;
  const resolvedParams = await validateAndGetParams(params);
  const supabase = await createClient();
  
  const { data: storybook } = await supabase
    .from('storybooks')
    .select('title')
    .eq('id', resolvedParams.storybookId)
    .single();

  const previousImages = (await parent).openGraph?.images || [];

  return {
    title: storybook?.title || 'Storybook',
    openGraph: {
      images: [...previousImages],
    },
  };
}

export default async function StorybookPage(props: PageProps) {
  const { params } = props;
  const resolvedParams = await validateAndGetParams(params);
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
    .eq('id', resolvedParams.storybookId)
    .eq('user_id', user.id)
    .single();

  if (!storybook) {
    return notFound();
  }

  return (
    <div className="flex-1 flex h-screen bg-gray-50">
      <StorybookSidebar storybookId={resolvedParams.storybookId} user={user} />
      <StorybookEditor storybookId={resolvedParams.storybookId} user={user} />
    </div>
  );
} 