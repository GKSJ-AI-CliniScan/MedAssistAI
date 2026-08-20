"use client";

import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, Image as ImageIcon, BrainCircuit, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Hello John! I'm your MedAssist AI. I can help you analyze symptoms, explain medical reports, or provide general health advice. How can I assist you today?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", content: input }]);
    setInput("");
    setIsTyping(true);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: "assistant", 
        content: "Based on the latest medical guidelines, maintaining a balanced diet and regular exercise can significantly improve your overall well-being. For specific symptoms, I recommend using our Symptom Checker." 
      }]);
      setIsTyping(false);
    }, 2000);
  };

  const suggestions = [
    "Explain my latest health report",
    "What are the side effects of ibuprofen?",
    "How can I lower my blood pressure?",
    "Check symptoms for migraine"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] max-w-4xl mx-auto glass-card rounded-3xl overflow-hidden">
      
      {/* Chat Header */}
      <div className="h-16 border-b border-border/50 bg-muted/20 flex items-center px-6 gap-3 shrink-0">
        <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
          <BrainCircuit className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-bold">MedAssist AI Assistant</h2>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" /> Online
          </p>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {msg.role === 'assistant' && (
              <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
                <BrainCircuit className="h-4 w-4" />
              </div>
            )}
            
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-primary text-primary-foreground rounded-tr-sm' 
                : 'bg-muted/50 border border-border/50 text-foreground rounded-tl-sm'
            }`}>
              <p className="leading-relaxed text-sm md:text-base">{msg.content}</p>
            </div>

            {msg.role === 'user' && (
              <div className="h-8 w-8 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground shrink-0 mt-1">
                <User className="h-4 w-4" />
              </div>
            )}
            
          </div>
        ))}
        
        {isTyping && (
          <div className="flex gap-4 justify-start">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0 mt-1">
              <BrainCircuit className="h-4 w-4" />
            </div>
            <div className="bg-muted/50 border border-border/50 rounded-2xl rounded-tl-sm p-4 flex gap-1 items-center h-[52px]">
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-2 h-2 bg-primary rounded-full animate-bounce"></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-background border-t border-border/50 shrink-0">
        
        {/* Suggested Questions */}
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {suggestions.map((text, i) => (
              <button key={i} onClick={() => setInput(text)} className="text-xs font-medium px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-muted-foreground transition-colors border border-border/50">
                {text}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2 bg-muted/30 p-2 rounded-3xl border border-border/50 focus-within:border-primary/50 transition-colors">
          <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-foreground">
            <ImageIcon className="h-5 w-5" />
          </Button>
          
          <TextareaAutosize
            value={input}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Ask anything about your health..."
            className="flex-1 max-h-32 bg-transparent border-0 focus-visible:ring-0 resize-none py-3 min-h-[44px] text-sm md:text-base placeholder:text-muted-foreground"
          />
          
          <Button variant="ghost" size="icon" className="rounded-full shrink-0 text-muted-foreground hover:text-foreground">
            <Mic className="h-5 w-5" />
          </Button>
          
          <Button onClick={handleSend} disabled={!input.trim()} size="icon" className="rounded-full shrink-0 h-11 w-11 shadow-sm">
            <Send className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3 font-medium">
          MedAssist AI can make mistakes. Consider verifying important medical information.
        </p>
      </div>
    </div>
  );
}

// Simple internal component for expanding textarea
function TextareaAutosize({ value, onChange, onKeyDown, placeholder, className }: any) {
  const ref = useRef<HTMLTextAreaElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = "auto";
      ref.current.style.height = `${Math.min(ref.current.scrollHeight, 128)}px`;
    }
  }, [value]);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={className}
      rows={1}
    />
  );
}
