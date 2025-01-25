import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StorybookGrid from "@/components/dashboard/StorybookGrid";
import CreateStorybookButton from "@/components/dashboard/CreateStorybookButton";
import MobileNav from "@/components/storybook/MobileNav";
import MobileOverlay from "@/components/storybook/MobileOverlay";

export default async function ProtectedPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
      <MobileNav />
      
      {/* Sidebar */}
      <div 
        id="mobile-sidebar"
        className="fixed inset-y-0 left-0 w-full sm:w-80 transform -translate-x-full lg:relative lg:translate-x-0 transition-transform duration-200 ease-in-out z-40 lg:z-0 bg-white shadow-lg lg:shadow-none"
      >
        <div className="h-full overflow-y-auto overscroll-contain">
          <DashboardSidebar user={user} />
        </div>
      </div>

      <MobileOverlay />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <DashboardHeader user={user} />
        
        <main className="flex-1 overflow-auto px-4 py-6">
          <div className="max-w-7xl mx-auto">
            <StorybookGrid />
          </div>
        </main>

        <div className="fixed bottom-6 right-6 z-20">
          <CreateStorybookButton />
        </div>
      </div>
    </div>
  );
}
