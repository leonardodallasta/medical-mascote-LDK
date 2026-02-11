import React, { useMemo } from 'react';
import { MascotStatus } from '../types';

interface MascotProps {
  status: MascotStatus;
  message?: string;
  onClick?: () => void;
  gender: 'male' | 'female';
}

const Mascot: React.FC<MascotProps> = ({ status, message, onClick, gender }) => {
  
  const colors = useMemo(() => {
    switch (status) {
      case MascotStatus.HAPPY: return { body: '#198754', cap: '#d1e7dd', face: '#ffffff' };
      case MascotStatus.CONCERNED: return { body: '#ffc107', cap: '#fff3cd', face: '#333333' };
      case MascotStatus.SICK: return { body: '#fd7e14', cap: '#ffe5d0', face: '#ffffff' };
      case MascotStatus.VERY_SICK: return { body: '#dc3545', cap: '#f8d7da', face: '#ffffff' };
      case MascotStatus.CRITICAL: return { body: '#6c757d', cap: '#e2e3e5', face: '#ffffff' };
      case MascotStatus.DEAD: return { body: '#212529', cap: '#ced4da', face: '#6c757d' };
      default: return { body: '#0d6efd', cap: '#cfe2ff', face: '#ffffff' };
    }
  }, [status]);

  const Eyes = () => {
    if (status === MascotStatus.DEAD) {
      return (
        <g>
          <text x="35" y="45" fontSize="20" fill={colors.face} fontWeight="bold">X</text>
          <text x="65" y="45" fontSize="20" fill={colors.face} fontWeight="bold">X</text>
        </g>
      );
    }
    if (status === MascotStatus.HAPPY) {
      return (
        <g>
          {/* Joyful closed eyes arch */}
          <path d="M 35 45 Q 40 35 45 45" stroke={colors.face} strokeWidth="3" fill="none" />
          <path d="M 65 45 Q 70 35 75 45" stroke={colors.face} strokeWidth="3" fill="none" />
          {/* Eyelashes for female */}
          {gender === 'female' && (
            <g>
               <path d="M 33 42 L 30 38" stroke={colors.face} strokeWidth="2" />
               <path d="M 77 42 L 80 38" stroke={colors.face} strokeWidth="2" />
            </g>
          )}
        </g>
      );
    }
     if (status === MascotStatus.SICK || status === MascotStatus.VERY_SICK) {
      return (
        <g>
           <line x1="35" y1="42" x2="45" y2="42" stroke={colors.face} strokeWidth="3" />
           <line x1="65" y1="42" x2="75" y2="42" stroke={colors.face} strokeWidth="3" />
           {/* Bags under eyes */}
           <path d="M 35 46 Q 40 50 45 46" stroke={colors.face} strokeWidth="1" fill="none" opacity="0.5" />
           <path d="M 65 46 Q 70 50 75 46" stroke={colors.face} strokeWidth="1" fill="none" opacity="0.5" />
        </g>
      );
    }
    // Concerned/Critical - big round eyes
    return (
      <g>
        <circle cx="40" cy="40" r="5" fill={colors.face} />
        <circle cx="70" cy="40" r="5" fill={colors.face} />
        {gender === 'female' && (
             <g>
               <path d="M 35 35 L 32 32" stroke={colors.face} strokeWidth="2" />
               <path d="M 75 35 L 78 32" stroke={colors.face} strokeWidth="2" />
            </g>
        )}
      </g>
    );
  };

  const Mouth = () => {
    if (status === MascotStatus.HAPPY) {
      return <path d="M 40 60 Q 55 75 70 60" stroke={colors.face} strokeWidth="3" fill="none" />;
    }
    if (status === MascotStatus.CONCERNED) {
       return <path d="M 40 65 Q 55 55 70 65" stroke={colors.face} strokeWidth="3" fill="none" />;
    }
    if (status === MascotStatus.DEAD) {
        return <path d="M 40 70 Q 55 60 70 70" stroke={colors.face} strokeWidth="3" fill="none" />;
    }
    // Sick
    return <circle cx="55" cy="65" r="4" fill={colors.face} />;
  };

  const Bow = () => {
      if (gender !== 'female') return null;
      return (
        <g transform="translate(75, 20) rotate(15)">
            <path d="M0,0 Q-10,-10 -20,0 Q-10,10 0,0" fill="#FF69B4" />
            <path d="M0,0 Q10,-10 20,0 Q10,10 0,0" fill="#FF69B4" />
            <circle cx="0" cy="0" r="3" fill="#FF1493" />
        </g>
      );
  };

  const animationClass = 
    status === MascotStatus.HAPPY ? 'animate-bounce-slow' :
    status === MascotStatus.CONCERNED ? 'animate-pulse-slow' :
    status === MascotStatus.SICK ? 'animate-wiggle' : 
    '';

  return (
    <div className="flex flex-col items-center justify-center py-6" onClick={onClick}>
      <div className={`relative w-40 h-40 transition-all duration-500 ${animationClass}`}>
        <svg viewBox="0 0 110 110" className="w-full h-full drop-shadow-xl filter">
            <defs>
                <linearGradient id="shine" x1="0" x2="1" y1="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.4)"/>
                    <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                </linearGradient>
            </defs>
          
          {/* Pill Shape Body - Bottom Half (Color) */}
          <path d="M 25 55 L 85 55 L 85 80 Q 85 105 55 105 Q 25 105 25 80 Z" fill={colors.body} className="transition-colors duration-500" />
          
          {/* Pill Shape Body - Top Half (Lighter/Cap) */}
          <path d="M 25 55 L 85 55 L 85 30 Q 85 5 55 5 Q 25 5 25 30 Z" fill={colors.cap} className="transition-colors duration-500" />
          
          {/* Shine Effect */}
          <path d="M 30 30 Q 30 10 55 10" stroke="white" strokeWidth="4" fill="none" opacity="0.4" strokeLinecap="round" />

          {/* Face Elements */}
          <Eyes />
          <Mouth />
          <Bow />

           {/* Sweat for Sick */}
           {(status === MascotStatus.SICK || status === MascotStatus.VERY_SICK) && (
             <g>
                <path d="M 88 25 Q 95 35 85 45" stroke="#0dcaf0" strokeWidth="2" fill="none" />
                <circle cx="90" cy="48" r="2" fill="#0dcaf0" />
             </g>
          )}
        </svg>
      </div>

      {message && (
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-md border border-gray-100 dark:border-gray-700 max-w-xs text-center relative bubble-arrow transition-colors">
          <p className="text-gray-800 dark:text-gray-100 font-medium text-lg leading-snug">
            "{message}"
          </p>
        </div>
      )}
    </div>
  );
};

export default Mascot;