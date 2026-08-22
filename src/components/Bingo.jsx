import "./Bingo.css";
import bingoBg from "../assets/bingo-bg.png";

export default function Bingo() {
  return (
    <section className="bingo" id="bingo">
      <img src={bingoBg} alt="" className="bingo__bg-img" aria-hidden="true" />
      <div className="bingo__duotone" aria-hidden="true" />
      <div className="bingo__grain" aria-hidden="true" />
      <div className="bingo__vignette" aria-hidden="true" />

      <div className="wrap bingo__wrap">
        <div className="bingo__pin" aria-hidden="true" />
        <div className="bingo__poster">
          <p className="bingo__eyebrow">Sundays &middot; 6pm</p>
          <h2 className="bingo__title">Bohemia Bingo</h2>
          <p className="bingo__copy">
            Same Boho's crowd, just with a bingo card in hand. Cheap drinks,
            decent prizes, kicks off 6pm sharp &mdash; get there early for a
            seat.
          </p>
          <a className="btn btn-solid" href="tel:+27210071219">
            Call Bohemia
          </a>
        </div>
      </div>
    </section>
  );
}