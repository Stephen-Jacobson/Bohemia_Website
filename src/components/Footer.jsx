import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__mark">
          BOHEMI<span>A</span>
        </div>

        <div className="footer__links">
          <a href="https://www.instagram.com/bohemia_stb/?hl=en" target="_blank" rel="noreferrer">
            Instagram
          </a>
          <a href="https://www.facebook.com/bohemiaSTB/" target="_blank" rel="noreferrer">
            Facebook
          </a>
          <a href="https://www.tiktok.com/@bohemia.stellenbosch" target="_blank" rel="noreferrer">
            TikTok
          </a>
        </div>

        <p className="footer__fine">
          1 Victoria St, Stellenbosch &middot; Strictly 18+
        </p>
      </div>
    </footer>
  );
}
