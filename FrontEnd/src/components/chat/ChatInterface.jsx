import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Loader2 } from 'lucide-react';
import { sendMessageToGemini } from '../../services/GeminiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInterface = () => {
    const [messages, setMessages] = useState([
        {
            role: 'model',
            text: "Hello! Welcome to Campus Connect. How can I assist you today?",
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = { role: 'user', text: input };
        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            // Prepare history for API
            const historyForApi = [...messages, userMessage].map((msg) => ({
                role: msg.role === 'model' ? 'model' : 'user',
                parts: [{ text: msg.text }],
            }));

            const responseText = await sendMessageToGemini(historyForApi);

            setMessages((prev) => [
                ...prev,
                { role: 'model', text: responseText },
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: 'model',
                    text: "I'm sorry, I encountered an error. Please check your connection or API key.",
                    isError: true,
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleInput = (e) => {
        e.target.style.height = 'auto';
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-screen bg-gray-50 text-slate-800 overflow-hidden relative font-sans">
            {/* Background Ambience - Light Mode */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-gray-50 -z-10" />
            <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl opacity-60 animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-60 animate-pulse delay-1000" />

            {/* Header */}
            <header className="px-6 py-4 border-b border-gray-200 bg-white/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg shadow-md text-white">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
                            Campus Connect
                        </h1>
                        <p className="text-xs text-slate-500 font-medium">AI Assistant</p>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto pt-24 pb-4 px-4 md:pt-32 md:pb-6 md:px-6 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                <AnimatePresence initial={false}>
                    {messages.map((message, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`flex w-full ${message.role === 'user' ? 'justify-end' : 'justify-start'
                                }`}
                        >
                            <div
                                className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                    }`}
                            >
                                {/* Avatar */}
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${message.role === 'user'
                                        ? 'bg-blue-600 text-white border-blue-600'
                                        : 'bg-white text-indigo-600 border-gray-200'
                                        }`}
                                >
                                    {message.role === 'user' ? (
                                        <User className="w-5 h-5" />
                                    ) : (
                                        <Sparkles className="w-5 h-5" />
                                    )}
                                </div>

                                {/* Message Bubble */}
                                <div
                                    className={`flex flex-col p-3 md:p-4 rounded-2xl shadow-sm border ${message.role === 'user'
                                        ? 'bg-blue-600 text-white border-blue-600 rounded-tr-sm'
                                        : message.isError
                                            ? 'bg-red-50 border-red-200 text-red-600 rounded-tl-sm'
                                            : 'bg-white border-gray-200 text-slate-800 rounded-tl-sm'
                                        }`}
                                >
                                    <div className={`prose prose-sm md:prose-base max-w-none break-words ${message.role === 'user' ? 'prose-invert' : 'prose-slate'}`}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                            {message.text}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Loading Indicator */}
                {isLoading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-start w-full"
                    >
                        <div className="flex gap-3 max-w-[85%] md:max-w-[70%]">
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-indigo-600 border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
                                <Sparkles className="w-5 h-5" />
                            </div>
                            <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200">
                <div className="max-w-4xl mx-auto px-4 py-3 relative flex items-end gap-2">
                    <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onInput={handleInput}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message..."
                        rows={1}
                        disabled={isLoading}
                        className="w-full bg-gray-100 border border-gray-200 rounded-3xl py-3 pl-6 pr-14 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner resize-none max-h-32 min-h-[50px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-6 bottom-4 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full text-white transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;
