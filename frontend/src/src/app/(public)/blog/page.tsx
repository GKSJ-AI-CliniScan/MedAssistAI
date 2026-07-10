"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight, Calendar, User } from "lucide-react";
import Link from "next/link";

const POSTS = [
  {
    id: 1,
    title: "How Deep Learning is Changing Diagnostic Medicine",
    excerpt: "Explore the latest breakthroughs in convolutional neural networks and how they are outperforming traditional diagnostic methods.",
    date: "July 2, 2026",
    category: "AI Research",
    author: "Dr. Sarah Chen",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 2,
    title: "The Importance of Explainable AI in Healthcare",
    excerpt: "Why the 'black box' problem is unacceptable in medicine, and how MedAssist AI builds transparency into every prediction.",
    date: "June 28, 2026",
    category: "Ethics & Safety",
    author: "Dr. James Wilson",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  },
  {
    id: 3,
    title: "Announcing our new Symptom Checker API v2.0",
    excerpt: "We're opening up our core reasoning engine to developers and hospitals. Learn what's new in version 2.0.",
    date: "June 15, 2026",
    category: "Product Updates",
    author: "Product Team",
    image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
  }
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" } }),
};

export default function BlogPage() {
  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground pb-20">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute top-0 right-1/3 h-[400px] w-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
      </div>

      <section className="relative pt-8 pb-8 text-center lg:pt-12 lg:pb-12 border-b border-white/[0.04]">
        <motion.div initial="hidden" animate="visible" className="mx-auto max-w-4xl px-6">
          <motion.div variants={fadeUp} custom={0} className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400">
            <BookOpen className="h-4 w-4" /> Company Blog
          </motion.div>
          <motion.h1 variants={fadeUp} custom={1} className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl lg:text-6xl mb-4">
            Insights & Updates
          </motion.h1>
          <motion.p variants={fadeUp} custom={2} className="mx-auto max-w-2xl text-base leading-relaxed text-neutral-400">
            Read about the latest developments in medical AI, company news, and engineering deep-dives from the MedAssist AI team.
          </motion.p>
        </motion.div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp} custom={3} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {POSTS.map((post, i) => (
            <motion.div 
              key={post.id} 
              variants={fadeUp} 
              custom={i + 4}
              className="flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:shadow-[0_0_30px_-10px_rgba(59,130,246,0.15)] hover:border-white/[0.12] transition-all duration-300 group"
            >
              <div className="h-48 w-full relative overflow-hidden bg-black/50">
                <img 
                  src={post.image} 
                  alt={post.title} 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                <div className="absolute top-4 left-4">
                  <span className="text-white backdrop-blur-md bg-black/40 px-3 py-1 rounded-full border border-white/10 text-xs font-semibold tracking-wide shadow-sm">
                    {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 text-xs font-medium text-neutral-500 mb-3">
                  <Calendar className="h-3.5 w-3.5"/> {post.date}
                </div>
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-blue-400 transition-colors leading-tight">
                  {post.title}
                </h3>
                <p className="text-neutral-400 text-sm mb-6 flex-1 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2 text-xs font-medium text-neutral-400">
                    <div className="h-6 w-6 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                      <User className="h-3 w-3 text-neutral-300" />
                    </div>
                    {post.author}
                  </div>
                  <Link href={`/blog/${post.id}`} className="text-sm font-semibold text-white flex items-center gap-1 hover:text-blue-400 transition-all">
                    Read <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </main>
  );
}
