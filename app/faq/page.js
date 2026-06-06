'use client';
import Link from 'next/link';
import { useState } from 'react';

export default function FaqPage() {
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  const faqs = [
    {
      q: "Is this actually free?",
      a: "Yes. No subscription. No freemium nudge after your third translation. No dark pattern pricing page. You paste text, it gets translated, you leave.",
    },
    {
      q: "Are you affiliated with LinkedIn?",
      a: "No. BullShift is satire. LinkedIn is a trademark of LinkedIn Corporation, a Microsoft company. We reference it the way a parody references its subject — under fair use, fully aware that a LinkedIn jargon translator built on LinkedIn irony is not lost on anyone.",
    },
    {
      q: "Does BullShift store what I paste?",
      a: "No. Your input goes to the Claude API for translation and is not stored by us. The Bullpen history lives in your browser's local storage only — visible only to you, cleared when you clear your browser data, never transmitted anywhere.",
    },
    {
      q: "What is the Linguistic Inflation Score?",
      a: "A satirical metric estimating the density of jargon, performative language, and strategic ambiguity in a post. 0–30 is mostly human. 91–100 means authentic information has left the building. Not scientifically validated. Consistently accurate.",
    },
    {
      q: "Why five severity levels?",
      a: "Because 'gentle or brutal' is a binary that doesn't honor the full spectrum of catharsis available to the working professional. Diplomatic exists for people who feel guilty. Obliterate exists for people who have been in one too many alignment syncs.",
    },
    {
      q: "What is the Bullpen?",
      a: "Your personal Wall of Evidence. A local history of past translations stored in your browser. Revisit them, share them, or destroy all record of them with the 'Destroy the evidence' button. Recommended after the Obliterate setting.",
    },
    {
      q: "Does it work on non-LinkedIn content?",
      a: "Technically yes. Earnings calls, press releases, performance reviews, strategic memos, that email your manager sent at 11pm Friday. LinkedIn is just the most target-rich environment.",
    },
    {
      q: "Who built this?",
      a: "A communications strategist who has read approximately 40,000 LinkedIn posts in a professional capacity and needed somewhere for the pressure to go. BullShift launched April 1, 2026, which felt appropriate.",
    },
    {
      q: "Is the AI making fun of me?",
      a: "The AI is making fun of the language, not the person. BullShift is a critique of a communication culture, not the people caught inside it. That said: if you used 'boil the ocean' unironically, the AI is a little bit making fun of you.",
    },
    {
      q: "What data does the Claude API receive?",
      a: "Only the text you submit for translation, plus a system prompt telling the model how to behave. No name, no account, no location, no device fingerprint. See anthropic.com/privacy for Anthropic's full data handling policy.",
    },
  ];

  const syne = { fontFamily: "'Syne', sans-serif" };
  const mono = { fontFamily: "'Space Mono', monospace" };
  const sans = { fontFamily: "'DM Sans', sans-serif" };

  return (
    <div style={{ background:'#F5F0E8', minHeight:'100vh', ...sans, color:'#1A1714' }}>

      {/* NAV */}
      <nav style={{
        display:'flex', alignItems:'center', justifyContent:'space-between',
        padding:'16px 40px', borderBottom:'1.5px solid #1A1714',
        background:'#F5F0E8',
      }}>
        <Link href="/" style={{ ...syne, fontWeight:800, fontSize:22, letterSpacing:'-0.04em', color:'#1A1714', textDecoration:'none' }}>
          Bull<em style={{ color:'#F0B429', fontStyle:'normal' }}>Shift</em>
        </Link>
        <div style={{ display:'flex', gap:24, alignItems:'center' }}>
          <Link href="/about" style={{ fontSize:13, color:'#3D3830', textDecoration:'none' }}>About</Link>
          <Link href="/faq" style={{ fontSize:13, color:'#1A1714', fontWeight:500, textDecoration:'underline', textUnderlineOffset:4 }}>FAQ</Link>
          <Link href="/privacy" style={{ fontSize:13, color:'#3D3830', textDecoration:'none' }}>Privacy</Link>
          <Link href="/" style={{
            ...mono, fontSize:11, background:'#1A1714',
            color:'#F5F0E8', padding:'9px 16px', borderRadius:3, textDecoration:'none', whiteSpace:'nowrap',
          }}>Expose something →</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding:'64px 40px 0', maxWidth:860, margin:'0 auto' }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:'0.12em', color:'#F0B429', textTransform:'uppercase', marginBottom:14 }}>
          Epistemological Clarifications
        </div>
        <h1 style={{ ...syne, fontWeight:800, fontSize:'clamp(48px,8vw,88px)', lineHeight:0.92, letterSpacing:'-0.04em', color:'#1A1714', marginBottom:28 }}>
          Questions<br />
          we <span style={{ color:'#F0B429' }}>expected</span><br />
          you'd ask
        </h1>
        <p style={{ fontSize:17, lineHeight:1.7, color:'#3D3830', fontWeight:300, maxWidth:580 }}>
          Addressed with the precision and transparency this tool was designed to demand of others.
        </p>
      </div>

      {/* ACCORDION */}
      <div style={{ maxWidth:860, margin:'40px auto 0', padding:'0 40px 60px' }}>
        {faqs.map((item, i) => (
          <div key={i} style={{ borderTop:'1.5px solid #D4CFC8', ...(i === faqs.length - 1 ? { borderBottom:'1.5px solid #D4CFC8' } : {}) }}>
            <button
              onClick={() => toggle(i)}
              style={{
                width:'100%', display:'flex', justifyContent:'space-between', alignItems:'center',
                padding:'20px 0', background:'none', border:'none', cursor:'pointer', textAlign:'left', gap:16,
              }}
            >
              <span style={{ ...syne, fontWeight:700, fontSize:16, color:'#1A1714', lineHeight:1.3 }}>
                {item.q}
              </span>
              <span style={{
                ...mono, fontSize:18, color:'#F0B429', flexShrink:0, lineHeight:1,
                transition:'transform 0.25s',
                transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
              }}>+</span>
            </button>
            <div style={{
              maxHeight: open === i ? 400 : 0,
              overflow:'hidden',
              transition:'max-height 0.3s ease',
            }}>
              <p style={{ fontSize:14, lineHeight:1.8, color:'#3D3830', fontWeight:300, paddingBottom:20, maxWidth:620 }}>
                {item.a}
              </p>
            </div>
          </div>
        ))}

        <div style={{ ...mono, fontSize:10, color:'#A8A39D', textAlign:'center', paddingTop:48 }}>
          Not affiliated with LinkedIn® or Microsoft. BullShift is satire. · bullshift.app
        </div>
      </div>
    </div>
  );
}
