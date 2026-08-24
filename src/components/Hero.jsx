import "./Hero.css";
import crowdBg from "../assets/crowd-bg.png";

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div
        className="hero__bg"
        style={{ backgroundImage: `url(${crowdBg})` }}
        aria-hidden="true"
      />
      <div className="hero__scrim" aria-hidden="true" />

      <div className="hero__content wrap">
        <p className="eyebrow hero__eyebrow">1 Victoria St · Stellenbosch</p>

        <h1 className="hero__title">
          <span className="hero__title-line">STELLENBOSCH'S</span>
          <span className="hero__title-line hero__title-line--big">
            BOHEMI<em>A</em>
          </span>
        </h1>

        <p className="hero__est">Est. 2001</p>

        <p className="hero__sub">
          Bar. Restaurant. Live bands. Wood-fired pizza. Specials. Bingo every Sunday
          at 6pm.
        </p>

        <div className="hero__actions">
          <a href="#gigs" className="btn btn-solid">
            See What's On
          </a>
          <a href="tel:+27210071219" className="btn">
            Book a Table
          </a>
        </div>

        <p className="hero__note">Strictly 18+ &middot; Open till late every night</p>
      </div>

      {/* <div className="hero__scroll" aria-hidden="true">
        <span />
        SCROLL
      </div> */}
    </section>
  );
}