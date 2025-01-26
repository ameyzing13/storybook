import React, { useState, useRef } from 'react';

export default function AudioRecorder() {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const recordingRef = useRef<MediaRecorder | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: Blob[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setAudioBlob(audioBlob);
      };

      // Set start time when recording begins
      setStartTime(Date.now());
      setIsRecording(true);
      mediaRecorder.start();
      recordingRef.current = mediaRecorder;
    } catch (error) {
      console.error('Error starting recording:', error);
    }
  };

  const stopRecording = () => {
    if (recordingRef.current && startTime) {
      recordingRef.current.stop();
      recordingRef.current.stream.getTracks().forEach(track => track.stop());
      
      // Calculate duration in seconds
      const endTime = Date.now();
      const durationInSeconds = Math.round((endTime - startTime) / 1000);
      setDuration(durationInSeconds);
      setIsRecording(false);
      setStartTime(null);
    }
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;

    const formData = new FormData();
    formData.append('file', audioBlob);
    formData.append('duration', duration.toString());

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      // ... handle response
    } catch (error) {
      console.error('Error uploading audio:', error);
    }
  };

  return (
    <div>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={stopRecording}>Stop Recording</button>
      )}
      {audioBlob && !isRecording && (
        <div>
          <p>Recording duration: {duration} seconds</p>
          <button onClick={handleSubmit}>Submit Recording</button>
        </div>
      )}
    </div>
  );
} 