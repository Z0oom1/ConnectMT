import React, { useState, useEffect } from 'react';
import { useAuth } from '@/_core/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { MotoBikeSilhouette } from '@/components/MotoBikeSilhouette';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation, Link } from 'wouter';
import { getLoginUrl } from '@/const';

/**
 * Home page - Main screen with motorcycle status
 * Shows real-time motorcycle status with animated silhouette
 */
export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [motoStatus, setMotoStatus] = useState<'ativa' | 'parada'>('ativa');
  const [statusMessage, setStatusMessage] = useState('Tudo normal');
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation on mount
    setShowAnimation(true);
  }, []);

  // Simulate status updates
  useEffect(() => {
    const statusMessages = [
      'Tudo normal',
      'Detectei vibração incomum',
      'Moto parada há 2h',
      'Temperatura normal',
    ];

    const interval = setInterval(() => {
      const randomStatus = statusMessages[Math.floor(Math.random() * statusMessages.length)];
      setStatusMessage(randomStatus);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="loading-line w-32 h-1 mb-4" />
          <p className="text-muted-foreground">Inicializando ConnectMT...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-accent mb-2">ConnectMT</h1>
          <p className="text-muted-foreground">Inteligência para sua moto</p>
        </div>
        <Button
          onClick={() => (window.location.href = getLoginUrl())}
          className="bg-accent text-accent-foreground hover:bg-accent/90 px-8 py-3 text-lg"
        >
          Entrar
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-accent">ConnectMT</h1>
          <div className="text-sm text-muted-foreground">
            {user?.name || 'Piloto'}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center px-4 py-8">
        {/* Motorcycle Silhouette */}
        <div className={`w-full max-w-xs h-64 transition-smooth scale-in ${showAnimation ? 'opacity-100' : 'opacity-0'}`}>
          <MotoBikeSilhouette isActive={motoStatus === 'ativa'} animated={true} />
        </div>

        {/* Status Message */}
        <div className="mt-8 glass-card card-hover text-center max-w-sm w-full border-glow fade-in">
          <p className="text-lg font-semibold text-foreground mb-2">Status da Moto</p>
          <p className="text-accent text-2xl font-bold transition-smooth">
            {statusMessage}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-sm">
          <div className="glass-card card-hover text-center border-glow slide-in-left">
            <p className="text-xs text-muted-foreground mb-1">Velocidade</p>
            <p className="text-2xl font-bold text-accent glow-pulse">0 km/h</p>
          </div>
          <div className="glass-card card-hover text-center border-glow slide-in-right">
            <p className="text-xs text-muted-foreground mb-1">Temperatura</p>
            <p className="text-2xl font-bold text-accent glow-pulse">45°C</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 w-full max-w-sm space-y-3">
          <Link href="/chat">
            <Button
              className="w-full bg-accent text-accent-foreground hover:bg-accent/90 btn-press mb-3"
            >
              Falar com IA
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button
              variant="outline"
              className="w-full border-accent/30 text-accent hover:bg-accent/10 btn-press"
            >
              Ver Dashboard
            </Button>
          </Link>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
