import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Clock, ArrowRight } from 'lucide-react';

export default function ContactPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-4xl mx-auto px-4 md:px-12 pt-28 pb-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                        <Mail size={28} className="text-accent" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">Contact</h1>
                        <p className="text-muted-foreground font-medium mt-1">Get in touch with us</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-card/50 rounded-2xl p-6 border border-white/5 space-y-3">
                        <div className="p-3 w-fit rounded-xl bg-accent/10">
                            <Mail size={20} className="text-accent" />
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-sm">Email</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">contact@kaistream.com</p>
                    </div>
                    <div className="bg-card/50 rounded-2xl p-6 border border-white/5 space-y-3">
                        <div className="p-3 w-fit rounded-xl bg-accent/10">
                            <MessageSquare size={20} className="text-accent" />
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-sm">Social</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">Reach us on X, Discord, or Telegram</p>
                    </div>
                    <div className="bg-card/50 rounded-2xl p-6 border border-white/5 space-y-3">
                        <div className="p-3 w-fit rounded-xl bg-accent/10">
                            <Clock size={20} className="text-accent" />
                        </div>
                        <h3 className="font-bold uppercase tracking-wider text-sm">Response Time</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">Usually within 24-48 hours</p>
                    </div>
                </div>

                <div className="bg-card/50 rounded-3xl p-6 md:p-10 border border-white/5">
                    <h2 className="text-2xl font-bold mb-8 uppercase italic tracking-tight">Send a Message</h2>
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Name</label>
                                <input type="text" placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Email</label>
                                <input type="email" placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/30" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Subject</label>
                            <input type="text" placeholder="What's this about?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/30" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Message</label>
                            <textarea rows={6} placeholder="Write your message here..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-accent/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground/30 resize-none" />
                        </div>
                        <button type="button" className="bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 transition-all hover:scale-105 shadow-xl shadow-accent/20">
                            SEND MESSAGE
                            <ArrowRight size={18} />
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </main>
    );
}
