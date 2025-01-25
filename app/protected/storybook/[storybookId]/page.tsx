import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StorybookEditor from "@/components/storybook/StorybookEditor";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { validateAndGetParams, StorybookParams } from "@/utils/params";
import MobileLayout from "@/components/storybook/MobileLayout";

interface PageProps {
  params: Promise<StorybookParams>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    <MobileLayout>
      <StorybookEditor storybookId={resolvedParams.storybookId} user={user} />
    </MobileLayout>
  );
} 