import Link from "next/link";

export default function Footer() {
  return (
    <footer className="sheet foot">
      <div className="wrap foot-in">
        <p className="foot-brand">
          <img src="/logo-128.webp" alt="BullShift logo" width="36" height="36" />
          <b>BullShift</b>
        </p>
        <p className="foot-line">Paste the jargon. Get the truth.</p>
        <p className="foot-made">
          Made in Raleigh-Durham, NC <span className="heart" aria-label="with love">&#9829;</span> by{" "}
          <a href="https://asksole.co">Musolé Kambinda</a>
        </p>
        <nav className="foot-links" aria-label="Footer">
          <Link href="/about">About</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/privacy">Privacy</Link>
        </nav>
      </div>
    </footer>
  );
}
