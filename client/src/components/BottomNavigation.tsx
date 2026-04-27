import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'wouter';
import { Home, BarChart3, MessageCircle, Headphones, Map, AlertCircle, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

interface BottomNavigationProps {
  currentPath: string;
}

/**
 * Bottom navigation bar for mobile app
 * Provides quick access to all main features with animations
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPath }) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Início', icon: <Home size={24} />, path: '/' },
    { id: 'dashboard', label: 'Diagnóstico', icon: <BarChart3 size={24} />, path: '/dashboard' },
    { id: 'chat', label: 'IA', icon: <MessageCircle size={24} />, path: '/chat' },
    { id: 'helmet', label: 'Pilotagem', icon: <Headphones size={24} />, path: '/helmet' },
    { id: 'map', label: 'Mapa', icon: <Map size={24} />, path: '/map' },
    { id: 'alerts', label: 'Alertas', icon: <AlertCircle size={24} />, path: '/alerts' },
    { id: 'settings', label: 'Ajustes', icon: <Settings size={24} />, path: '/settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-accent/20 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 max-w-full overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.id} href={item.path}>
            <motion.a
              className={`flex flex-col items-center justify-center w-16 h-20 transition-smooth cursor-pointer ${
                currentPath === item.path
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={item.label}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={currentPath === item.path ? { scale: 1.1 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {item.icon}
              </motion.div>
              <motion.span
                className="text-xs mt-1 font-medium"
                animate={currentPath === item.path ? { opacity: 1 } : { opacity: 0.7 }}
              >
                {item.label}
              </motion.span>
            </motion.a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
