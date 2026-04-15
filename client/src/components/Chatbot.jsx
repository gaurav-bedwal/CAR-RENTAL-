import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

const Chatbot = () => {
    const { axios } = useAppContext();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Hi! I am Luxie, your RentLux concierge. How can I help you today?' }
    ]);
    const [inputText, setInputText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    
    const scrollRef = useRef(null);

    useEffect(() => {
        console.log("Luxie Assistant Mounted - Tracking Visibility");
    }, []);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;

        const userMessage = { role: 'user', text: inputText };
        setMessages(prev => [...prev, userMessage]);
        setInputText('');
        setIsTyping(true);

        try {
            const { data } = await axios.post('/api/user/chat', { message: inputText });
            if (data.success) {
                setMessages(prev => [...prev, { role: 'bot', text: data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'bot', text: "I'm having a small technical glitch. Can you try that again?" }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'bot', text: "I'm offline for a moment. Please check your connection!" }]);
        } finally {
            setIsTyping(false);
        }
    };

    const quickActions = [
        { label: "Book 6 Hours", query: "Can I book for 6 hours?" },
        { label: "360° View", query: "Tell me about the 360 degree view feature" },
        { label: "Price List", query: "What are your rental prices?" }
    ];

    return (
        <div style={{ position: 'fixed', bottom: '32px', right: '32px', zIndex: 99999 }}>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="absolute bottom-20 right-0 w-[90vw] md:w-[400px] h-[500px] bg-[#0d0d0d] border border-white/10 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col backdrop-blur-xl"
                    >
                        {/* Header */}
                        <div className="p-5 bg-gradient-to-r from-primary/10 to-transparent border-b border-white/5 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                            </div>
                            <div>
                                <h3 className="text-sm font-bold text-white tracking-wide uppercase">Luxie</h3>
                                <div className="flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Active Assistant</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="ml-auto text-gray-500 hover:text-white transition-colors p-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                            {messages.map((msg, idx) => (
                                <motion.div
                                    initial={{ opacity: 0, x: msg.role === 'bot' ? -10 : 10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    key={idx}
                                    className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'}`}
                                >
                                    <div className={`max-w-[80%] p-4 rounded-2xl text-xs leading-relaxed ${
                                        msg.role === 'bot' 
                                        ? 'bg-[#1a1a1a] text-gray-300 rounded-tl-none border border-white/5' 
                                        : 'bg-primary text-black font-semibold rounded-tr-none shadow-[0_5px_15px_rgba(212,175,55,0.2)]'
                                    }`}>
                                        {msg.text}
                                    </div>
                                </motion.div>
                            ))}
                            {isTyping && (
                                <div className="flex justify-start">
                                    <div className="bg-[#1a1a1a] p-4 rounded-2xl rounded-tl-none border border-white/5 flex gap-1 items-center">
                                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                                        <div className="w-1 h-1 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                                        <div className="w-2 h-1 bg-primary rounded-full animate-bounce" />
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Actions */}
                        <div className="px-5 py-3 flex gap-2 overflow-x-auto no-scrollbar border-t border-white/5">
                            {quickActions.map((action, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setInputText(action.query); }}
                                    className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest text-gray-400 hover:text-primary hover:border-primary/50 transition-all whitespace-nowrap"
                                >
                                    {action.label}
                                </button>
                            ))}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-5 border-t border-white/5 flex gap-3 bg-[#080808]">
                            <input
                                type="text"
                                placeholder="Ask Luxie anything..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="flex-1 bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-3 text-xs text-white focus:outline-none focus:border-primary/50 transition-all font-medium"
                            />
                            <button
                                type="submit"
                                className="p-3 bg-primary text-black rounded-xl hover:bg-primary/80 transition-all shadow-lg active:scale-95"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" /></svg>
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="absolute right-20 bottom-3 bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-[#D4AF37]/30 shadow-2xl hidden md:flex items-center justify-center w-max"
                    >
                        <p className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] whitespace-nowrap">Chat with Luxie</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all relative ${
                        isOpen ? 'bg-[#1a1a1a] text-white' : 'bg-[#D4AF37] text-black'
                    }`}
                >
                    {isOpen ? (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                    ) : (
                        <div className="relative">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7"><path fillRule="evenodd" d="M4.848 2.771A49.144 49.144 0 0112 2.25c2.43 0 4.817.178 7.152.52 1.978.292 3.348 2.024 3.348 3.97v6.02c0 1.946-1.37 3.678-3.348 3.97a48.901 48.901 0 01-3.476.383.39.39 0 00-.297.17l-2.755 4.133a.75.75 0 01-1.248 0l-2.755-4.133a.39.39 0 00-.297-.17 48.9 48.9 0 01-3.476-.384c-1.978-.29-3.348-2.024-3.348-3.97V6.741c0-1.946 1.37-3.68 3.348-3.97zM6.75 8.25a.75.75 0 01.75-.75h9a.75.75 0 010 1.5h-9a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5H12a.75.75 0 000-1.5H7.5z" clipRule="evenodd" /></svg>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full border-2 border-[#D4AF37] animate-ping" />
                        </div>
                    )}
                    
                    {!isOpen && (
                        <div className="absolute inset-0 rounded-full border-2 border-[#D4AF37] animate-[ping_3s_infinite] opacity-30 select-none pointer-events-none"></div>
                    )}
                </motion.button>
        </div>
    );
};

export default Chatbot;
