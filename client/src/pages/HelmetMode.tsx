import React, { useState, useRef, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Helmet Mode page - Voice-controlled interface
 * Minimalist design for hands-free operation while riding
 */
export default function HelmetMode() {
  const [location] = useLocation();
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  const uploadMutation = trpc.storage.uploadBase64.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();
  const chatMutation = trpc.ai.chat.useMutation();

  const stats = [
    { label: 'Aceleração', value: 85 },
    { label: 'Frenagem', value: 78 },
    { label: 'Curvas', value: 90 },
    { label: 'Consistência', value: 75 },
  ];

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      if (navigator.vibrate) navigator.vibrate(50);
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Erro ao acessar o microfone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
    }
  };

  const processAudio = async (blob: Blob) => {
    setIsProcessing(true);
    try {
      // 1. Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
      });
      reader.readAsDataURL(blob);
      const base64 = await base64Promise;

      // 2. Upload to storage
      const uploadResult = await uploadMutation.mutateAsync({
        base64,
        filename: 'voice_command.webm',
        contentType: 'audio/webm',
      });

      // 3. Transcribe
      const transcriptionResult = await transcribeMutation.mutateAsync({
        audioUrl: window.location.origin + uploadResult.url,
        language: 'pt',
      });

      setTranscription(transcriptionResult.text);

      // 4. Get AI Response
      const aiResult = await chatMutation.mutateAsync({
        messages: [
          { role: 'user', content: transcriptionResult.text }
        ]
      });

      setAiResponse(aiResult.message);
      speak(aiResult.message);
    } catch (err) {
      console.error('Error processing voice command:', err);
      toast.error('Erro ao processar comando de voz');
    } finally {
      setIsProcessing(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Modo Capacete</h1>
        </div>
      </div>

      <div className="p-4 space-y-6 flex-1 flex flex-col">
        {/* Voice Control Section */}
        <div className="glass-card p-8 flex flex-col items-center justify-center space-y-8 border-glow min-h-[300px]">
          <AnimatePresence mode="wait">
            {isProcessing ? (
              <motion.div 
                key="processing"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="flex flex-col items-center space-y-4"
              >
                <Loader2 className="w-16 h-16 text-accent animate-spin" />
                <p className="text-accent font-medium animate-pulse">Processando...</p>
              </motion.div>
            ) : (
              <motion.div 
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center space-y-6 w-full"
              >
                <div className="relative">
                  {isRecording && (
                    <motion.div 
                      initial={{ scale: 1, opacity: 0.5 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="absolute inset-0 bg-accent rounded-full"
                    />
                  )}
                  <Button 
                    size="xl" 
                    variant={isRecording ? "destructive" : "default"}
                    className={`w-24 h-24 rounded-full shadow-lg transition-all duration-300 ${isRecording ? 'scale-110' : 'hover:scale-105'}`}
                    onClick={isRecording ? stopRecording : startRecording}
                  >
                    {isRecording ? <MicOff className="w-10 h-10" /> : <Mic className="w-10 h-10" />}
                  </Button>
                </div>
                <p className="text-muted-foreground text-center font-medium">
                  {isRecording ? "Ouvindo..." : "Toque para falar com a IA"}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Wave Animation during recording */}
          {isRecording && (
            <div className="flex items-center gap-1 h-8">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [8, 24, 8] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 0.5 + Math.random() * 0.5,
                    delay: i * 0.1 
                  }}
                  className="w-1 bg-accent rounded-full"
                />
              ))}
            </div>
          )}

          {/* Transcription Display */}
          {(transcription || aiResponse) && !isRecording && !isProcessing && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full space-y-4 mt-4"
            >
              {transcription && (
                <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                  <p className="text-xs text-muted-foreground uppercase mb-1">Você disse:</p>
                  <p className="text-sm text-foreground italic">"{transcription}"</p>
                </div>
              )}
              {aiResponse && (
                <div className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Volume2 className="w-3 h-3 text-accent" />
                    <p className="text-xs text-accent uppercase font-bold">ConnectMT:</p>
                  </div>
                  <p className="text-sm text-foreground">{aiResponse}</p>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Score Circular */}
        <div className="glass-card card-hover flex items-center justify-between p-6 border-glow">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Score geral</span>
            <span className="text-4xl font-bold text-foreground">82</span>
            <span className="text-xs text-green-500 font-medium mt-1">Muito bom</span>
          </div>
          <div className="relative w-24 h-24">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-white/5"
                strokeDasharray="100, 100"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-accent"
                strokeDasharray="62, 100"
                strokeWidth="3"
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">62%</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="glass-card card-hover p-4 border-glow">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-muted-foreground">{stat.label}</span>
                <span className="text-sm font-bold text-foreground">{stat.value}</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent transition-all duration-1000" 
                  style={{ width: `${stat.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
