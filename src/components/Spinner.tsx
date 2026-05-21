import React from 'react';

interface SpinnerProps {
    className?: string;
    text?: string;
    fullScreen?: boolean;
}

const Spinner: React.FC<SpinnerProps> = ({ 
    className = "", 
    text = "Summoning Content...", 
    fullScreen = false 
}) => {
    const containerClasses = fullScreen 
        ? "fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background/80 backdrop-blur-md"
        : `flex flex-col items-center justify-center py-12 ${className}`;

    return (
        <div className={containerClasses}>
            <div className="relative">
                {/* Spirit Core Loading Animation */}
                <div className="w-24 h-24 relative flex items-center justify-center">
                    {/* Rotating Energy Rings */}
                    <div className="absolute inset-0 border-4 border-accent/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-transparent border-t-accent rounded-full animate-spin"></div>
                    <div className="absolute inset-2 border-4 border-transparent border-b-accent/50 rounded-full animate-[spin_2s_linear_infinite_reverse]"></div>
                    
                    {/* Glowing Core */}
                    <div className="w-8 h-8 bg-accent rounded-full animate-pulse shadow-[0_0_20px_rgba(16,185,129,0.8)]"></div>
                </div>
                
                {/* Floating Particles */}
                <div className="absolute -top-4 -left-4 w-2 h-2 bg-accent rounded-full animate-bounce"></div>
                <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.5s]"></div>
            </div>
            
            <div className="mt-8 flex flex-col items-center gap-2">
                <h2 className="text-xl font-black italic tracking-tighter uppercase gradient-text animate-pulse">
                    OneeChan
                </h2>
                <p className="text-xs font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse text-center">
                    {text}
                </p>
            </div>
        </div>
    );
};

export default Spinner;
