import React, { useState } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Play, Pause, RotateCcw } from 'lucide-react';

/**
 * Map page - Route tracking with neon styling
 * Displays motorcycle route with animated replay functionality
 */
export default function MapPage() {
  const [location] = useLocation();
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayProgress, setReplayProgress] = useState(0);

  const handleReplayToggle = () => {
    setIsReplaying(!isReplaying);
    if (!isReplaying) {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        setReplayProgress(progress);
        if (progress >= 100) {
          setIsReplaying(false);
          setReplayProgress(0);
          clearInterval(interval);
        }
      }, 50);
    }
  };

  const handleReset = () => {
    setReplayProgress(0);
    setIsReplaying(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Mapa ao vivo</h1>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative bg-gradient-to-b from-background to-background/80 overflow-hidden">
        {/* SVG Map Background */}
        <svg
          viewBox="0 0 400 600"
          className="w-full h-full"
          style={{ background: 'linear-gradient(135deg, rgba(11,15,20,1) 0%, rgba(26,31,38,0.8) 100%)' }}
        >
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(45,170,255,0.1)" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="400" height="600" fill="url(#grid)" />

          {/* Route Path */}
          <path
            d="M 50 100 Q 150 80 200 150 T 350 300"
            stroke="rgba(45, 170, 255, 0.8)"
            strokeWidth="3"
            fill="none"
            strokeLinecap="round"
            style={{
              filter: 'drop-shadow(0 0 10px rgba(45, 170, 255, 0.6))',
              strokeDasharray: '1000',
              strokeDashoffset: isReplaying ? 1000 - replayProgress * 10 : 0,
              transition: 'stroke-dashoffset 0.05s linear',
            }}
          />

          {/* Start Point */}
          <circle cx="50" cy="100" r="8" fill="rgba(34, 197, 94, 0.8)" />
          <circle cx="50" cy="100" r="12" fill="none" stroke="rgba(34, 197, 94, 0.4)" strokeWidth="2" />

          {/* End Point */}
          <circle cx="350" cy="300" r="8" fill="rgba(239, 68, 68, 0.8)" />
          <circle cx="350" cy="300" r="12" fill="none" stroke="rgba(239, 68, 68, 0.4)" strokeWidth="2" />

          {/* Current Position */}
          <circle
            cx={50 + (300 * replayProgress) / 100}
            cy={100 + (200 * replayProgress) / 100}
            r="6"
            fill="rgba(45, 170, 255, 1)"
            className="glow-neon"
          />
          <circle
            cx={50 + (300 * replayProgress) / 100}
            cy={100 + (200 * replayProgress) / 100}
            r="10"
            fill="none"
            stroke="rgba(45, 170, 255, 0.6)"
            strokeWidth="2"
            style={{
              animation: 'pulse 1.5s ease-in-out infinite',
            }}
          />
        </svg>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-card text-sm space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-muted-foreground">Início</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span className="text-muted-foreground">Fim</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent glow-neon-sm"></div>
            <span className="text-muted-foreground">Posição</span>
          </div>
        </div>
      </div>

      {/* Stats Overlay */}
      <div className="absolute bottom-24 left-4 right-4 z-30">
        <div className="glass-card p-4">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Última atualização</p>
              <p className="text-sm font-medium text-foreground">Agora</p>
            </div>
            <div className="flex gap-6">
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Velocidade</p>
                <p className="text-sm font-bold text-foreground">92 km/h</p>
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-1">Distância</p>
                <p className="text-sm font-bold text-foreground">12,4 km</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
      `}</style>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
