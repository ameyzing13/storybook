import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StorybookGrid from "@/components/dashboard/StorybookGrid";
import CreateStorybookButton from "@/components/dashboard/CreateStorybookButton";

export default async function JournalLibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <DashboardHeader user={user} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Journal Library</h1>
            <p className="mt-1 text-sm text-gray-500">
              Your personal collection of journals and stories.
            </p>
          </div>
          <StorybookGrid />
          <CreateStorybookButton />
        </div>
      </div>
    </div>
  );
} 