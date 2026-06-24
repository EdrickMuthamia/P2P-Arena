import { useState, useRef, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

const SYSTEM_PROMPT = `You are a helpful academic assistant for P2P Arena, a student learning platform for O-Level and A-Level students.
Help students understand subjects like Mathematics, Physics, Chemistry, Biology, English, History, Geography, Economics, Business, Computer Science, and Accounting.
Keep answers concise, clear, and educational. If asked about topics unrelated to academics, politely redirect to academic help.`;

const INITIAL_MESSAGE = { role: 'assistant', text: "Hi! I'm your AI study assistant 🎓 Ask me anything about your subjects!" };

export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([INITIAL_MESSAGE]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  const send = async () => {
    const text = input.trim();
    if (!text || loading) return;

    if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
      setMessages(m => [...m, { role: 'assistant', text: '⚠️ No API key set. Add VITE_GEMINI_API_KEY to your .env file.' }]);
      return;
    }

    setInput('');
    setMessages(m => [...m, { role: 'user', text }]);
    setLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }],
      }));

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [...history, { role: 'user', parts: [{ text }] }],
        }),
      });

      const data = await res.json();
      const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I could not get a response.';
      setMessages(m => [...m, { role: 'assistant', text: reply }]);
    } catch {
      setMessages(m => [...m, { role: 'assistant', text: 'Connection error. Please try again.' }]);
    }
    setLoading(false);
  };

  return (
    <>
      {/* Chat Window */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '5rem', right: '1.5rem', width: '340px',
          background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
          display: 'flex', flexDirection: 'column', zIndex: 300,
          maxHeight: '480px', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary)', color: '#fff', padding: '.9rem 1.25rem',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          }}>
            <span style={{ fontWeight: 700, fontSize: '.95rem' }}>🤖 AI Study Assistant</span>
            <button onClick={() => setOpen(false)} style={{
              background: 'none', border: 'none', color: '#fff',
              fontSize: '1.3rem', cursor: 'pointer', lineHeight: 1,
            }}>×</button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
            {messages.map((m, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
              }}>
                <div style={{
                  maxWidth: '80%', padding: '.6rem .9rem',
                  borderRadius: m.role === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: m.role === 'user' ? 'var(--primary)' : 'var(--bg)',
                  color: m.role === 'user' ? '#fff' : 'var(--text)',
                  fontSize: '.875rem', lineHeight: 1.5,
                  border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                }}>
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div style={{ display: 'flex', gap: '.25rem', padding: '.5rem' }}>
                {[0, 1, 2].map(i => (
                  <span key={i} style={{
                    width: 8, height: 8, borderRadius: '50%', background: 'var(--text-muted)',
                    animation: `bounce .8s ease-in-out ${i * .15}s infinite`,
                    display: 'inline-block',
                  }} />
                ))}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{
            padding: '.75rem', borderTop: '1px solid var(--border)',
            display: 'flex', gap: '.5rem',
          }}>
            <input
              style={{
                flex: 1, padding: '.55rem .85rem', borderRadius: 'var(--radius)',
                border: '1.5px solid var(--border)', fontSize: '.875rem',
                fontFamily: 'inherit', outline: 'none',
              }}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask a study question..."
              disabled={loading}
            />
            <button
              className="btn btn-primary btn-sm"
              onClick={send}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          position: 'fixed', bottom: '1.5rem', right: '1.5rem',
          width: 52, height: 52, borderRadius: '50%',
          background: 'var(--primary)', color: '#fff',
          border: 'none', fontSize: '1.4rem', cursor: 'pointer',
          boxShadow: 'var(--shadow-lg)', zIndex: 300,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'transform .2s, background .2s',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        aria-label="AI Study Assistant"
      >
        {open ? '✕' : '🤖'}
      </button>

      {/* Bounce animation for typing dots */}
      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
    </>
  );
}
