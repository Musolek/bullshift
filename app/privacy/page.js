import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy — BullShift',
  description:
    'BullShift does not store your inputs, does not require an account, and does not sell your data. Here is exactly what happens to your text.',
  openGraph: {
    title: 'Privacy Policy — BullShift',
    description: 'We don\'t collect your stuff. Here\'s the proof.',
    url: 'https://bullshift.app/privacy',
  },
};

const privacySections = [
  {
    q: "What we collect",
    a: "Anonymous aggregate request counts for rate-limiting only. No names, emails, IP addresses in any identifiable form, or anything that connects back to you as a person.",
  },
  {
    q: "What we don't collect",
    a: "Your name. Your email. The text you translate. The outputs you receive. Your device fingerprint. Your location. Your LinkedIn username. (Ironic as that last one would be.)",
  },
  {
    q: "Your inputs",
    a: "Text you submit goes to the Anthropic Claude API and is not stored by BullShift at any point. It passes through our server-side route solely to protect your API key from browser exposure. Not logged, not retained, not analyzed.",
  },
  {
    q: "The Bullpen",
    a: "Translation history in The Bullpen lives exclusively in your browser's localStorage. Never transmitted to our servers. Delete it anytime with 'Destroy the evidence'. We cannot access it. We cannot recover it if you clear your browser.",
  },
  {
    q: "Cookies",
    a: "No advertising cookies. No tracking pixels. No third-party analytics cookies. Basic session cookies may be set by Next.js or Vercel infrastructure. These don't identify you personally.",
  },
  {
    q: "Third parties",
    a: "The Anthropic Claude API processes translation requests. Vercel hosts the application. No other third parties receive your data. Neither of them sells it. Neither do we.",
  },
  {
    q: "Changes",
    a: "If we make material changes, we'll update the date above and note what changed. We built a jargon translator. We're not going to gaslight you with our own policy language.",
  },
  {
    q: "Contact",
    a: "Questions: hello@bullshift.app — We respond to humans. Automated outreach from synergy-focused alignment platforms will be translated and returned.",
  },
];

export default function PrivacyPage() {
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
          <Link href="/faq" style={{ fontSize:13, color:'#3D3830', textDecoration:'none' }}>FAQ</Link>
          <Link href="/privacy" style={{ fontSize:13, color:'#1A1714', fontWeight:500, textDecoration:'underline', textUnderlineOffset:4 }}>Privacy</Link>
          <Link href="/" style={{
            ...mono, fontSize:11, background:'#1A1714',
            color:'#F5F0E8', padding:'9px 16px', borderRadius:3, textDecoration:'none', whiteSpace:'nowrap',
          }}>Expose something →</Link>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding:'64px 40px 0', maxWidth:860, margin:'0 auto' }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:'0.12em', color:'#F0B429', textTransform:'uppercase', marginBottom:14 }}>
          Privacy Policy · Effective April 1, 2026
        </div>
        <h1 style={{ ...syne, fontWeight:800, fontSize:'clamp(48px,8vw,88px)', lineHeight:0.92, letterSpacing:'-0.04em', color:'#1A1714', marginBottom:28 }}>
          We don't<br />
          collect <span style={{ color:'#F0B429' }}>your</span><br />
          <span style={{ textDecoration:'line-through', textDecorationThickness:3, color:'#8A847A' }}>data</span>
        </h1>
        <p style={{ fontSize:17, lineHeight:1.7, color:'#3D3830', fontWeight:300, maxWidth:580 }}>
          This is the part where most privacy policies gaslight you with 4,000 words of legal fog.
          This one won't. Here is exactly what happens to your data:{' '}
          <strong style={{ fontWeight:500, color:'#1A1714' }}>almost nothing.</strong>
        </p>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'40px 40px 60px' }}>

        {/* THREE ZEROS */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:0, border:'1.5px solid #1A1714', borderRadius:6, overflow:'hidden', marginBottom:48 }}>
          {[
            { n:'0', label:'ACCOUNTS NEEDED' },
            { n:'0', label:'INPUTS STORED' },
            { n:'0', label:'THIRD PARTIES SOLD TO' },
          ].map(({ n, label }, i, arr) => (
            <div key={label} style={{
              padding:28, textAlign:'center',
              ...(i < arr.length - 1 ? { borderRight:'1.5px solid #1A1714' } : {}),
            }}>
              <div style={{ ...syne, fontWeight:800, fontSize:56, color:'#1A1714', lineHeight:1 }}>{n}</div>
              <div style={{ ...mono, fontSize:10, color:'#6B6560', letterSpacing:'0.08em', marginTop:6, textTransform:'uppercase' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* SHORT VERSION */}
        <div style={{ padding:36, background:'#1A1714', borderRadius:6, marginBottom:32 }}>
          <div style={{ ...mono, fontSize:10, color:'#6B6560', letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:14 }}>
            The short version
          </div>
          <p style={{ fontSize:17, lineHeight:1.75, color:'#EDE8DE', fontWeight:300 }}>
            You paste text. We send it to the Claude API. It comes back translated.
            We don't store the text. We don't know who you are.
            The Bullpen history lives in your browser only and disappears when you clear it.{' '}
            <strong style={{ color:'#F0B429', fontWeight:500 }}>That's the whole policy.</strong>
          </p>
        </div>

        {/* SECTIONS */}
        {privacySections.map(({ q, a }, i) => (
          <div key={i} style={{
            padding:'24px 0',
            borderBottom:'1.5px solid #D4CFC8',
            ...(i === 0 ? { borderTop:'1.5px solid #D4CFC8' } : {}),
          }}>
            <div style={{ ...syne, fontWeight:700, fontSize:15, color:'#1A1714', marginBottom:8 }}>{q}</div>
            <div style={{ fontSize:14, lineHeight:1.75, color:'#3D3830', fontWeight:300, maxWidth:640 }}>{a}</div>
          </div>
        ))}

        <div style={{ ...mono, fontSize:10, color:'#A8A39D', textAlign:'center', paddingTop:16 }}>
          Questions? hello@bullshift.app · Not affiliated with LinkedIn® or Microsoft.
        </div>
      </div>
    </div>
  );
}
