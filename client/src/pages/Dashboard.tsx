import React, { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Gauge, Compass, Thermometer, MapPin, Zap, Battery, Activity } from 'lucide-react';
import { MotoBikeSilhouette } from '@/components/MotoBikeSilhouette';

interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

export default function Dashboard() {
  const [location] = useLocation();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      id: 'velocity',
      label: 'Velocidade',
      value: 92,
      unit: 'km/h',
      icon: <Gauge size={24} />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'rpm',
      label: 'Rotação',
      value: '7.250',
      unit: 'RPM',
      icon: <Activity size={24} />,
      color: 'from-accent to-blue-400',
    },
    {
      id: 'temperature',
      label: 'Temperatura',
      value: 85,
      unit: '°C',
      icon: <Thermometer size={24} />,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'inclination',
      label: 'Inclinação',
      value: '28°',
      unit: 'Direita',
      icon: <Compass size={24} />,
      color: 'from-purple-500 to-purple-600',
    },
  ]);

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prev) =>
        prev.map((metric) => {
          if (metric.id === 'velocity') {
            return { ...metric, value: Math.floor(Math.random() * 120) };
          }
          if (metric.id === 'inclination') {
            return { ...metric, value: Math.floor(Math.random() * 45) - 22.5 };
          }
          if (metric.id === 'temperature') {
            return { ...metric, value: 40 + Math.floor(Math.random() * 20) };
          }
          return metric;
        })
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent">CONNECTMT</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-muted-foreground">Dispositivo</span>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-xs text-green-500 font-medium">Conectado</span>
              </div>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full glass flex items-center justify-center text-accent">
            <Zap size={20} />
          </div>
        </div>
      </div>

      {/* Device Status */}
      <div className="p-4">
        <div className="glass-card flex flex-col items-center py-6">
          <div className="w-full max-w-[200px] h-32 mb-4">
            <MotoBikeSilhouette isActive={true} animated={false} />
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-widest mb-1">Bateria</span>
            <div className="flex items-center gap-2">
              <Battery className="text-accent" size={20} />
              <span className="text-2xl font-bold text-foreground">12.8 V</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 grid grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className="glass-card card-hover group cursor-pointer flex flex-col border-glow"
            style={{
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">{metric.label}</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-bold text-foreground group-hover:text-accent transition-smooth glow-pulse">
                {metric.value}
              </span>
            </div>
            <span className="text-xs text-muted-foreground font-medium uppercase">{metric.unit}</span>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
