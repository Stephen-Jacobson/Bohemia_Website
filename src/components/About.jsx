import "./About.css";
import liveShot from "../assets/live-shot.png";

export default function About() {
  return (
    <section className="showcase" id="about">
      <p className="eyebrow showcase__eyebrow wrap">Boho's After Dark</p>

      <div className="showcase__frame">
        <img src={liveShot} alt="" className="showcase__img" aria-hidden="true" />
        <div className="showcase__duotone" aria-hidden="true" />
        <div className="showcase__grain" aria-hidden="true" />
        <div className="showcase__vignette" aria-hidden="true" />

        <p className="showcase__credit">Victoria St, Stellenbosch</p>
      </div>
    </section>
  );
}
