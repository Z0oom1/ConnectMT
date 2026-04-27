import React from 'react';
import { Link } from 'wouter';
import { Home, BarChart3, MessageCircle, Headphones, Map, AlertCircle } from 'lucide-react';

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
 * Provides quick access to all main features
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentPath }) => {
  const navItems: NavItem[] = [
    { id: 'home', label: 'Home', icon: <Home size={24} />, path: '/' },
    { id: 'dashboard', label: 'Dashboard', icon: <BarChart3 size={24} />, path: '/dashboard' },
    { id: 'chat', label: 'IA', icon: <MessageCircle size={24} />, path: '/chat' },
    { id: 'helmet', label: 'Capacete', icon: <Headphones size={24} />, path: '/helmet' },
    { id: 'map', label: 'Mapa', icon: <Map size={24} />, path: '/map' },
    { id: 'alerts', label: 'Alertas', icon: <AlertCircle size={24} />, path: '/alerts' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-accent/20 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 max-w-full overflow-x-auto">
        {navItems.map((item) => (
          <Link key={item.id} href={item.path}>
            <a
              className={`flex flex-col items-center justify-center w-16 h-20 transition-smooth ${
                currentPath === item.path
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              title={item.label}
            >
              <div className={`transition-smooth ${currentPath === item.path ? 'scale-110' : 'scale-100'}`}>
                {item.icon}
              </div>
              <span className="text-xs mt-1 font-medium">{item.label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;
