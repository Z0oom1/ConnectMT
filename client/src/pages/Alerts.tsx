import React, { useState, useEffect } from 'react';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { AlertTriangle, AlertCircle, CheckCircle2, X, Loader2 } from 'lucide-react';
import { trpc } from '@/lib/trpc';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: number;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  isRead: number;
}

/**
 * Alerts page - Critical events and notifications
 * Displays motorcycle alerts with flash animation and vibration feedback
 */
export default function Alerts() {
  const [location] = useLocation();
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getAlertsQuery = trpc.data.getAlerts.useQuery({ limit: 50, unreadOnly: false });
  const saveAlertMutation = trpc.data.saveAlert.useMutation();
  const markAsReadMutation = trpc.data.markAlertAsRead.useMutation();

  // Load alerts on mount
  useEffect(() => {
    if (getAlertsQuery.data) {
      const formattedAlerts = getAlertsQuery.data.map((alert) => ({
        ...alert,
        timestamp: new Date(alert.createdAt),
      }));
      setAlerts(formattedAlerts);
      setIsLoading(false);
    }
  }, [getAlertsQuery.data]);

  const handleDismiss = async (id: number) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    if (navigator.vibrate) {
      navigator.vibrate(100);
    }
    toast.success('Alerta removido');
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await markAsReadMutation.mutateAsync({ alertId: id });
      setAlerts((prev) =>
        prev.map((alert) =>
          alert.id === id ? { ...alert, isRead: 1 } : alert
        )
      );
    } catch (err) {
      console.error('Error marking alert as read:', err);
      toast.error('Erro ao marcar como lido');
    }
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

  const unreadCount = alerts.filter((a) => a.isRead === 0).length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pb-24 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-0 glass border-b border-accent/20 p-4 z-40">
        <h1 className="text-2xl font-bold text-accent">Alertas</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {unreadCount} não lido(s)
        </p>
      </div>

      {/* Alerts List */}
      <div className="p-4 space-y-4">
        {alerts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card card-hover text-center py-12 border-glow"
          >
            <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
            <p className="text-foreground font-semibold mb-2">Tudo em ordem!</p>
            <p className="text-sm text-muted-foreground">
              Nenhum alerta no momento
            </p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {alerts.map((alert, idx) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: idx * 0.05 }}
                className={`glass-card card-hover border-l-4 transition-smooth p-5 fade-in ${getAlertColor(
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
                      {alert.isRead === 0 && (
                        <span className="ml-2 inline-block w-2 h-2 bg-accent rounded-full"></span>
                      )}
                    </h3>
                    <p className="text-sm text-foreground/80 mt-1">{alert.message}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-3">
                      {alert.timestamp.toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>

                    <div className="flex gap-2 mt-3">
                      {alert.isRead === 0 && (
                        <button 
                          onClick={() => handleMarkAsRead(alert.id)}
                          className="text-xs text-accent font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                        >
                          Marcar como lido
                        </button>
                      )}
                      <button 
                        onClick={() => handleDismiss(alert.id)}
                        className="text-xs text-muted-foreground font-medium underline underline-offset-4 hover:opacity-80 transition-opacity"
                      >
                        Descartar
                      </button>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDismiss(alert.id)}
                    className="flex-shrink-0 text-muted-foreground hover:text-foreground"
                  >
                    <X size={20} />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Alert Settings */}
      {alerts.length > 0 && (
        <div className="p-4 mt-4">
          <div className="glass-card card-hover border-glow">
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
