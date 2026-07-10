"use client";

import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Dr. Sarah Jenkins",
    role: "Chief of Cardiology",
    hospital: "Mount Sinai Hospital",
    image: "https://i.pravatar.cc/150?u=sarah",
    content: "Honestly, I was skeptical at first. But MedAssist has completely changed how our clinic handles triage. It catches things we might have missed in a rushed 15-minute consult and gives my team a huge head start before the patient even walks in the door.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Patient",
    hospital: "Used for personal health tracking",
    image: "https://i.pravatar.cc/150?u=michael",
    content: "I had this weird lingering pain for months that my GP kept dismissing as stress. I plugged my symptoms into MedAssist, and it suggested I ask for a specific blood test. Turned out I had a thyroid issue! It literally gave me the vocabulary to advocate for myself.",
    rating: 5,
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "General Practitioner",
    hospital: "City Health Clinic",
    image: "https://i.pravatar.cc/150?u=emily",
    content: "It's like having a brilliant resident looking over your shoulder. When I'm dealing with a complex case, I run the labs through the AI just to make sure I haven't overlooked any obscure differentials. It's incredibly reassuring.",
    rating: 5,
  }
];

export function TestimonialsSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Trusted by Professionals & Patients</h2>
          <p className="text-lg text-muted-foreground">
            Don&apos;t just take our word for it. See how MedAssist AI is making a difference in real lives.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-card border border-border/50 p-8 rounded-3xl shadow-sm hover:shadow-lg transition-shadow duration-300 relative"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-warning text-warning" />
                ))}
              </div>
              
              <p className="text-foreground text-lg leading-relaxed mb-8 italic">
                &quot;{testimonial.content}&quot;
              </p>
              
              <div className="flex items-center gap-4 mt-auto">
                <Avatar className="h-12 w-12 border-2 border-primary/20">
                  <AvatarImage src={testimonial.image} alt={testimonial.name} />
                  <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  <p className="text-xs text-primary/80 font-medium">{testimonial.hospital}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
