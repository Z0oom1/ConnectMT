import React from 'react';

interface MotoBikeSilhouetteProps {
  isActive: boolean;
  animated?: boolean;
}

/**
 * Motorcycle silhouette component with neon glow effect
 * Shows active/inactive status with animated glow
 */
export const MotoBikeSilhouette: React.FC<MotoBikeSilhouetteProps> = ({ 
  isActive, 
  animated = true 
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* SVG Motorcycle Silhouette */}
      <svg
        viewBox="0 0 200 120"
        className={`w-48 h-32 mb-8 transition-smooth ${
          isActive ? 'pulse-glow' : ''
        } ${animated ? 'scan-line' : ''}`}
        style={{
          filter: isActive ? 'drop-shadow(0 0 20px rgba(45, 170, 255, 0.6))' : 'none',
        }}
      >
        {/* Motorcycle outline */}
        <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
          {/* Front wheel */}
          <circle cx="30" cy="90" r="20" className="text-accent" />
          {/* Front wheel hub */}
          <circle cx="30" cy="90" r="3" className="text-accent fill-current" />
          
          {/* Rear wheel */}
          <circle cx="170" cy="90" r="20" className="text-accent" />
          {/* Rear wheel hub */}
          <circle cx="170" cy="90" r="3" className="text-accent fill-current" />
          
          {/* Frame - main triangle */}
          <line x1="30" y1="90" x2="100" y2="40" className="text-accent" />
          <line x1="100" y1="40" x2="170" y2="90" className="text-accent" />
          <line x1="30" y1="90" x2="170" y2="90" className="text-accent" />
          
          {/* Seat */}
          <path d="M 100 40 Q 110 35 120 40" className="text-accent" />
          
          {/* Handlebars */}
          <line x1="50" y1="65" x2="50" y2="45" className="text-accent" />
          <path d="M 45 45 Q 50 40 55 45" className="text-accent" />
          
          {/* Engine block */}
          <rect x="95" y="60" width="20" height="20" className="text-accent" />
          
          {/* Exhaust pipe */}
          <path d="M 115 75 Q 130 80 140 85" className="text-accent" />
        </g>
      </svg>

      {/* Status Indicator */}
      <div className="flex items-center gap-3 mt-4">
        <div
          className={`w-4 h-4 rounded-full transition-smooth ${
            isActive
              ? 'bg-green-500 shadow-lg shadow-green-500/50'
              : 'bg-red-500 shadow-lg shadow-red-500/50'
          }`}
        />
        <span className="text-sm font-medium text-foreground">
          {isActive ? 'Ativa' : 'Parada'}
        </span>
      </div>
    </div>
  );
};

export default MotoBikeSilhouette;
