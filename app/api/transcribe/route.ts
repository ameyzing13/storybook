import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SUPPORTED_FORMATS = ['flac', 'm4a', 'mp3', 'mp4', 'mpeg', 'mpga', 'oga', 'ogg', 'wav', 'webm'];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const audioFile = formData.get('file') as File;
    const duration = parseInt(formData.get('duration') as string);

    if (!audioFile) {
      return NextResponse.json(
        { error: 'No audio file provided' },
        { status: 400 }
      );
    }

    // Check file format
    const fileType = audioFile.type.split('/')[1];
    if (!SUPPORTED_FORMATS.includes(fileType)) {
      return NextResponse.json(
        { error: `Unsupported file format. Supported formats: ${SUPPORTED_FORMATS.join(', ')}` },
        { status: 400 }
      );
    }

    // Create a temporary file path in the OS temp directory
    const tempDir = os.tmpdir();
    const tempFilePath = path.join(tempDir, `audio-${Date.now()}.${fileType}`);
    
    // Write the file to disk temporarily
    const bytes = await audioFile.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(tempFilePath, buffer);

    try {
      // Use the file path with OpenAI
      const transcription = await openai.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: "whisper-1",
      });

      // Store recording data in Supabase
      const supabase = await createClient();
      
      // Get the current user's session
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const { error: insertError } = await supabase
        .from('voice_recordings')
        .insert([
          {
            user_id: session?.user?.id,
            transcription: transcription.text,
            duration_seconds: duration,
            file_type: fileType,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error storing recording data:', insertError);
      }

      return NextResponse.json({ text: transcription.text });
    } finally {
      // Clean up: Always delete the temp file
      try {
        fs.unlinkSync(tempFilePath);
      } catch (cleanupError) {
        console.error('Error cleaning up temp file:', cleanupError);
      }
    }
  } catch (error) {
    console.error('Transcription error:', error);
    return NextResponse.json(
      { error: 'Error processing audio' },
      { status: 500 }
    );
  }
} 