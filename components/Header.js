import Link from "next/link";

export default function Header() {
  return (
    <header className="nav" id="nav">
      <div className="nav-in">
        <Link className="logo" href="/">
          <img src="/logo.png" alt="" width="28" height="28" />
          <b>BullShift</b>
        </Link>
        <nav aria-label="Primary">
          <a href="#how">How it works</a>
          <a href="#levels">Five levels</a>
          <a href="#bullpen">The Bullpen</a>
          <a href="#faq">FAQ</a>
        </nav>
        <span className="free">Free. No sign-up.</span>
      </div>
    </header>
  );
}
