'use client';

interface VoiceRecorderProps {
  onClose: () => void;
  onTranscription: (text: string) => void;
}

export default function VoiceRecorder({ onClose, onTranscription }: VoiceRecorderProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Voice Recording
        </h3>
        
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-500 rounded-full mx-auto mb-4 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 bg-white rounded-full" />
          </div>
          <p className="text-gray-500">Recording in progress...</p>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              // TODO: Implement actual transcription
              onTranscription("This is a sample transcription.");
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Stop & Transcribe
          </button>
        </div>
      </div>
    </div>
  );
} 