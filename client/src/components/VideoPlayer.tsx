'use client';

import React, { useState } from 'react';
import { StreamServer } from '@/lib/scraper';
import { Layers, Server } from 'lucide-react';

interface VideoPlayerProps {
    initialStreams: StreamServer[];
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ initialStreams }) => {
    const [currentServer, setCurrentServer] = useState(initialStreams[0]);

    return (
        <div className="space-y-6">
            {/* Player Container */}
            <div className="relative aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/5 group">
                <iframe
                    src={currentServer?.link}
                    className="w-full h-full"
                    allowFullScreen
                    frameBorder="0"
                />
                
                {/* Overlay shadow */}
                <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
            </div>

            {/* Server Selection */}
            <div className="bg-card/50 backdrop-blur-md rounded-2xl p-6 border border-white/5 space-y-4">
                <div className="flex items-center gap-3 text-accent mb-2">
                    <Layers size={18} />
                    <h3 className="font-bold tracking-wider uppercase text-sm">Streaming Servers</h3>
                </div>
                
                <div className="flex flex-wrap gap-3">
                    {initialStreams.map((stream) => (
                        <button
                            key={stream.server + stream.link}
                            onClick={() => setCurrentServer(stream)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                                currentServer?.server === stream.server
                                    ? 'bg-accent border-accent text-white shadow-lg shadow-accent/20 scale-105'
                                    : 'bg-white/5 border-white/10 text-muted-foreground hover:bg-white/10 hover:border-white/20'
                            }`}
                        >
                            <Server size={14} />
                            {stream.server}
                        </button>
                    ))}
                </div>
                
                <p className="text-[10px] text-muted-foreground italic">
                    If the current server doesn&apos;t work, please try switching to another mirror.
                </p>
            </div>
        </div>
    );
};

export default VideoPlayer;
