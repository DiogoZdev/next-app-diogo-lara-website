'use client';

import { useEffect, useRef, useState } from 'react';
import { buildSentence } from './words';

type Message = {
  id: number;
  role: 'user' | 'system';
  text: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: 'system', text: 'Hello! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [learnedWords, setLearnedWords] = useState<string[]>([]);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom only if overflow
  const scrollToBottom = () => {
    const el = scrollContainerRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    setLoading(true);
    console.log('loading true');

    const newWords: Array<string> = Array.from(new Set(input.split(' ')));
    const receivedWords =  newWords;

    const newMessage: Message = {
      id: Date.now(),
      role: 'user',
      text: input
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulated system response
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'system',
          text: buildSentence(receivedWords),
        }
      ]);

      setLearnedWords((prev) => [...Array.from(new Set(...prev, ...receivedWords))]);
      setLoading(false);
      console.log('loading false');
    }, 1600);

  };

  return (<>
    <details className="p-8 mb-8 bg-slate-600 text-white rounded-lg">
      <summary className="font-bold text-lg cursor-pointer mb-4">💡 Important Notice (click to toggle)</summary>
      <p>Keep in mind that no data processing is made over any input. This project is executed locally, and has no intent to offend or harm anyone, anyway.</p>
      <p>Any sentence that makes sense is pure coincidence over randomly generated text.</p>

    </details>

    <div className="relative flex flex-col h-[90vh]">
      <div className="w-full h-full flex">
        <div className="w-[200px] bg-gray-800 h-full rounded-lg p-4">
          <div className="text-2xl">Language</div>
          <span className="cursor-pointer text-[30px]">🇧🇷</span>
          <span className="cursor-pointer text-[30px] ml-4">🇺🇸</span>
        </div>
        <div
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`max-w-md px-4 py-2 rounded-lg shadow whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-blue-500 text-white self-end ml-auto'
                  : 'bg-zinc-700 text-gray-100 self-start mr-auto'
              }`}
            >
              {msg.text}
            </div>
          ))}

        </div>
      </div>

       {loading && (
        <div className="absolute w-full h-full justify-center py-2 grid content-center">
          <div
            className="relative w-24 h-24 rounded-full animate-spin flex items-center justify-center"
            style={{
              background: 'linear-gradient(#05a 30%, transparent 70%)',
              maskImage: 'radial-gradient(circle at center, transparent 60%, black 60%)',
              WebkitMaskImage: 'radial-gradient(circle at center, transparent 50%, black 50%)',
            }}
          ></div>
        </div>
      )}

      {/* Message input */}
      <div className="border-t p-4 bg-zinc-900 flex items-center gap-2">
        <input
          type="text"
          className="flex-1 border rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-zinc-800"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleSend();
          }}
        />
        <button
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition"
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
}
