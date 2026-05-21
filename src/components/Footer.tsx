import React from 'react';
import Link from 'next/link';
import Logo from './Logo';

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-white/5 bg-card/30 backdrop-blur-sm py-12 px-4 md:px-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
                <div className="space-y-4">
                    <Link href="/" className="flex items-center gap-2 group">
                        <Logo size={40} />
                    </Link>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        The ultimate destination for anime fans. Stream your favorite anime in high quality with Sub and Dub on KaiStream.
                    </p>
                </div>
                
                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-accent">Navigation</h4>
                    <ul className="space-y-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                        <li><Link href="/az-list" className="hover:text-accent transition-colors">A-Z List</Link></li>
                        <li><Link href="/ongoing" className="hover:text-accent transition-colors">Ongoing</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-accent">Legal</h4>
                    <ul className="space-y-2 text-sm font-bold text-muted-foreground uppercase tracking-wider">
                        <li><Link href="#" className="hover:text-accent transition-colors">FAQ</Link></li>
                        <li><Link href="#" className="hover:text-accent transition-colors">Contact</Link></li>
                        <li><Link href="#" className="hover:text-accent transition-colors">DMCA</Link></li>
                    </ul>
                </div>

                <div>
                    <h4 className="font-bold mb-4 text-sm uppercase tracking-widest text-accent">Community</h4>
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all cursor-pointer group">
                            <span className="text-xs font-black uppercase italic group-hover:scale-110 transition-transform">X</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all cursor-pointer group">
                            <span className="text-xs font-black uppercase italic group-hover:scale-110 transition-transform">DS</span>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-accent/20 hover:border-accent/50 hover:text-accent transition-all cursor-pointer group">
                            <span className="text-xs font-black uppercase italic group-hover:scale-110 transition-transform">TG</span>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-white/5 text-center text-[10px] uppercase tracking-[0.2em] font-bold text-muted-foreground/50">
                <p>© 2026 KaiStream. Dedicated to the anime community.</p>
                <p className="mt-2 italic font-medium">Disclaimer: KaiStream does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
            </div>
        </footer>
    );
};

export default Footer;
