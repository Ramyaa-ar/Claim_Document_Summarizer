import { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import axios from 'axios';

export default function DocumentChat({ claimId }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I analyzed this document. What would you like to know about it?' }
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

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      // Format history excluding the initial greeting if we want, or keep it.
      const history = messages.filter(m => m.role !== 'assistant' || m.content !== 'Hi! I analyzed this document. What would you like to know about it?');

      const response = await axios.post('http://localhost:5000/api/chat-claim', {
        claimId,
        message: userMessage,
        history: history
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      setMessages(prev => [...prev, { role: 'assistant', content: response.data.reply }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 flex flex-col h-[500px] overflow-hidden group border-t-4 border-t-blue-500 mt-8 relative">
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-800/80 p-4 border-b border-gray-100 dark:border-gray-700 flex items-center gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/50 p-2 rounded-lg">
          <MessageSquare className="text-blue-600 dark:text-blue-400" size={20} />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 dark:text-white">Ask AI Assistant</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Ask specific questions about this claim</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-gray-900/20">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600' : 'bg-green-600'}`}>
              {msg.role === 'user' ? <User size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
            </div>
            <div className={`max-w-[75%] rounded-2xl p-3 text-sm ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white rounded-tr-none' 
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700 rounded-tl-none shadow-sm'
            }`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3 flex-row">
            <div className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-green-600">
              <Bot size={16} className="text-white" />
            </div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-none p-3 shadow-sm flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-green-600" />
              <span className="text-sm text-gray-500">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <form onSubmit={handleSend} className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            placeholder="E.g., Why was the pharmacy bill deducted?"
            className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-800 text-white rounded-lg transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
