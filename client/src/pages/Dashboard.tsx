import React, { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Gauge, Compass, Thermometer, MapPin } from 'lucide-react';

interface DashboardMetric {
  id: string;
  label: string;
  value: string | number;
  unit: string;
  icon: React.ReactNode;
  color: string;
}

/**
 * Dashboard page - Real-time motorcycle metrics
 * Displays velocity, inclination, temperature, and location with animated cards
 */
export default function Dashboard() {
  const [location] = useLocation();
  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    {
      id: 'velocity',
      label: 'Velocidade',
      value: 0,
      unit: 'km/h',
      icon: <Gauge size={32} />,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'inclination',
      label: 'Inclinação',
      value: 0,
      unit: '°',
      icon: <Compass size={32} />,
      color: 'from-purple-500 to-purple-600',
    },
    {
      id: 'temperature',
      label: 'Temperatura',
      value: 45,
      unit: '°C',
      icon: <Thermometer size={32} />,
      color: 'from-orange-500 to-orange-600',
    },
    {
      id: 'location',
      label: 'Localização',
      value: '-23.55°S',
      unit: '-46.63°W',
      icon: <MapPin size={32} />,
      color: 'from-green-500 to-green-600',
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
        <h1 className="text-2xl font-bold text-accent">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">Monitoramento em tempo real</p>
      </div>

      {/* Metrics Grid */}
      <div className="p-4 space-y-4">
        {metrics.map((metric, index) => (
          <div
            key={metric.id}
            className="glass-card group cursor-pointer transition-smooth hover:border-accent/40"
            style={{
              animation: `slideUp 0.5s ease-out ${index * 0.1}s both`,
            }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-accent">
                    {metric.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{metric.unit}</span>
                </div>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${metric.color} text-white opacity-80 group-hover:opacity-100 transition-smooth`}>
                {metric.icon}
              </div>
            </div>

            {/* Animated bar indicator */}
            <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${metric.color} transition-all duration-500`}
                style={{
                  width: `${Math.min((Number(metric.value) / 120) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="p-4 mt-8">
        <div className="glass-card">
          <h3 className="text-lg font-semibold text-foreground mb-4">Resumo</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-accent">2h</p>
              <p className="text-xs text-muted-foreground mt-1">Tempo de uso</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">45km</p>
              <p className="text-xs text-muted-foreground mt-1">Distância</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">98%</p>
              <p className="text-xs text-muted-foreground mt-1">Saúde</p>
            </div>
          </div>
        </div>
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
