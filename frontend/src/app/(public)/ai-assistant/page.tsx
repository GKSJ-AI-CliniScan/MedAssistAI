"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Send, Sparkles, MessageSquare, Bot, User, Mic, Paperclip, RotateCcw, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const suggestedPrompts = [
  { icon: "🩺", text: "Analyze my symptoms", desc: "Describe your symptoms for AI analysis" },
  { icon: "💊", text: "Drug interactions", desc: "Check potential medication conflicts" },
  { icon: "📋", text: "Health report", desc: "Generate a comprehensive health report" },
  { icon: "🧬", text: "Disease prediction", desc: "AI-powered disease risk assessment" },
];

const sampleMessages = [
  { role: "bot", content: "Hello! I'm MedAssist AI, your intelligent healthcare companion. I can help you analyze symptoms, check drug interactions, generate health reports, and much more. How can I assist you today?" },
];

export default function ChatPage() {
  const [messages] = useState(sampleMessages);
  const [input, setInput] = useState("");

  return (
    <section className="relative min-h-[calc(100vh-4.5rem)] bg-gradient-to-b from-background via-background to-muted/20 overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-6xl px-4 md:px-8 py-8 flex flex-col h-[calc(100vh-4.5rem)]">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/30 rounded-xl blur-md animate-pulse"></div>
              <div className="relative h-11 w-11 rounded-xl bg-gradient-to-br from-primary to-blue-700 flex items-center justify-center shadow-lg">
                <Brain className="h-6 w-6 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold">AI Assistant</h1>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs text-muted-foreground">Online • Ready to help</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              New Chat
            </Button>
          </div>
        </motion.div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 mb-4 space-y-6">
          {/* Messages */}
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex gap-3 ${msg.role === "bot" ? "" : "flex-row-reverse"}`}
            >
              <div className={`shrink-0 h-9 w-9 rounded-xl flex items-center justify-center ${
                msg.role === "bot" 
                  ? "bg-gradient-to-br from-primary to-blue-700 text-white shadow-md" 
                  : "bg-muted text-foreground"
              }`}>
                {msg.role === "bot" ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
              </div>
              <div className={`max-w-[75%] p-4 rounded-2xl text-sm leading-relaxed ${
                msg.role === "bot"
                  ? "bg-muted/50 border border-border/50 text-foreground"
                  : "bg-primary text-primary-foreground"
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}

          {/* Suggested Prompts */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pt-4"
          >
            <p className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Suggested Prompts</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {suggestedPrompts.map((prompt, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-start gap-3 p-4 rounded-xl border border-border/50 bg-background/50 hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                >
                  <span className="text-2xl">{prompt.icon}</span>
                  <div>
                    <p className="text-sm font-semibold group-hover:text-primary transition-colors">{prompt.text}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{prompt.desc}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Input Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <div className="flex items-center gap-2 p-2 rounded-2xl border border-border/50 bg-card/80 backdrop-blur-sm shadow-lg">
            <button className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Paperclip className="h-5 w-5" />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Describe your symptoms or ask a health question..."
              className="flex-1 bg-transparent text-sm placeholder:text-muted-foreground/60 focus:outline-none py-3 px-2"
            />
            <button className="shrink-0 h-10 w-10 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all">
              <Mic className="h-5 w-5" />
            </button>
            <Button className="shrink-0 h-10 w-10 rounded-xl bg-primary hover:bg-primary/90 shadow-md transition-all hover:scale-105 active:scale-95 p-0">
              <Send className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center justify-center gap-1.5 mt-3">
            <Shield className="h-3 w-3 text-muted-foreground/50" />
            <p className="text-[10px] text-muted-foreground/50">Your conversations are private and encrypted. MedAssist AI is not a substitute for professional medical advice.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
