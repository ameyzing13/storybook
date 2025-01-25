import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
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
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <DashboardHeader user={user} />
        <StorybookGrid />
        <CreateStorybookButton />
      </div>
    </div>
  );
}
