"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
  {
    question: "How accurate is the AI prediction?",
    answer: "Our AI models have been trained on millions of verified medical records and achieve a 98% accuracy rate in preliminary diagnostics. However, MedAssist AI is a screening tool and should not replace a professional medical diagnosis.",
  },
  {
    question: "Is my medical data secure?",
    answer: "Absolutely. We employ bank-level encryption, are fully HIPAA compliant, and never share your personal medical history with third parties without your explicit consent.",
  },
  {
    question: "Can I share the generated reports with my doctor?",
    answer: "Yes, our reports are generated in a standardized medical format (PDF) specifically designed to be easily read and integrated into your doctor's EHR system.",
  },
  {
    question: "How does the symptom checker work?",
    answer: "You input your symptoms, their severity, duration, and any relevant medical history. Our AI cross-references this with a vast medical knowledge base to suggest potential conditions ranked by probability.",
  },
  {
    question: "Is MedAssist AI free to use?",
    answer: "We offer a free basic tier for occasional symptom checking. Our premium tier offers unlimited predictions, detailed health reports, and personalized lifestyle recommendations.",
  }
];

export function FaqSection() {
  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 md:px-8 max-w-4xl">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Frequently Asked Questions</h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to know about MedAssist AI and how it works.
          </p>
        </div>

        <Accordion className="w-full space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`} className="bg-card border border-border/50 rounded-2xl px-6 py-2 shadow-sm data-[state=open]:shadow-md transition-all">
                <AccordionTrigger className="text-left text-lg font-semibold hover:no-underline hover:text-primary transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed pb-6">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
