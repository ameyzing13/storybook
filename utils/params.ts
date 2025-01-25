import { notFound } from "next/navigation";

interface StorybookParams {
  storybookId: string;
}

interface StoryParams extends StorybookParams {
  storyId: string;
}

export async function validateAndGetParams<T extends Record<string, string>>(params: T | Promise<T>): Promise<T> {
  const resolvedParams = await params;
  
  for (const [key, value] of Object.entries(resolvedParams)) {
    if (!value || Array.isArray(value)) {
      notFound();
    }
  }
  
  return resolvedParams;
} 