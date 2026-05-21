import React from 'react';

interface LogoProps {
    className?: string;
    showText?: boolean;
    size?: number;
}

const Logo: React.FC<LogoProps> = ({ className = "", showText = true, size = 40 }) => {
    return (
        <div className={`flex items-center gap-3 ${className}`}>
            {/* Mascot: OneeChan - Anime Girl */} 
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

                {/* Hair - Back Layer */}
                <path 
                    d="M35 20C30 15 25 18 25 30C25 28 20 32 22 40C24 48 28 50 30 52C30 55 33 58 36 58C38 58 38 55 38 52C38 48 35 45 35 40C35 35 38 30 38 25C38 22 37 21 35 20Z" 
                    fill="#2d1b0e" 
                />
                <path 
                    d="M65 20C70 15 75 18 75 30C75 28 80 32 78 40C76 48 72 50 70 52C70 55 67 58 64 58C62 58 62 55 62 52C62 48 65 45 65 40C65 35 62 30 62 25C62 22 63 21 65 20Z" 
                    fill="#2d1b0e" 
                />

                {/* Face */}
                <ellipse cx="50" cy="45" rx="18" ry="20" fill="#fce4d6" />

                {/* Hair - Bangs */}
                <path d="M32 38C32 28 38 22 50 22C62 22 68 28 68 38C68 32 62 26 50 26C38 26 32 32 32 38Z" fill="#3d2b1f" />
                <path d="M34 40C34 30 40 25 50 25C60 25 66 30 66 40C66 33 60 28 50 28C40 28 34 33 34 40Z" fill="#4a3728" />
                <path d="M36 40C36 34 42 30 50 30C58 30 64 34 64 40C64 36 58 32 50 32C42 32 36 36 36 40Z" fill="#5c4432" />

                {/* Eyes */}
                {/* Left Eye */}
                <ellipse cx="42" cy="43" rx="6" ry="7" fill="white" />
                <ellipse cx="42" cy="43" rx="4.5" ry="5.5" fill="#8B4513" />
                <ellipse cx="42" cy="43" rx="3" ry="4" fill="#2d1b0e" />
                <ellipse cx="40" cy="40.5" rx="1.5" ry="1.5" fill="white" />
                <ellipse cx="44" cy="45" rx="0.8" ry="0.8" fill="white" opacity="0.6" />
                {/* Right Eye */}
                <ellipse cx="58" cy="43" rx="6" ry="7" fill="white" />
                <ellipse cx="58" cy="43" rx="4.5" ry="5.5" fill="#8B4513" />
                <ellipse cx="58" cy="43" rx="3" ry="4" fill="#2d1b0e" />
                <ellipse cx="56" cy="40.5" rx="1.5" ry="1.5" fill="white" />
                <ellipse cx="60" cy="45" rx="0.8" ry="0.8" fill="white" opacity="0.6" />

                {/* Eyelashes */}
                <path d="M36 38L38 40" stroke="#2d1b0e" strokeWidth="1" strokeLinecap="round" />
                <path d="M64 38L62 40" stroke="#2d1b0e" strokeWidth="1" strokeLinecap="round" />

                {/* Rosy Cheeks */}
                <ellipse cx="36" cy="49" rx="4" ry="2.5" fill="#ffb5c5" opacity="0.5" />
                <ellipse cx="64" cy="49" rx="4" ry="2.5" fill="#ffb5c5" opacity="0.5" />

                {/* Mouth - Cute Smile */}
                <path d="M47 51C48 53 52 53 53 51" stroke="#c44" strokeWidth="1.2" strokeLinecap="round" fill="none" />
                <ellipse cx="50" cy="52" rx="1.5" ry="0.8" fill="#e87777" opacity="0.6" />

                {/* Hair - Side Locks */}
                <path d="M33 40C31 45 30 52 32 56C34 60 36 58 35 52C34 48 35 44 35 42Z" fill="#3d2b1f" />
                <path d="M67 40C69 45 70 52 68 56C66 60 64 58 65 52C66 48 65 44 65 42Z" fill="#3d2b1f" />

                {/* Hair Ribbon - On left side */}
                <g transform="translate(28, 30)">
                    <path d="M0 5C-3 0 -8 2 -6 8C-4 12 0 10 0 5Z" fill="#ff6b9d" />
                    <path d="M0 5C3 0 8 2 6 8C4 12 0 10 0 5Z" fill="#ff4d8a" />
                    <circle cx="0" cy="5" r="2" fill="#ff8cb3" />
                </g>

                {/* Sparkle Effects */}
                <g fill="#10b981" opacity="0.8">
                    <path d="M28 18L30 20L28 22L26 20Z" className="animate-bounce" style={{animationDelay: '0s'}} />
                    <path d="M72 18L74 20L72 22L70 20Z" className="animate-bounce" style={{animationDelay: '0.3s'}} />
                </g>
            </svg>

            {showText && (
                <svg width="200" height="35" viewBox="0 0 200 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    {/* OneeChan Typography */}
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
                        <tspan fill="#10b981">ONEE</tspan>
                        <tspan fill="white">CHAN</tspan>
                    </text>
                </svg>
            )}
        </div>
    );
};

export default Logo;
