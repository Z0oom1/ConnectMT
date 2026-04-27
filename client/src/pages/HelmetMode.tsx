import React, { useState, useRef } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2 } from 'lucide-react';

/**
 * Helmet Mode page - Voice-controlled interface
 * Minimalist design for hands-free operation while riding
 */
export default function HelmetMode() {
  const [location] = useLocation();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleVoiceInput = async () => {
    if (!isListening) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;

        const audioChunks: BlobPart[] = [];

        mediaRecorder.ondataavailable = (event) => {
          audioChunks.push(event.data);
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          // Here you would send the audio to your backend for transcription
          setTranscript('Minha moto está fazendo um barulho estranho...');
          setResponse('Detectei vibração anormal. Recomendo parar e verificar a corrente.');
          stream.getTracks().forEach((track) => track.stop());
        };

        mediaRecorder.start();
        setIsListening(true);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    } else {
      mediaRecorderRef.current?.stop();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center pb-24">
      {/* Status Indicator */}
      <div className="absolute top-4 left-4 right-4 glass border-accent/20 p-3 rounded-lg">
        <p className="text-sm text-muted-foreground text-center">Modo Capacete Ativo</p>
      </div>

      {/* Main Voice Button */}
      <div className="flex flex-col items-center justify-center flex-1 px-4">
        {/* Pulse Circle Animation */}
        <div
          className={`relative w-32 h-32 mb-8 transition-smooth ${
            isListening ? 'pulse-circle' : ''
          }`}
        >
          <Button
            onClick={handleVoiceInput}
            className={`w-full h-full rounded-full transition-smooth ${
              isListening
                ? 'bg-red-500 text-white hover:bg-red-600 scale-110'
                : 'bg-accent text-accent-foreground hover:bg-accent/90'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              {isListening ? (
                <MicOff size={48} />
              ) : (
                <Mic size={48} />
              )}
              <span className="text-xs font-semibold">
                {isListening ? 'Parar' : 'Falar'}
              </span>
            </div>
          </Button>
        </div>

        {/* Transcript Display */}
        {transcript && (
          <div className="glass-card max-w-sm w-full mb-6 text-center">
            <p className="text-xs text-muted-foreground mb-2">Você disse:</p>
            <p className="text-foreground font-medium">{transcript}</p>
          </div>
        )}

        {/* AI Response */}
        {response && (
          <div className="glass-card max-w-sm w-full mb-6 border-accent/30">
            <div className="flex items-start gap-3">
              <Volume2 className="text-accent flex-shrink-0 mt-1" size={20} />
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground mb-2">Resposta IA:</p>
                <p className="text-foreground font-medium">{response}</p>
              </div>
            </div>
          </div>
        )}

        {/* Wave Animation During Listening */}
        {isListening && (
          <div className="mt-8">
            <div className="wave-animation">
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
              <div className="wave-bar"></div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="w-full max-w-sm px-4 space-y-2 mb-4">
        <Button
          variant="outline"
          className="w-full border-accent/30 text-accent hover:bg-accent/10"
        >
          Voltar para Home
        </Button>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
