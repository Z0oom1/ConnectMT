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
      title: 'Alerta de colisão',
      message: 'Impacto detectado às 14:32',
      timestamp: new Date(Date.now() - 5 * 60000),
      read: false,
    },
    {
      id: '2',
      type: 'warning',
      title: 'Temperatura alta',
      message: 'Temperatura do motor acima do ideal',
      timestamp: new Date(Date.now() - 15 * 60000),
      read: false,
    },
    {
      id: '3',
      type: 'info',
      title: 'Manutenção',
      message: 'Troca de óleo recomendada em 500 km',
      timestamp: new Date(Date.now() - 1 * 3600000),
      read: false,
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
        return 'border-red-500/20 bg-red-500/5';
      case 'warning':
        return 'border-yellow-500/20 bg-yellow-500/5';
      case 'info':
        return 'border-blue-500/20 bg-blue-500/5';
    }
  };

  const getAlertTextColor = (type: Alert['type']) => {
    switch (type) {
      case 'critical':
        return 'text-red-500';
      case 'warning':
        return 'text-yellow-500';
      case 'info':
        return 'text-accent';
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
      <div className="p-4 space-y-4">
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
              className={`glass-card border-l-4 transition-smooth p-5 ${getAlertColor(
                alert.type
              )} ${alert.type === 'critical' ? 'flash-alert' : ''}`}
              style={{ borderLeftColor: 'currentColor' }}
            >
              <div className="flex items-start gap-4">
                <div className={`flex-shrink-0 mt-1 ${getAlertTextColor(alert.type)}`}>
                  {getAlertIcon(alert.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className={`text-base font-bold ${getAlertTextColor(alert.type)}`}>
                    {alert.title}
                  </h3>
                  <p className="text-sm text-foreground/80 mt-1">{alert.message}</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-3">
                    {alert.timestamp.toLocaleTimeString('pt-BR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                  
                  <button className="text-xs text-accent font-medium mt-3 underline underline-offset-4">
                    Ver detalhes
                  </button>
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
