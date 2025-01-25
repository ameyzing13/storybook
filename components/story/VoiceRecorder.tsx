'use client';

import { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

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
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: mimeType });
        await processAudio(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.onerror = () => {
        setError('Recording error occurred');
        setIsRecording(false);
      };

      // Set a data available interval of 1 second
      mediaRecorder.start(1000);
      setIsRecording(true);
      
      // Start timer
      let seconds = 0;
      timerRef.current = setInterval(() => {
        seconds += 1;
        setDuration(seconds);
      }, 1000);

    } catch (err) {
      console.error('Error accessing microphone:', err);
      setError(err instanceof Error ? err.message : 'Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
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
      setIsProcessing(false);
      return;
    }
    
    setIsProcessing(false);
    onClose();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
        <div className="text-center mb-6">
          <h3 className="text-lg font-semibold mb-2">Voice Recording</h3>
          <p className="text-gray-600 text-sm">
            {isProcessing ? 'Processing your recording...' : 'Click to start recording'}
          </p>
          {error && (
            <p className="text-red-500 text-sm mt-2">{error}</p>
          )}
        </div>

        <div className="flex flex-col items-center gap-4">
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
              <span className="text-sm text-gray-600">Transcribing...</span>
            </div>
          ) : (
            <>
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                    : 'bg-blue-600 hover:bg-blue-700'
                }`}
              >
                {isRecording ? (
                  <MicOff className="h-8 w-8 text-white" />
                ) : (
                  <Mic className="h-8 w-8 text-white" />
                )}
              </button>
              
              <div className="text-2xl font-mono font-semibold">
                {formatDuration(duration)}
              </div>
            </>
          )}
        </div>

        {!isProcessing && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
} 