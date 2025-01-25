import { notFound } from "next/navigation";

export interface StorybookParams {
  storybookId: string;
}

interface StoryParams extends StorybookParams {
  storyId: string;
}

export async function validateAndGetParams<T extends StorybookParams>(params: Promise<T>): Promise<T> {
  const resolvedParams = await params;
  
  if (!resolvedParams.storybookId || Array.isArray(resolvedParams.storybookId)) {
    notFound();
  }
  
  return resolvedParams;
} 