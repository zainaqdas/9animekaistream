import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { HelpCircle, ChevronDown } from 'lucide-react';

const faqs = [
    {
        question: "What is KaiStream?",
        answer: "KaiStream is a free anime streaming platform that aggregates content from various sources to provide you with the best viewing experience. We offer a wide collection of anime with Sub and Dub options."
    },
    {
        question: "Is KaiStream free to use?",
        answer: "Yes, KaiStream is completely free to use. There are no subscription fees or hidden charges. You can browse, search, and stream anime without any cost."
    },
    {
        question: "Do I need to create an account?",
        answer: "No registration is required. You can start watching anime immediately without creating an account or providing any personal information."
    },
    {
        question: "What does Sub and Dub mean?",
        answer: "Sub refers to subtitled versions where the original Japanese audio is preserved with English (or other language) subtitles. Dub refers to dubbed versions where the dialogue has been re-recorded in English or another language."
    },
    {
        question: "Why are some episodes not loading?",
        answer: "This can happen due to server issues from our content sources. Try refreshing the page, switching to a different server in the video player, or try again later. We're constantly working to ensure the best availability."
    },
    {
        question: "How often is new content added?",
        answer: "New episodes are typically added shortly after they air in Japan. Our system automatically checks for updates and makes them available as soon as possible."
    },
    {
        question: "Can I request an anime to be added?",
        answer: "While we don't have a formal request system, we're always expanding our library. If an anime is available on our source sites, it will eventually appear in our listings. Check back regularly!"
    },
    {
        question: "Is my data safe?",
        answer: "KaiStream does not collect any personal data. We don't use tracking cookies or analytics. Your privacy is important to us."
    }
];

export default function FaqPage() {
    return (
        <main className="min-h-screen">
            <Navbar />

            <div className="max-w-3xl mx-auto px-4 md:px-12 pt-28 pb-12">
                <div className="flex items-center gap-4 mb-12">
                    <div className="p-3 rounded-2xl bg-accent/10 border border-accent/20">
                        <HelpCircle size={28} className="text-accent" />
                    </div>
                    <div>
                        <h1 className="text-3xl md:text-4xl font-black italic tracking-tighter uppercase">FAQ</h1>
                        <p className="text-muted-foreground font-medium mt-1">Frequently asked questions</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, i) => (
                        <details key={i} className="group bg-card/50 rounded-2xl border border-white/5 overflow-hidden transition-all duration-300 open:border-accent/30">
                            <summary className="flex items-center justify-between p-5 md:p-6 cursor-pointer list-none hover:bg-white/5 transition-colors">
                                <span className="font-bold text-sm md:text-base pr-4">{faq.question}</span>
                                <ChevronDown size={18} className="text-accent shrink-0 transition-transform duration-300 group-open:rotate-180" />
                            </summary>
                            <div className="px-5 md:px-6 pb-5 md:pb-6 border-t border-white/5 pt-4">
                                <p className="text-muted-foreground leading-relaxed text-sm">{faq.answer}</p>
                            </div>
                        </details>
                    ))}
                </div>
            </div>

            <Footer />
        </main>
    );
}
