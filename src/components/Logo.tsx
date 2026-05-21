import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, size = 40 }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Mascot: Spirit Core / Dragon Soul */}
            <svg 
                width={size} 
                height={size} 
                viewBox="0 0 100 100" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-[0_0_10px_rgba(16,185,129,0.6)]"
            >
                {/* Outer Energy Ring */}
                <circle 
                    cx="50" cy="50" r="45" 
                    stroke="#10b981" 
                    strokeWidth="2" 
                    strokeDasharray="10 5"
                    className="animate-[spin_10s_linear_infinite]"
                />
                
                {/* Stylized Horns/Wings - Anime Vibe */}
                <path 
                    d="M30 30C15 10 5 40 25 50" 
                    stroke="#065f46" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                />
                <path 
                    d="M70 30C85 10 95 40 75 50" 
                    stroke="#065f46" 
                    strokeWidth="6" 
                    strokeLinecap="round" 
                />

                {/* The Core (Spirit Orb) */}
                <circle cx="50" cy="50" r="22" fill="#10b981" />
                <circle cx="50" cy="50" r="15" fill="#34d399" />
                <circle cx="45" cy="45" r="5" fill="white" opacity="0.8" />
                
                {/* "Kai" Kanji-inspired Symbol in Core */}
                <path 
                    d="M42 50H58M50 42V58M45 45L55 55M55 45L45 55" 
                    stroke="#064e3b" 
                    strokeWidth="2.5" 
                    strokeLinecap="round" 
                />

                {/* Floating Particles */}
                <circle cx="20" cy="20" r="2" fill="#10b981" className="animate-bounce" />
                <circle cx="80" cy="80" r="2" fill="#10b981" className="animate-bounce [animation-delay:0.5s]" />
            </svg>

            {showText && (
                <svg width="180" height="35" viewBox="0 0 180 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* Unified Stylized Typography */}
                    <text 
                        x="0" 
                        y="26" 
                        style={{ 
                            fontFamily: 'system-ui, -apple-system, sans-serif', 
                            fontWeight: 900, 
                            fontSize: '26px',
                            letterSpacing: '-0.5px',
                            fontStyle: 'italic',
                            textTransform: 'uppercase'
                        }}
                    >
                        <tspan fill="#10b981">KAI</tspan>
                        <tspan fill="white">STREAM</tspan>
                    </text>
                </svg>
            )}
        </div>
    );
};

export default Logo;
