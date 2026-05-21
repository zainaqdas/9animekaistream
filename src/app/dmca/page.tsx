import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, Shield, FileText } from 'lucide-react';

export default function DmcaPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 md:px-12 pt-28 pb-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                        <Scale size={28} className="text-accent" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">DMCA</h1>
                        <p className="text-muted-foreground font-medium mt-1">Copyright infringement notice</p>
                    </div>
                </div>

                <div className="space-y-8">
                    <section className="bg-card/50 rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-accent" />
                            <h2 className="text-lg font-bold uppercase tracking-wider">Policy</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            OneeChan respects the intellectual property rights of others. We comply with the Digital Millennium Copyright Act (DMCA) and respond to valid notices of alleged copyright infringement.
                        </p>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Please note that OneeChan does not host any files on its servers. All content is embedded from third-party sources. If you believe your copyrighted work has been made available through our service without authorization, please submit a DMCA notice.
                        </p>
                    </section>

                    <section className="bg-card/50 rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <Shield size={20} className="text-accent" />
                            <h2 className="text-lg font-bold uppercase tracking-wider">How to File a Notice</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            To file a DMCA notice, please provide the following information in writing:
                        </p>
                        <ol className="list-decimal list-inside space-y-2 text-muted-foreground text-sm leading-relaxed">
                            <li>Your physical or electronic signature</li>
                            <li>Identification of the copyrighted work claimed to be infringed</li>
                            <li>Identification of the material that is claimed to be infringing</li>
                            <li>Your contact information (address, phone number, and email)</li>
                            <li>A statement that you have a good faith belief that the use is not authorized</li>
                            <li>A statement that the information in the notice is accurate</li>
                        </ol>
                    </section>

                    <section className="bg-card/50 rounded-2xl p-6 md:p-8 border border-white/5 space-y-4">
                        <div className="flex items-center gap-3">
                            <FileText size={20} className="text-accent" />
                            <h2 className="text-lg font-bold uppercase tracking-wider">Contact Information</h2>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            Send DMCA notices to:
                        </p>
                        <div className="bg-black/20 rounded-xl p-4 font-mono text-sm">
                            <p>Email: dmca@oneechan.app</p>
                        </div>
                        <p className="text-muted-foreground leading-relaxed text-sm">
                            We will review and respond to all valid DMCA notices promptly. Please allow up to 48 hours for a response.
                        </p>
                    </section>
                </div>
            </div>

            <Footer />
        </main>
    );
}
