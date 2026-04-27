import React from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { ChevronRight, User, Cpu, Bell, Ruler, Shield, Info } from 'lucide-react';

export default function Settings() {
  const [location] = useLocation();

  const settingsGroups = [
    {
      id: 'profile',
      label: 'Perfil da moto',
      value: 'Yamaha R3 2026',
      icon: <User size={20} />,
    },
    {
      id: 'device',
      label: 'Dispositivo',
      value: 'ConnectMT v1.0.0',
      icon: <Cpu size={20} />,
    },
    {
      id: 'notifications',
      label: 'Notificações',
      value: 'Ativadas',
      icon: <Bell size={20} />,
    },
    {
      id: 'units',
      label: 'Unidades',
      value: 'Métrico (km/h, °C)',
      icon: <Ruler size={20} />,
    },
    {
      id: 'privacy',
      label: 'Privacidade',
      value: 'Gerenciar dados',
      icon: <Shield size={20} />,
    },
    {
      id: 'about',
      label: 'Sobre o app',
      value: 'Versão 1.0.0',
      icon: <Info size={20} />,
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <h1 className="text-2xl font-bold text-accent">Configurações</h1>
      </div>

      <div className="p-4 space-y-3">
        {settingsGroups.map((item) => (
          <button
            key={item.id}
            className="w-full glass-card flex items-center justify-between p-5 active:bg-white/5 transition-smooth"
          >
            <div className="flex items-center gap-4">
              <div className="text-accent">
                {item.icon}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{item.value}</p>
              </div>
            </div>
            <ChevronRight className="text-muted-foreground" size={20} />
          </button>
        ))}
      </div>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
