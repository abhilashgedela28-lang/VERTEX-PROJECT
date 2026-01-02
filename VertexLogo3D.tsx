
import React from 'react';

const VertexLogo3D: React.FC<{ showText?: boolean }> = ({ showText = false }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 perspective-1000 rotate-3d">
        {/* Shared Definitions */}
        <svg style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}>
          <defs>
            <linearGradient id="silver-metal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#ffffff', stopOpacity: 1 }} />
              <stop offset="20%" style={{ stopColor: '#e5e7eb', stopOpacity: 1 }} />
              <stop offset="50%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
              <stop offset="51%" style={{ stopColor: '#4b5563', stopOpacity: 1 }} />
              <stop offset="80%" style={{ stopColor: '#9ca3af', stopOpacity: 1 }} />
              <stop offset="100%" style={{ stopColor: '#374151', stopOpacity: 1 }} />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
        </svg>

        {/* Front Face */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full drop-shadow-2xl"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <g fill="url(#silver-metal)" filter="url(#glow)">
            {/* Wings and Body Structure */}
            <path d="M50 85 L10 25 Q15 20 25 22 L50 70 Z" />
            <path d="M12 28 Q8 35 10 45 L40 75 Z" opacity="0.8" />
            <path d="M15 48 Q12 55 18 65 L35 80 Z" opacity="0.6" />
            <path d="M50 85 L90 25 Q85 20 75 22 L50 70 Z" />
            <path d="M88 28 Q92 35 90 45 L60 75 Z" opacity="0.8" />
            <path d="M85 48 Q88 55 82 65 L65 80 Z" opacity="0.6" />
            
            {/* Head Detail */}
            <path d="M50 35 Q55 35 58 42 L50 55 L42 42 Q45 35 50 35" fill="#1e293b" />
            <path d="M50 38 Q52 38 53 41 L50 48 L47 41 Q48 38 50 38" fill="url(#silver-metal)" />
            <path d="M50 85 L45 95 L50 90 L55 95 Z" fill="url(#silver-metal)" />
          </g>
        </svg>
        
        {/* Back Face (Full design mirrored) */}
        <svg 
          viewBox="0 0 100 100" 
          className="absolute inset-0 w-full h-full"
          style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
        >
          <g fill="url(#silver-metal)" filter="url(#glow)">
            <path d="M50 85 L10 25 Q15 20 25 22 L50 70 Z" />
            <path d="M12 28 Q8 35 10 45 L40 75 Z" opacity="0.8" />
            <path d="M15 48 Q12 55 18 65 L35 80 Z" opacity="0.6" />
            <path d="M50 85 L90 25 Q85 20 75 22 L50 70 Z" />
            <path d="M88 28 Q92 35 90 45 L60 75 Z" opacity="0.8" />
            <path d="M85 48 Q88 55 82 65 L65 80 Z" opacity="0.6" />
            
            <path d="M50 35 Q55 35 58 42 L50 55 L42 42 Q45 35 50 35" fill="#1e293b" />
            <path d="M50 38 Q52 38 53 41 L50 48 L47 41 Q48 38 50 38" fill="url(#silver-metal)" />
            <path d="M50 85 L45 95 L50 90 L55 95 Z" fill="url(#silver-metal)" />
          </g>
        </svg>
      </div>
      {showText && (
        <div className="mt-2 text-center">
          <h1 className="text-xl font-black tracking-[0.2em] text-white metallic-text leading-none uppercase">Vertex</h1>
          <p className="text-[7px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-1">Reach your career peak</p>
        </div>
      )}
    </div>
  );
};

export default VertexLogo3D;
