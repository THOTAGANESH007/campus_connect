import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, Loader2, Plus, MessageSquare, Menu, X, Trash2 } from "lucide-react";
import { 
  getChatSessions, 
  getChatSession, 
  createChatSession, 
  sendMessageToChatSession,
  deleteChatSession
} from "../../services/GeminiService";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion, AnimatePresence } from "framer-motion";

const ChatInterface = () => {
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [messages, setMessages] = useState([
    {
      role: "model",
      text: "Hello! Welcome to Campus Connect. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef(null);

  // Initial Fetch of Sessions
  useEffect(() => {
    getChatSessions()
      .then((data) => setSessions(data))
      .catch((err) => console.error("Failed to load sessions", err));
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleNewChat = () => {
    setCurrentSessionId(null);
    setMessages([
      {
        role: "model",
        text: "Hello! Welcome to Campus Connect. How can I assist you today?",
      },
    ]);
    setShowSidebar(false);
  };

  const selectSession = async (id) => {
    try {
      setIsLoading(true);
      const sessionData = await getChatSession(id);
      setCurrentSessionId(id);
      
      const greeting = {
        role: "model",
        text: "Hello! Welcome to Campus Connect. How can I assist you today?",
      };

      if (sessionData.messages.length === 0) {
         setMessages([greeting]);
      } else {
         setMessages([greeting, ...sessionData.messages]);
      }
      setShowSidebar(false);
    } catch (error) {
      console.error("Error fetching session", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSession = async (e, id) => {
    e.stopPropagation();
    try {
      await deleteChatSession(id);
      setSessions(prev => prev.filter(s => s._id !== id));
      if (currentSessionId === id) {
        handleNewChat();
      }
    } catch (err) {
      console.error("Error deleting session", err);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      let sessionId = currentSessionId;
      let isNewSession = false;

      if (!sessionId) {
        const newSession = await createChatSession();
        sessionId = newSession._id;
        setCurrentSessionId(sessionId);
        setSessions(prev => [newSession, ...prev]);
        isNewSession = true;
      }

      const response = await sendMessageToChatSession(sessionId, userMessage.text);
      setMessages((prev) => [...prev, { role: "model", text: response.text }]);
      
      if (isNewSession || response.session) {
        setSessions((prev) => 
          prev.map(s => 
            s._id === sessionId 
              ? { ...s, title: response.session.title } 
              : s
          )
        );
      }
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "I'm sorry, I encountered an error. Please check your connection.",
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="flex h-full bg-slate-50 text-slate-800 overflow-hidden relative font-sans p-4 md:p-8 md:pt-12 gap-4 md:gap-8">
      {/* Background Ambience - Light Mode */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-50 via-white to-gray-50 -z-10 pointer-events-none" />
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200/40 rounded-full blur-3xl opacity-60 animate-pulse pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-200/40 rounded-full blur-3xl opacity-60 animate-pulse delay-1000 pointer-events-none" />

      {/* Sidebar for History */}
      {/* Overlay for mobile */}
      {showSidebar && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setShowSidebar(false)}
        />
      )}
      
      <div className={`${showSidebar ? "translate-x-0" : "-translate-x-full"} md:translate-x-0 fixed md:relative z-30 w-72 h-full bg-white/95 backdrop-blur-xl border border-gray-200 transition-transform duration-300 flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl md:rounded-3xl`}>
        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-transparent">
          <button 
            onClick={handleNewChat} 
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-2.5 px-4 rounded-xl font-bold transition-all shadow-sm shadow-blue-600/20 active:scale-[0.98]"
          >
            <Plus className="w-5 h-5"/> New Chat
          </button>
          <button className="md:hidden ml-3 p-2 text-slate-500 hover:bg-slate-100 rounded-lg" onClick={() => setShowSidebar(false)}>
            <X size={20}/>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin scrollbar-thumb-gray-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 px-3 mt-2">Recent</p>
          {sessions.map(s => (
            <div 
              key={s._id} 
              className={`group flex items-center justify-between px-3 py-3 rounded-xl cursor-pointer transition-all ${
                currentSessionId === s._id 
                  ? "bg-blue-50 text-blue-700 border border-blue-100" 
                  : "text-slate-600 hover:bg-slate-100 border border-transparent"
              }`}
              onClick={() => selectSession(s._id)}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className={`w-4 h-4 shrink-0 ${currentSessionId === s._id ? "text-blue-500" : "text-slate-400"}`} />
                <span className="truncate text-sm font-medium">{s.title}</span>
              </div>
              <button 
                onClick={(e) => handleDeleteSession(e, s._id)}
                className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-500 transition-all shrink-0"
                title="Delete chat"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {sessions.length === 0 && (
             <div className="text-center p-4 text-sm text-slate-500">No previous chats.</div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full relative w-full bg-white/60 backdrop-blur-sm border border-gray-200 rounded-2xl md:rounded-3xl shadow-sm overflow-hidden">
        {/* Mobile Toggle for Chat History */}
        <button 
          className="md:hidden absolute top-3 left-4 z-20 p-2 bg-white/80 backdrop-blur-md border border-gray-200 text-slate-500 hover:bg-slate-100 rounded-lg shadow-sm"
          onClick={() => setShowSidebar(true)}
        >
          <Menu size={20}/>
        </button>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 pt-14 md:pt-6 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex w-full ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex gap-3 max-w-[90%] md:max-w-[70%] ${
                    message.role === "user" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border ${
                      message.role === "user"
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white text-indigo-600 border-gray-200"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4 md:w-5 md:h-5" />
                    ) : (
                      <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`flex flex-col p-3 md:p-4 rounded-2xl shadow-sm border ${
                      message.role === "user"
                        ? "bg-blue-600 text-white border-blue-600 rounded-tr-sm"
                        : message.isError
                          ? "bg-red-50 border-red-200 text-red-600 rounded-tl-sm"
                          : "bg-white border-gray-200 text-slate-800 rounded-tl-sm"
                    }`}
                  >
                    <div
                      className={`prose prose-sm md:prose-base max-w-none break-words ${message.role === "user" ? "prose-invert" : "prose-slate"}`}
                    >
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.text || ""}
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
                  <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="bg-white border border-gray-200 p-4 rounded-2xl rounded-tl-sm flex items-center gap-2 shadow-sm">
                  <span
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  />
                  <span
                    className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white/90 backdrop-blur-xl border-t border-gray-200 shrink-0">
          <div className="max-w-4xl mx-auto px-4 py-3 relative flex items-end gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onInput={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              rows={1}
              disabled={isLoading}
              className="w-full bg-gray-100 border border-gray-200 rounded-3xl py-3.5 pl-6 pr-14 text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all shadow-inner resize-none max-h-32 min-h-[52px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent text-sm md:text-base"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="absolute right-6 bottom-[18px] md:bottom-4 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-full text-white transition-all shadow-md hover:shadow-lg active:scale-95"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
