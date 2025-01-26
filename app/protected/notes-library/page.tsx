import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import Link from "next/link";
import { PlusCircle, FileText } from "lucide-react";

export default async function NotesLibraryPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch all notes for the user
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .order("updated_at", { ascending: false });

  return (
    <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        <DashboardHeader user={user} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Quick Notes</h1>
              <p className="mt-1 text-sm text-gray-500">
                Capture your thoughts and ideas quickly.
              </p>
            </div>
            <Link
              href="/protected/notes-library/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
            >
              <PlusCircle className="h-5 w-5" />
              <span>UNDER DEVELOPMENT - New Note</span>
            </Link>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes?.map((note) => (
              <Link
                key={note.id}
                href={`/protected/notes-library/${note.id}`}
                className="group relative bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600">
                      {note.title || "Untitled Note"}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {new Date(note.updated_at).toLocaleDateString()}
                    </p>
                  </div>
                  <FileText className="h-5 w-5 text-gray-400 group-hover:text-blue-500" />
                </div>
                <div className="mt-3">
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {note.content ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: note.content.replace(/<[^>]*>/g, "").slice(0, 150) + "...",
                        }}
                      />
                    ) : (
                      <span className="text-gray-400 italic">No content</span>
                    )}
                  </p>
                </div>
              </Link>
            ))}

            {notes?.length === 0 && (
              <div className="col-span-full">
                <div className="text-center bg-white rounded-lg shadow-sm p-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No notes</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by creating a new note.
                  </p>
                  <div className="mt-6">
                    <Link
                      href="/protected/notes-library/new"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
                    >
                      <PlusCircle className="h-5 w-5" />
                      <span>New Note</span>
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 