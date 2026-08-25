import "./Footer.css";
import logo from "../assets/bohemia-name.png";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer__inner">
        <div className="footer__brand">
          <img src={logo} alt="Bohemia" className="footer__mark-logo" />
          <p className="footer__est">Est. 2001</p>
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