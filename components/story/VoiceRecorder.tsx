'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceRecorderProps {
  onTranscription: (text: string) => void;
  onClose: () => void;
}

// List of MIME types to try, in order of preference
const MIME_TYPES = [
  'audio/webm',
  'audio/webm;codecs=opus',
  'audio/mp4',
  'audio/ogg',
  'audio/wav'
];

function getSupportedMimeType(): string {
  for (const type of MIME_TYPES) {
    if (MediaRecorder.isTypeSupported(type)) {
      return type;
    }
  }
  throw new Error('No supported MIME type found for MediaRecorder');
}

export default function VoiceRecorder({ onTranscription, onClose }: VoiceRecorderProps) {
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25MB in bytes

  useEffect(() => {
    startRecording();
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      setFileSize(0);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
          // Calculate total size
          const totalSize = chunksRef.current.reduce((acc, chunk) => acc + chunk.size, 0);
          setFileSize(totalSize);
          
          // Stop recording if size exceeds 25MB
          if (totalSize >= MAX_FILE_SIZE && mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
          }
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = () => {
        setError('Recording error occurred');
        onClose();
      };

      mediaRecorder.start(1000);
      
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setDuration(seconds);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? err.message : 'Error accessing microphone');
      onClose();
    }
  };

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true);
    setError(null);
    try {
      const formData = new FormData();
      const extension = audioBlob.type.split('/')[1].split(';')[0];
      formData.append('file', audioBlob, `audio.${extension}`);

      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Transcription failed');
      }

      onTranscription(data.text);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      setError(error instanceof Error ? error.message : 'Error transcribing audio');
      onClose();
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (error) {
    return (
      <>
        <span className="mr-2">🎤</span>
        {error}
      </>
    );
  }

  if (isProcessing) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex space-x-1">
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-medium">Typing out your story...</span>
          <span className="text-xs text-blue-600">This may take a few seconds</span>
        </div>
      </div>
    );
  }

  const fileSizePercentage = Math.min(100, Math.round((fileSize / MAX_FILE_SIZE) * 100));

  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Mic className="h-5 w-5" />
        <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="font-medium">{formatDuration(duration)}</span>
          <span className="text-xs text-gray-500">({fileSizePercentage}%)</span>
        </div>
        <div className="w-32 h-1 bg-gray-200 rounded-full mt-1">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${fileSizePercentage}%` }}
          />
        </div>
        <span className="text-sm mt-1">Click anywhere to stop</span>
      </div>
    </div>
  );
} 