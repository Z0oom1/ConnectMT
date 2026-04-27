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
  
  const stats = [
    { label: 'Aceleração', value: 85 },
    { label: 'Frenagem', value: 78 },
    { label: 'Curvas', value: 90 },
    { label: 'Consistência', value: 75 },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-foreground" onClick={() => window.history.back()}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </Button>
          <h1 className="text-xl font-bold text-foreground">Sua Pilotagem</h1>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Score Circular */}
        <div className="glass-card flex items-center justify-between p-6">
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
            <div key={stat.label} className="glass-card p-4">
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

        {/* Weekly Performance Chart (Simplified) */}
        <div className="glass-card p-4">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Desempenho nos últimos 7 dias</p>
          <div className="flex items-end justify-between h-32 px-2">
            {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
              <div key={i} className="flex flex-col items-center gap-2 flex-1">
                <div 
                  className={`w-2 rounded-t-full transition-all duration-1000 ${i === 3 ? 'bg-accent' : 'bg-white/10'}`}
                  style={{ height: `${height}%` }}
                />
                <span className="text-[10px] text-muted-foreground uppercase">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
