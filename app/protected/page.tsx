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
    <div className="flex-1 flex h-screen overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <DashboardHeader user={user} />
        
        <main className="flex-1 overflow-auto">
          <StorybookGrid />
        </main>

        <CreateStorybookButton />
      </div>
    </div>
  );
}
