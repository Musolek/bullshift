export default function PrivacyPolicy() {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "40px 20px 60px", fontFamily: "'Source Sans 3', sans-serif", color: "#1a1a1a", lineHeight: 1.75 }}>
      <a href="/" style={{ fontSize: 13, color: "#e65100", textDecoration: "none", fontWeight: 600 }}>&larr; Back to BullShift</a>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginTop: 24, marginBottom: 4 }}>Privacy Policy</h1>
      <p style={{ fontSize: 14, color: "#8b8b8b", marginBottom: 32 }}>Last updated: March 20, 2025</p>
      <p><strong>The short version:</strong> We don&apos;t track you, we don&apos;t store your translations, and we don&apos;t sell anything to anyone.</p>
      <h2 style={h2}>Who we are</h2>
      <p>BullShift is a free, web-based satire tool that translates plain English into LinkedIn-style posts (and vice versa). It is not affiliated with, endorsed by, or connected to LinkedIn Corporation or Microsoft Corporation in any way.</p>
      <h2 style={h2}>What we collect</h2>
      <p><strong>We don&apos;t collect personal information.</strong> No accounts, no sign-ups, no email addresses, no names, no passwords.</p>
      <h2 style={h2}>What happens to the text you type</h2>
      <p>When you hit translate, your text is sent to an AI language model (currently Anthropic&apos;s Claude) to generate the translation. We do not store, log, or save your inputs or outputs. We do not use your inputs to train any AI model. Once the translation appears on your screen, the transaction is complete.</p>
      <p>The AI model provider (Anthropic) has its own data handling practices. See <a href="https://www.anthropic.com/privacy" style={{ color: "#e65100" }}>Anthropic&apos;s privacy policy</a>. Under their API terms, inputs are not used to train their models.</p>
      <h2 style={h2}>Cookies and tracking</h2>
      <p><strong>We don&apos;t use cookies for tracking.</strong> No analytics trackers, no pixel tags, no fingerprinting. We use localStorage in your browser solely to remember your walkthrough completion and community submissions — this data never leaves your device.</p>
      <h2 style={h2}>Third-party hosting</h2>
      <p>The site is hosted on Vercel, which may collect basic server logs. We don&apos;t access or use those logs. See <a href="https://vercel.com/legal/privacy-policy" style={{ color: "#e65100" }}>Vercel&apos;s privacy policy</a>.</p>
      <h2 style={h2}>Children</h2>
      <p>BullShift is not directed at children under 13. We don&apos;t collect information from anyone, including children.</p>
      <h2 style={h2}>Your rights</h2>
      <p>Under GDPR, CCPA, and similar laws, you have rights regarding your personal data. Since we don&apos;t collect or store any, there&apos;s nothing for us to provide, delete, or correct.</p>
      <h2 style={h2}>Changes</h2>
      <p>If we change how we handle data, we&apos;ll update this policy and note the date.</p>
      <h2 style={h2}>Contact</h2>
      <p>Questions? Reach us at: <strong>[your email here]</strong></p>
      <div style={{ marginTop: 40, padding: "16px 20px", background: "#fff3e0", border: "1px solid #ffe0b2", borderRadius: 10, fontSize: 14 }}>
        <strong>Plain-language summary:</strong> You type. The AI translates. It shows up on your screen. Nothing is saved on our end. Nobody is tracked.
      </div>
    </div>
  );
}
var h2 = { fontSize: 20, fontWeight: 700, marginTop: 28, marginBottom: 8 };