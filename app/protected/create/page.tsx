import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CreateStorybookForm from "@/components/dashboard/CreateStorybookForm";

export default async function CreateStorybookPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">Create New Storybook</h1>
        <CreateStorybookForm user={user} />
      </div>
    </div>
  );
} 