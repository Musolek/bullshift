import Link from 'next/link';

export const metadata = {
  title: 'About BullShift — LinkedIn Jargon Translator',
  description:
    'BullShift is a free AI-powered satirical tool that decodes LinkedIn buzzwords into plain English. Built on the Claude API. No sign-up, no tracking, no circle-backs.',
  openGraph: {
    title: 'About BullShift',
    description: 'LinkedIn jargon decoded. No mercy. No survivors.',
    url: 'https://bullshift.app/about',
  },
};

const TICKER_WORDS = [
  'SYNERGIZE','CIRCLE BACK','MOVE THE NEEDLE','THOUGHT LEADER',
  'BOIL THE OCEAN','PARADIGM SHIFT','LEVERAGE','DEEP DIVE',
  'TOUCH BASE','ALIGNMENT SYNC','ECOSYSTEM','BANDWIDTH',
];


const syne = { fontFamily: "'Clash Display', Inter, system-ui, sans-serif", fontStyle: "normal" };
const mono = { fontFamily: "'IBM Plex Mono', monospace", fontStyle: "normal" };
const sans = { fontFamily: "'Cormorant Garamond', 'Iowan Old Style', Georgia, serif", fontStyle: "italic", fontWeight: 600 };

function Nav({ current }) {
  const links = [
    { href: '/about', label: 'About' },
    { href: '/faq', label: 'FAQ' },
    { href: '/privacy', label: 'Privacy' },
  ];
  return (
    <nav style={{
      display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'16px 40px', borderBottom:'1.5px solid #1A1714',
      background:'#F5F0E8',
    }}>
      <Link href="/" style={{ ...syne, fontWeight:800, fontSize:22, letterSpacing:'-0.04em', color:'#1A1714', textDecoration:'none' }}>
        Bull<em style={{ color:'#F0B429', fontStyle:'normal' }}>Shift</em>
      </Link>
      <div style={{ display:'flex', gap:24, alignItems:'center' }}>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            ...sans, fontSize:13, color: current === label ? '#1A1714' : '#3D3830',
            fontWeight: current === label ? 500 : 400,
            textDecoration: current === label ? 'underline' : 'none',
            textUnderlineOffset: 4,
          }}>{label}</Link>
        ))}
        <Link href="/" style={{
          ...mono, fontSize:11, background:'#1A1714',
          color:'#F5F0E8', padding:'9px 16px', borderRadius:3, textDecoration:'none', whiteSpace:'nowrap',
        }}>Expose something →</Link>
      </div>
    </nav>
  );
}

export default function AboutPage() {
  return (
    <div style={{ background:'#F5F0E8', minHeight:'100vh', ...sans, color:'#1A1714' }}>
      <Nav current="About" />

      {/* HERO */}
      <div style={{ padding:'64px 40px 0', maxWidth:860, margin:'0 auto' }}>
        <div style={{ ...mono, fontSize:10, letterSpacing:'0.12em', color:'#F0B429', textTransform:'uppercase', marginBottom:14 }}>
          About BullShift
        </div>
        <h1 style={{ ...syne, fontWeight:800, fontSize:'clamp(48px,8vw,88px)', lineHeight:0.92, letterSpacing:'-0.04em', color:'#1A1714', marginBottom:28 }}>
          We translate<br />
          <span style={{ textDecoration:'line-through', textDecorationThickness:3, color:'#8A847A' }}>synergy</span><br />
          into <span style={{ color:'#F0B429' }}>English</span>
        </h1>
        <p style={{ fontSize:17, lineHeight:1.7, color:'#3D3830', fontWeight:300, maxWidth:580 }}>
          LinkedIn invented a language nobody asked for. BullShift decodes it.
          Free, no login, no circle-backs, no{' '}
          <strong style={{ fontWeight:500, color:'#1A1714' }}>"stakeholder alignment"</strong> required.
        </p>
      </div>

      {/* TICKER */}
      <div style={{ margin:'48px 0', overflow:'hidden', borderTop:'1.5px solid #1A1714', borderBottom:'1.5px solid #1A1714' }}>
        <div style={{ display:'flex', gap:0, whiteSpace:'nowrap', animation:'ticker 28s linear infinite', padding:'12px 0' }}>
          {[...TICKER_WORDS, ...TICKER_WORDS].map((word, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center' }}>
              <span style={{ ...mono, fontSize:11, color:'#8A847A', padding:'0 16px' }}>{word}</span>
              <span style={{ color:'#D4CFC8' }}>·</span>
            </span>
          ))}
        </div>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'0 40px' }}>

        {/* WHAT / ISN'T */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:0, border:'1.5px solid #1A1714', borderRadius:6, overflow:'hidden', marginBottom:48 }}>
          <div style={{ padding:32, borderRight:'1.5px solid #1A1714' }}>
            <div style={{ ...mono, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8A847A', marginBottom:12 }}>What it is</div>
            <p style={{ fontSize:15, lineHeight:1.75, color:'#3D3830', fontWeight:300 }}>
              A satirical AI tool that decodes corporate jargon and generates LinkedIn-speak from plain English.
              Built for entertainment, commentary, and the specific catharsis of watching{' '}
              <strong style={{ color:'#1A1714', fontWeight:500 }}>"synergy"</strong> get called out in public.
            </p>
          </div>
          <div style={{ padding:32, background:'#1A1714' }}>
            <div style={{ ...mono, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8A847A', marginBottom:12 }}>What it isn't</div>
            <p style={{ fontSize:15, lineHeight:1.75, color:'#EDE8DE', fontWeight:300 }}>
              Career advice. Affiliated with LinkedIn. A reason to use the word "ecosystem" in a sentence.
              The outputs are jokes. Post them at your own risk.
              We accept no liability for your professional reputation.
            </p>
          </div>
        </div>

        {/* HOW IT WORKS */}
        <div style={{ marginBottom:48 }}>
          <div style={{ ...mono, fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'#8A847A', marginBottom:20 }}>How it works</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:24 }}>
            {[
              { n:'01', title:'Paste the offense', body:'Drop any LinkedIn post. The more jargon the better the result.', accent:'#F0B429' },
              { n:'02', title:'Set severity', body:'Diplomatic to Obliterate. You decide how much truth you can handle.', accent:'#D4CFC8' },
              { n:'03', title:'Expose it', body:'Copy, download the share card, post it somewhere ironic.', accent:'#D4CFC8' },
            ].map(({ n, title, body, accent }) => (
              <div key={n} style={{ borderTop:`3px solid ${accent}`, paddingTop:16 }}>
                <div style={{ ...syne, fontWeight:800, fontSize:40, color:'#1A1714', lineHeight:1, marginBottom:10 }}>{n}</div>
                <div style={{ fontSize:14, fontWeight:500, color:'#1A1714', marginBottom:6 }}>{title}</div>
                <div style={{ fontSize:13, color:'#6B6560', lineHeight:1.65, fontWeight:300 }}>{body}</div>
              </div>
            ))}
          </div>
        </div>

        <hr style={{ border:'none', borderTop:'1.5px solid #D4CFC8', margin:'0 0 40px' }} />

        {/* CTA */}
        <div style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:36, background:'#F0B429', borderRadius:6, marginBottom:48, gap:24, flexWrap:'wrap',
        }}>
          <div>
            <div style={{ ...syne, fontWeight:800, fontSize:26, color:'#1A1714', letterSpacing:'-0.03em', marginBottom:4 }}>Ready to expose something?</div>
            <div style={{ fontSize:14, color:'#3D3830', fontWeight:300 }}>142,804 buzzwords autopsied and counting.</div>
          </div>
          <Link href="/" style={{
            ...mono, fontSize:12, background:'#1A1714', color:'#F5F0E8',
            padding:'14px 24px', borderRadius:3, textDecoration:'none', whiteSpace:'nowrap',
          }}>Begin the autopsy →</Link>
        </div>

        <div style={{ ...mono, fontSize:10, color:'#A8A39D', textAlign:'center', paddingBottom:40 }}>
          Not affiliated with LinkedIn® or Microsoft. BullShift is satire. · bullshift.app
        </div>
      </div>

      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}
