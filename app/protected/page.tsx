import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StorybookGrid from "@/components/dashboard/StorybookGrid";
import CreateStorybookButton from "@/components/dashboard/CreateStorybookButton";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader user={user} />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            <StorybookGrid />
          </div>
        </main>

        <CreateStorybookButton />
      </div>
    </div>
  );
}
