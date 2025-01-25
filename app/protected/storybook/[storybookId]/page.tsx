import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import StorybookEditor from "@/components/storybook/StorybookEditor";
import StorybookSidebar from "@/components/storybook/StorybookSidebar";
import MobileNav from "@/components/storybook/MobileNav";
import { notFound } from "next/navigation";
import { Metadata, ResolvingMetadata } from "next";
import { validateAndGetParams, StorybookParams } from "@/utils/params";
import { Menu } from "lucide-react";

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
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden bg-gray-50">
      <MobileNav />
      
      {/* Mobile Sidebar */}
      <div 
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 w-full sm:w-80 transform -translate-x-full lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:z-0 bg-white shadow-lg lg:shadow-none"
      >
        <div className="h-full overflow-y-auto">
          <StorybookSidebar storybookId={resolvedParams.storybookId} user={user} />
        </div>
      </div>

      {/* Mobile Overlay */}
      <div 
        id="mobile-overlay"
        className="fixed inset-0 bg-black bg-opacity-50 opacity-0 pointer-events-none transition-opacity duration-200 ease-in-out z-30 lg:hidden"
        onClick={() => {
          const sidebar = document.getElementById('mobile-sidebar');
          const overlay = document.getElementById('mobile-overlay');
          if (sidebar && overlay) {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.remove('opacity-100', 'pointer-events-auto');
          }
        }}
      />

      {/* Main Content */}
      <div className="flex-1 min-w-0 h-full overflow-hidden">
        <StorybookEditor storybookId={resolvedParams.storybookId} user={user} />
      </div>
    </div>
  );
} 