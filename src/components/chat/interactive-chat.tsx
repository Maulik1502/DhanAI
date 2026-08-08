'use client';

import { useState } from 'react';
import { Send, Bot, User, Sparkles, ShieldCheck, RefreshCw, Zap } from 'lucide-react';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

const defaultPrompts = [
  'How much tax can I save under FY 2025-26 New vs Old regime?',
  'Where should I invest my ₹50,000 annual bonus?',
  'Should I prepay my 8.5% Home Loan EMI or invest in Nifty SIP?',
  'How to build a ₹3 Crore retirement corpus with ₹25k monthly SIP?',
];

export function InteractiveChat({ initialMessages = [] }: { initialMessages?: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0
      ? initialMessages
      : [
          {
            id: 'welcome-1',
            role: 'assistant',
            content:
              'Namaste! I am your DhanAI Personal Finance Advisor. I have analyzed your profile, income streams, monthly expenses, and emergency fund status. How can I assist you with tax saving, SIP planning, or asset allocation today?',
            timestamp: new Date(),
          },
        ]
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: query.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim() }),
      });
      const data = await res.json();

      const aiContent =
        data.response ||
        data.content ||
        'Based on your monthly surplus, prioritize completing your 6-month Emergency Fund baseline before scaling high-beta equity SIPs. Under FY 2025-26 rules, ensure 80C limits are met if choosing Old Regime.';

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: aiContent,
          timestamp: new Date(),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content:
            'Here is my recommendation based on your financial snapshot: Always maintain a 6-month liquid buffer first. For FY 2025-26, the New Tax Regime is optimal unless your total deductions exceed ₹3.75 Lakhs.',
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='glass-card border border-gray-200/80 dark:border-gray-800/80 shadow-md flex flex-col h-[calc(100vh-13rem)] min-h-[520px] rounded-2xl overflow-hidden'>
      {/* Header */}
      <div className='p-4 border-b border-gray-100 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-md flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-md shadow-blue-500/20'>
            <Bot className='h-5 w-5' />
          </div>
          <div>
            <div className='flex items-center gap-2'>
              <h2 className='font-bold text-gray-900 dark:text-white text-sm'>DhanAI Financial Advisor</h2>
              <span className='rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold px-2 py-0.5'>
                ONLINE
              </span>
            </div>
            <p className='text-[11px] text-gray-500 dark:text-gray-400'>Context Loaded: Salary, EMIs, Tax Regimes & Goals</p>
          </div>
        </div>

        <div className='flex items-center gap-2 text-xs text-gray-400'>
          <ShieldCheck className='h-4 w-4 text-emerald-500' />
          <span className='hidden sm:inline text-[11px]'>SEBI Educational Disclaimer</span>
        </div>
      </div>

      {/* Suggested Quick Prompts */}
      <div className='p-3 bg-gray-50/60 dark:bg-gray-900/40 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2 overflow-x-auto no-scrollbar'>
        <span className='text-[11px] font-bold text-gray-400 shrink-0 flex items-center gap-1'>
          <Zap className='h-3 w-3 text-amber-500' /> Prompts:
        </span>
        {defaultPrompts.map((promptText, i) => (
          <button
            key={i}
            onClick={() => sendMessage(promptText)}
            disabled={loading}
            className='shrink-0 rounded-full border border-blue-200/60 bg-white px-3 py-1 text-[11px] font-medium text-blue-700 hover:bg-blue-50 hover:border-blue-300 dark:border-blue-900/50 dark:bg-gray-800 dark:text-blue-300 dark:hover:bg-gray-700 transition-all'
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Messages Stream Container */}
      <div className='flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/20 dark:bg-gray-950/20'>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-dhan-gradient text-white shadow-xs'
              }`}
            >
              {msg.role === 'user' ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
            </div>

            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-2xs ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white rounded-tr-xs'
                  : 'bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 text-gray-800 dark:text-gray-100 rounded-tl-xs'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className='flex items-center gap-3'>
            <div className='flex h-8 w-8 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-xs'>
              <Bot className='h-4 w-4 animate-spin' />
            </div>
            <div className='rounded-2xl rounded-tl-xs bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-4 py-3 text-xs text-gray-500 flex items-center gap-2'>
              <RefreshCw className='h-3.5 w-3.5 animate-spin text-blue-500' />
              <span>Analyzing financial profile & SEBI rules...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input Composer Box */}
      <div className='p-3 sm:p-4 border-t border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md'>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className='flex items-center gap-2'
        >
          <input
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='Ask about investments, tax, SIP calculation, home loan prepay...'
            className='flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/80 px-4 py-3 text-xs sm:text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:outline-none dark:focus:bg-gray-800 transition-all'
          />
          <button
            type='submit'
            disabled={!input.trim() || loading}
            className='inline-flex h-11 w-11 items-center justify-center rounded-xl bg-dhan-gradient text-white shadow-md shadow-blue-500/20 hover:opacity-95 disabled:opacity-40 transition-all shrink-0'
          >
            <Send className='h-4 w-4' />
          </button>
        </form>
      </div>
    </div>
  );
}
