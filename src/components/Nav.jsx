import { useEffect, useState } from "react";
import "./Nav.css";

const LINKS = [
  { href: "#gigs", label: "Live Music" },
  { href: "#bingo", label: "Bingo" },
  { href: "#menu", label: "Menu" },
  { href: "#location", label: "Find Us" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`nav ${scrolled ? "nav--scrolled" : ""}`}>
      <div className="nav__inner wrap">
        <a href="#top" className="nav__mark">
          BOHEMI<span>A</span>
        </a>

        <nav className="nav__links">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href}>
              {l.label}
            </a>
          ))}
          <a
            className="btn btn-solid nav__cta"
            href="https://www.instagram.com/bohemia_stb/?hl=en"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>
        </nav>

        <button
          className={`nav__burger ${open ? "is-open" : ""}`}
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {open && (
        <div className="nav__mobile">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)}>
              {l.label}
            </a>
          ))}
          <a
            href="https://www.instagram.com/bohemia_stb/?hl=en"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Instagram
          </a>
        </div>
      )}
    </header>
  );
}
