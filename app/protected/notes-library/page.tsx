import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function NotesLibraryPage() {
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
            <h1 className="text-2xl font-bold text-gray-900">Quick Notes</h1>
            <p className="mt-1 text-sm text-gray-500">
              Capture your thoughts and ideas with AI assistance.
            </p>
          </div>
          
          {/* Notes grid will go here */}
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-500 text-center">Notes feature coming soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
} 