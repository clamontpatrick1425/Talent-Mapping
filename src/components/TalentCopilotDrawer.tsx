import React, { useState } from 'react';
import { TalentMapReport } from '../types';
import { Bot, Send, Sparkles, X, MessageSquare, ArrowRight, UserCheck, HelpCircle, Loader2 } from 'lucide-react';

interface TalentCopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  report: TalentMapReport;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const TalentCopilotDrawer: React.FC<TalentCopilotDrawerProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: `Hello! I am your AI Talent Intelligence Partner for **${report.input.role.value}** (${report.input.geography.location}).
      
You can ask me anything about this talent market map:
- *"What happens if we switch from ${report.input.workModel.value} to 100% Remote?"*
- *"How do we pitch candidates currently at ${report.competitiveEmployerLandscape[0]?.name || 'Tier 1 competitors'}?"*
- *"What adjacent profiles from finance or defense should we consider?"*
- *"Generate a 3-step personalized InMail sequence for Archetype 1."*`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = [
    'What if we switch to 100% Remote?',
    'How do we handle unvested Big Tech equity?',
    'Draft an InMail sequence for Archetype 1',
    'Which companies are most vulnerable to poaching?',
  ];

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage.trim();
    if (!textToSend || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/refine-talent-map', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          report,
          userMessage: textToSend,
          conversationHistory: messages,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Strategic guidance synthesized.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        sender: 'assistant',
        text: 'Unable to reach backend. Here is an immediate strategic takeaway: Expanding the geographic radius by 50 miles increases candidate availability by ~30%, while offering equity signing bonuses bridges golden-handcuff resistance.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="talent-copilot-drawer"
      className="fixed inset-y-0 right-0 w-full sm:w-[460px] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col transition-all duration-300"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-900 text-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-blue-600 rounded-lg">
            <Bot className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-sm">Talent Intelligence Copilot</h3>
            <p className="text-[11px] text-blue-200">
              Interactive Recruiting & Sourcing Advisor
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[88%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-xs border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-slate-500 p-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span>Analyzing talent market data & formulating strategy...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50 dark:bg-slate-900/60">
        <div className="text-[10px] uppercase font-bold text-slate-400 mb-1.5">
          Suggested Sourcing Queries:
        </div>
        <div className="flex flex-wrap gap-1.5">
          {quickPrompts.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              disabled={isLoading}
              className="text-[11px] px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400 hover:text-blue-600 transition-all text-left shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Input Box */}
      <div className="p-3.5 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask anything about this talent market..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-blue-500 text-slate-900 dark:text-slate-100"
          />

          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl transition-all cursor-pointer shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
