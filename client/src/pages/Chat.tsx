import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2, Mic, MicOff, Volume2, VolumeX } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

/**
 * Chat page - AI diagnostic assistant
 * Allows users to chat with AI about motorcycle diagnostics
 */
export default function Chat() {
  const [location] = useLocation();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Olá! Sou a IA da ConnectMT. Como posso ajudar com sua moto hoje?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const chatMutation = trpc.ai.chat.useMutation();
  const uploadMutation = trpc.storage.uploadBase64.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (text?: string) => {
    const messageContent = text || input;
    if (!messageContent.trim() || chatMutation.isPending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!text) setInput('');

    try {
      const response = await chatMutation.mutateAsync({
        messages: [...messages, userMessage].map(m => ({
          role: m.role,
          content: m.content
        }))
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: response.message,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      
      if (!isMuted) {
        speak(response.message);
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Desculpe, tive um problema ao processar sua solicitação. Pode tentar novamente?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

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
        processAudio(audioBlob);
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
    }
  };

  const processAudio = async (blob: Blob) => {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onloadend = () => {
          const base64String = (reader.result as string).split(',')[1];
          resolve(base64String);
        };
      });
      reader.readAsDataURL(blob);
      const base64 = await base64Promise;

      const uploadResult = await uploadMutation.mutateAsync({
        base64,
        filename: 'chat_voice.webm',
        contentType: 'audio/webm',
      });

      const transcriptionResult = await transcribeMutation.mutateAsync({
        audioUrl: window.location.origin + uploadResult.url,
        language: 'pt',
      });

      if (transcriptionResult.text) {
        handleSendMessage(transcriptionResult.text);
      }
    } catch (err) {
      console.error('Error processing voice:', err);
      toast.error('Erro ao processar áudio');
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      window.speechSynthesis.speak(utterance);
    }
  };

  const isLoading = chatMutation.isPending || uploadMutation.isPending || transcribeMutation.isPending;

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-accent">IA ConnectMT</h1>
          <p className="text-sm text-muted-foreground mt-1">Diagnóstico inteligente</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsMuted(!isMuted)}
          className="text-muted-foreground"
        >
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </Button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <motion.div
                whileHover={message.role === 'user' ? { scale: 1.02 } : {}}
                className={`max-w-[80%] px-4 py-3 rounded-lg transition-smooth ${
                  message.role === 'user'
                    ? 'bg-accent text-accent-foreground rounded-br-none shadow-lg'
                    : 'glass text-foreground rounded-bl-none border-glow'
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-2 opacity-70">
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </AnimatePresence>

        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex justify-start"
            >
              <div className="glass px-4 py-3 rounded-lg rounded-bl-none border-glow">
                <div className="thinking-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="fixed bottom-20 left-0 right-0 glass border-t border-accent/20 p-4">
        <div className="flex gap-2 items-center">
          <Button
            variant="ghost"
            size="icon"
            className={`rounded-full ${isRecording ? 'text-destructive animate-pulse' : 'text-muted-foreground'}`}
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isLoading}
          >
            {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder={isRecording ? "Ouvindo..." : "Descreva o problema..."}
            className="bg-muted border-border focus:border-accent flex-1"
            disabled={isLoading || isRecording}
          />
          
          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim() || isRecording}
            className="bg-accent text-accent-foreground hover:bg-accent/90 btn-press"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
