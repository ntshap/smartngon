"use client";

import { Bot, Send, X, Sparkles } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface Message {
    id: string;
    text: string;
    sender: "user" | "ai";
    timestamp: Date;
}

export function AIAssistantFAB() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "1",
            text: "Halo! Saya asisten AI Smart Ngangon. Ada yang bisa saya bantu mengenai ternak Anda hari ini?",
            sender: "ai",
            timestamp: new Date(),
        },
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const newUserMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            sender: "user",
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, newUserMessage]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response
        setTimeout(() => {
            const aiResponses = [
                "Berdasarkan data sensor, K-007 terlihat sehat namun sedikit kurang aktif hari ini.",
                "Cuaca hari ini cukup panas (32°C), pastikan suplai air minum tercukupi.",
                "Stok pakan konsentrat Anda diperkirakan habis dalam 3 hari lagi.",
                "Saya telah mencatat laporan tersebut. Ada lagi yang bisa saya bantu?",
            ];
            const randomResponse =
                aiResponses[Math.floor(Math.random() * aiResponses.length)];

            const newAiMessage: Message = {
                id: (Date.now() + 1).toString(),
                text: randomResponse,
                sender: "ai",
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, newAiMessage]);
            setIsTyping(false);
        }, 1500);
    };

    return (
        <>
            {/* FAB Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-2xl transition-all duration-300 hover:scale-110 ${isOpen ? "bg-slate-900 rotate-90" : "bg-emerald-500 hover:bg-emerald-400"
                    }`}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <Bot className="h-7 w-7 text-white" />
                )}
            </button>

            {/* Chat Window */}
            <div
                className={`fixed bottom-24 right-6 z-50 w-[90vw] max-w-[380px] overflow-hidden rounded-3xl border border-white/40 bg-white/90 shadow-2xl backdrop-blur-xl transition-all duration-300 origin-bottom-right ${isOpen
                        ? "scale-100 opacity-100 translate-y-0"
                        : "scale-90 opacity-0 translate-y-10 pointer-events-none"
                    }`}
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                            <Bot className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">Smart Assistant</h3>
                            <div className="flex items-center gap-1.5">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-200 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-white"></span>
                                </span>
                                <span className="text-xs font-medium text-emerald-50">Online</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="h-80 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${msg.sender === "user"
                                        ? "bg-emerald-500 text-white rounded-tr-none"
                                        : "bg-white border border-slate-200 text-slate-700 rounded-tl-none shadow-sm"
                                    }`}
                            >
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="flex items-center gap-1 rounded-2xl bg-white border border-slate-200 px-4 py-3 rounded-tl-none shadow-sm">
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
                                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-3 bg-white border-t border-slate-100">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSendMessage();
                        }}
                        className="relative flex items-center"
                    >
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Tanya sesuatu..."
                            className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-4 pr-12 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                            type="submit"
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-1.5 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white transition-colors hover:bg-emerald-600 disabled:bg-slate-300"
                        >
                            <Send className="h-4 w-4 ml-0.5" />
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
