import React, { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle2, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * Alerts page - Critical events and notifications
 * Displays motorcycle alerts with flash animation and vibration feedback
 */
export default function Alerts() {
  const [location] = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'critical',
      title: 'Possível queda detectada',
      message: 'Ângulo de inclinação crítico detectado. Verifique seu status.',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Vibração anormal',
      message: 'Padrão de vibração fora do normal nas últimas 2 horas.',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Manutenção programada',
      message: 'Sua moto atingiu 5000km. Hora de fazer revisão.',
      timestamp: new Date(Date.now() - 1 * 3600000),
      read: true,
    },
  ]);

  const handleDismiss = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    // Trigger vibration
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
  };

  const handleMarkAsRead = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, read: true } : alert
      )
    );
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      case 'info':
        return <CheckCircle2 size={24} />;
    }
  };

  const getAlertColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'border-red-500/50 bg-red-500/10';
      case 'warning':
        return 'border-yellow-500/50 bg-yellow-500/10';
      case 'info':
        return 'border-green-500/50 bg-green-500/10';
    }
  };

  const getAlertTextColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-400';
      case 'warning':
        return 'text-yellow-400';
      case 'info':
        return 'text-green-400';
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <h1 className="text-2xl font-bold text-accent">Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {alerts.filter((a) => !a.read).length} não lido(s)
        </p>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-3">
        {alerts.length === 0 ? (
          <div className="glass-card text-center py-12">
            <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
            <p className="text-foreground font-semibold mb-2">Tudo em ordem!</p>
            <p className="text-sm text-muted-foreground">
              Nenhum alerta no momento
            </p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`glass-card border-2 transition-smooth ${getAlertColor(
                alert.type
              )} ${alert.type === 'critical' ? 'flash-alert' : ''}`}
            >
              <div className="flex items-start gap-3">
                <div className={`flex-shrink-0 mt-1 ${getAlertTextColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${getAlertTextColor(alert.type)}`}>
                    {alert.title}
                  </h3>
                  <p className="text-sm text-foreground mt-1">{alert.message}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {alert.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>

                <div className="flex gap-2 flex-shrink-0">
                  {!alert.read && (
                    <Button
                      onClick={() => handleMarkAsRead(alert.id)}
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:bg-accent/20"
                    >
                      ✓
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDismiss(alert.id)}
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X size={18} />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Settings */}
      {alerts.length > 0 && (
        <div className="p-4 mt-4">
          <div className="glass-card">
            <h3 className="font-semibold text-foreground mb-3">Preferências</h3>
            <div className="space-y-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-muted-foreground">Notificações sonoras</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-muted-foreground">Vibração</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded" />
                <span className="text-muted-foreground">Alertas críticos</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNavigation currentPath={location} />
    </div>
  );
}
