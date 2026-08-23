import "./Bingo.css";
import bingoBg from "../assets/bingo-bg.png";
import bingoMascot from "../assets/bingo-mascot.png";

export default function Bingo() {
  return (
    <section className="bingo" id="bingo">
      <img src={bingoBg} alt="" className="bingo__bg-img" aria-hidden="true" />
      <div className="bingo__duotone" aria-hidden="true" />
      <div className="bingo__grain" aria-hidden="true" />
      <div className="bingo__vignette" aria-hidden="true" />

      <div className="wrap bingo__wrap">
        <img
          src={bingoMascot}
          alt=""
          className="bingo__mascot"
          aria-hidden="true"
        />
        <div className="bingo__pin" aria-hidden="true" />
        <div className="bingo__poster">
          <svg
            className="bingo__poster-grid"
            viewBox="0 0 600 600"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <text x="300" y="52" textAnchor="middle" className="bingo__grid-letters">
              B&#160;&#160;&#160;I&#160;&#160;&#160;N&#160;&#160;&#160;G&#160;&#160;&#160;O
            </text>
            <g className="bingo__grid-lines">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={`v${i}`} x1={70 + i * 92} y1="90" x2={70 + i * 92} y2="550" />
              ))}
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <line key={`h${i}`} x1="70" y1={90 + i * 92} x2="530" y2={90 + i * 92} />
              ))}
            </g>
            <text x="300" y="345" textAnchor="middle" className="bingo__grid-star">
              &#9733;
            </text>
          </svg>

          <p className="bingo__eyebrow">Sundays &middot; 6pm</p>
          <h2 className="bingo__title">Bohemia Bingo</h2>
          <p className="bingo__copy">
            Need Sunday plans? Make Bohemia Bingo the highlight of your weekend. It’s chaotic, it’s loud, it’s the best way to end your weekend.
            It’s more than just numbers. It’s trivia. It’s competitions. But most of all, it’s a ton of free chocolate shots.
          </p>
          <a className="btn btn-solid" href="tel:+27210071219">
            Call Bohemia
          </a>
        </div>
      </div>
    </section>
  );
}