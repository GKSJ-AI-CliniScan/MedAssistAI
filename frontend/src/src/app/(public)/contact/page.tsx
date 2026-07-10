"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  MessageSquare,
  Clock,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: "easeOut" },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.12, duration: 0.5, ease: "easeOut" },
  }),
};

const contactInfo = [
  {
    icon: Mail,
    label: "Email Us",
    value: "support@medassist.ai",
    description: "Drop us a line anytime",
    color: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-500/10",
  },
  {
    icon: Phone,
    label: "Call Us",
    value: "+1 (555) 123-4567",
    description: "Mon – Fri, 9 AM – 6 PM PT",
    color: "from-emerald-500 to-teal-400",
    bgGlow: "bg-emerald-500/10",
  },
  {
    icon: MapPin,
    label: "Visit Us",
    value: "San Francisco, CA",
    description: "123 Health Street, Suite 400",
    color: "from-violet-500 to-purple-400",
    bgGlow: "bg-violet-500/10",
  },
];

const supportOptions = [
  {
    icon: MessageSquare,
    title: "Live Chat",
    subtitle: "24/7 Availability",
    description:
      "Get instant answers from our AI-powered assistant or connect with a live specialist around the clock.",
    color: "from-blue-500 to-indigo-500",
    badge: "Online Now",
    badgeColor: "bg-emerald-500/20 text-emerald-400",
  },
  {
    icon: Mail,
    title: "Email Support",
    subtitle: "< 2hr Response",
    description:
      "Send detailed inquiries and our dedicated team will respond with comprehensive solutions within two hours.",
    color: "from-cyan-500 to-blue-500",
    badge: "Priority",
    badgeColor: "bg-blue-500/20 text-blue-400",
  },
  {
    icon: Phone,
    title: "Phone Support",
    subtitle: "Business Hours",
    description:
      "Speak directly with our healthcare technology experts for urgent matters during business hours.",
    color: "from-violet-500 to-purple-500",
    badge: "Mon – Fri",
    badgeColor: "bg-violet-500/20 text-violet-400",
  },
];

const subjectOptions = [
  "General Inquiry",
  "Technical Support",
  "Partnership Opportunities",
  "Billing & Pricing",
  "Feature Request",
  "Bug Report",
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      
      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitted(false), 4000);
      }
    } catch (error) {
      console.error("Failed to submit contact form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden dark:bg-background dark:text-foreground">
      {/* ── Ambient Background Glows ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/4 h-[500px] w-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-1/3 right-0 h-[400px] w-[400px] rounded-full bg-violet-600/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-cyan-600/8 blur-[120px]" />
      </div>

      {/* ══════════════════════════════════════════════════════════
          HERO BANNER
         ══════════════════════════════════════════════════════════ */}
      <section className="relative pt-8 pb-12 text-center lg:pt-12 lg:pb-16">
        {/* decorative grid */}
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.15) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        <motion.div
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-3xl px-6"
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-sm font-medium text-blue-400"
          >
            <Mail className="size-4" />
            We&apos;d Love to Hear From You
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="bg-gradient-to-b from-white to-white/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent sm:text-6xl lg:text-7xl"
          >
            Get in Touch
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-neutral-400"
          >
            Have a question about MedAssist AI, need technical support, or want
            to explore partnership opportunities? Our team is here to help.
          </motion.p>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          CONTACT FORM  +  INFO CARDS  (Two-Column)
         ══════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-7xl px-6 pb-12">
        <div className="grid gap-12 lg:grid-cols-5">
          {/* ── Left: Glassmorphism Contact Form (3 cols) ────── */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={fadeUp}
            custom={0}
            className="lg:col-span-3"
          >
            <div className="relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-8 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-10">
              {/* subtle inner glow */}
              <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/[0.05]" />

              <h2 className="mb-1 text-2xl font-bold text-white">
                Send Us a Message
              </h2>
              <p className="mb-8 text-sm text-neutral-400">
                Fill out the form below and we&apos;ll get back to you as soon
                as possible.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name + Email row */}
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-medium text-neutral-300"
                    >
                      Full Name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-medium text-neutral-300"
                    >
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      className="w-full rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>

                {/* Subject dropdown */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full appearance-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 [&>option]:bg-neutral-900 [&>option]:text-white"
                  >
                    <option value="" disabled>
                      Select a subject…
                    </option>
                    {subjectOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Message textarea */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-medium text-neutral-300"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help…"
                    className="w-full resize-none rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-3 text-sm text-white placeholder-neutral-500 outline-none transition-all focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
                  />
                </div>

                {/* Submit button */}
                <div className="flex items-center gap-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative h-11 gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:brightness-110 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        Sending…
                      </span>
                    ) : (
                      <>
                        <Send className="size-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  {submitted && (
                    <motion.span
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium text-emerald-400"
                    >
                      ✓ Message sent successfully!
                    </motion.span>
                  )}
                </div>
              </form>
            </div>
          </motion.div>

          {/* ── Right: Contact Info Cards (2 cols) ───────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {contactInfo.map((item, i) => (
              <motion.div
                key={item.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={scaleIn}
                custom={i}
                className="group relative rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 backdrop-blur-lg transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.05]"
              >
                {/* hover glow */}
                <div
                  className={`pointer-events-none absolute inset-0 rounded-2xl ${item.bgGlow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="relative flex items-start gap-4">
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${item.color} shadow-lg`}
                  >
                    <item.icon className="size-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-neutral-300">
                      {item.label}
                    </h3>
                    <p className="mt-0.5 text-base font-bold text-white">
                      {item.value}
                    </p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {item.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Extra CTA card */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-40px" }}
              variants={scaleIn}
              custom={3}
              className="relative overflow-hidden rounded-2xl border border-blue-500/20 bg-gradient-to-br from-blue-600/10 to-indigo-600/10 p-6 backdrop-blur-lg"
            >
              <div className="pointer-events-none absolute -right-6 -bottom-6 size-32 rounded-full bg-blue-500/10 blur-2xl" />
              <Clock className="mb-3 size-8 text-blue-400" />
              <h3 className="text-lg font-bold text-white">
                Response Times
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-400">
                Our average first-response time is under{" "}
                <span className="font-semibold text-blue-400">30 minutes</span>{" "}
                during business hours. We aim to resolve all inquiries within 24
                hours.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          SUPPORT OPTIONS — 3 Cards
         ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.04] py-12">
        <div className="mx-auto max-w-7xl px-6">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            className="mb-14 text-center"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl font-extrabold text-white sm:text-4xl"
            >
              Choose Your Support Channel
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="mx-auto mt-4 max-w-lg text-neutral-400"
            >
              We offer multiple ways to get the help you need — choose the
              option that works best for you.
            </motion.p>
          </motion.div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {supportOptions.map((opt, i) => (
              <motion.div
                key={opt.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeUp}
                custom={i}
                className="group relative flex flex-col rounded-2xl border border-white/[0.06] bg-white/[0.02] p-8 backdrop-blur-md transition-all duration-300 hover:border-white/[0.12] hover:bg-white/[0.04]"
              >
                {/* top gradient bar */}
                <div
                  className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${opt.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
                />

                <div className="mb-5 flex items-center justify-between">
                  <div
                    className={`flex size-12 items-center justify-center rounded-xl bg-gradient-to-br ${opt.color} shadow-lg`}
                  >
                    <opt.icon className="size-5 text-white" />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${opt.badgeColor}`}
                  >
                    {opt.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white">{opt.title}</h3>
                <p className="mt-1 text-sm font-medium text-blue-400">
                  {opt.subtitle}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-400">
                  {opt.description}
                </p>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    className="w-full justify-center rounded-xl border-white/[0.08] bg-white/[0.03] text-sm font-medium text-neutral-300 transition-all hover:border-white/[0.15] hover:bg-white/[0.06] hover:text-white"
                  >
                    Get Started →
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM CTA BANNER
         ══════════════════════════════════════════════════════════ */}
      <section className="border-t border-white/[0.04] py-12">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          custom={0}
          className="mx-auto max-w-3xl px-6 text-center"
        >
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Can&apos;t Find What You Need?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-neutral-400">
            Browse our comprehensive knowledge base or schedule a personalized
            demo with our team.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Button className="h-11 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-all hover:shadow-xl hover:shadow-blue-600/30 hover:brightness-110">
              Schedule a Demo
            </Button>
            <Button
              variant="outline"
              className="h-11 rounded-xl border-white/[0.1] bg-white/[0.03] px-6 text-sm font-medium text-neutral-300 hover:border-white/[0.2] hover:bg-white/[0.06] hover:text-white"
            >
              Visit Help Center
            </Button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
