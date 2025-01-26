'use client';

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { ChevronLeft, Save, Trash2 } from "lucide-react";
import NoteEditor from "@/components/note/NoteEditor";
import { Editor } from "@tiptap/react";

interface Note {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export default function NotePage({ params }: { params: { noteId: string } }) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [editor, setEditor] = useState<Editor | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function loadNote() {
      setIsLoading(true);
      try {
        const { data: note } = await supabase
          .from("notes")
          .select("*")
          .eq("id", params.noteId)
          .single();

        if (note) {
          setTitle(note.title);
          setContent(note.content || "");
          setLastSaved(new Date(note.updated_at));
        }
      } catch (error) {
        console.error("Error loading note:", error);
      }
      setIsLoading(false);
    }

    if (params.noteId !== "new") {
      loadNote();
    } else {
      setIsLoading(false);
    }
  }, [params.noteId]);

  async function handleSave() {
    setIsSaving(true);
    try {
      if (params.noteId === "new") {
        const { data, error } = await supabase
          .from("notes")
          .insert([
            {
              title: title || "Untitled Note",
              content,
            },
          ])
          .select()
          .single();

        if (!error && data) {
          router.push(`/protected/notes-library/${data.id}`);
        }
      } else {
        const { error } = await supabase
          .from("notes")
          .update({
            title,
            content,
          })
          .eq("id", params.noteId);

        if (!error) {
          setLastSaved(new Date());
        }
      }
    } catch (error) {
      console.error("Error saving note:", error);
    }
    setIsSaving(false);
  }

  async function handleDelete() {
    if (!window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      return;
    }

    try {
      const { error } = await supabase
        .from("notes")
        .delete()
        .eq("id", params.noteId);

      if (!error) {
        router.push("/protected/notes-library");
        router.refresh();
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  }

  // Autosave every 30 seconds if there are changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (
        params.noteId !== "new" &&
        (lastSaved === null || new Date().getTime() - lastSaved.getTime() > 30000)
      ) {
        handleSave();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [title, content, lastSaved, params.noteId]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top Navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={async () => {
                    if (params.noteId !== "new") {
                      await handleSave();
                    }
                    router.push("/protected/notes-library");
                  }}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700 py-2"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back to Notes
                </button>
                {params.noteId !== "new" && (
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-1 text-sm text-red-600 hover:text-red-700 py-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="hidden sm:inline">Delete Note</span>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2 lg:gap-3">
                {lastSaved && (
                  <span className="text-sm text-gray-500 hidden sm:inline">
                    Last saved {lastSaved.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 shadow-sm"
                >
                  <Save className="h-4 w-4" />
                  <span className="hidden sm:inline">{isSaving ? "Saving..." : "Save"}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Editor */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="w-full text-2xl lg:text-3xl font-semibold bg-transparent border-b border-gray-200 pb-2 mb-6 lg:mb-8 focus:outline-none focus:border-blue-500"
            />

            <NoteEditor
              content={content}
              onChange={setContent}
              className="prose max-w-none"
              onEditorReady={setEditor}
              onSave={handleSave}
            />
          </div>
        </main>
      </div>
    </div>
  );
} 