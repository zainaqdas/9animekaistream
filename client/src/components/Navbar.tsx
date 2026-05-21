'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Logo from './Logo';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 glass h-16 px-4 md:px-12 flex items-center justify-between">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2 group">
                    <Logo size={32} />
                </Link>
            </div>

            <div className="flex items-center gap-4 flex-1 justify-end max-w-md">
                <form onSubmit={handleSearch} className="relative w-full group hidden sm:block">
                    <input
                        type="text"
                        placeholder="Search anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all group-hover:bg-white/10"
                    />
                    <Search className="absolute left-3 top-2.5 text-muted-foreground group-focus-within:text-accent transition-colors" size={18} />
                </form>
            </div>
        </nav>
    );
};

export default Navbar;
