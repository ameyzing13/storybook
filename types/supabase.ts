export type Storybook = {
  id: string;
  created_at: string;
  title: string;
  target_audience: string;
  user_id: string;
  collaborators?: string[];
  story_count?: number;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      storybooks: {
        Row: {
          id: string
          created_at: string
          title: string
          target_audience: string
          user_id: string
          story_count: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          target_audience: string
          user_id: string
          story_count?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          target_audience?: string
          user_id?: string
          story_count?: number | null
        }
      }
      stories: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          title: string
          content: string | null
          storybook_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          content?: string | null
          storybook_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          content?: string | null
          storybook_id?: string
          user_id?: string
        }
      }
    }
  }
} 