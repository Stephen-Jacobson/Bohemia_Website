import { useEffect, useMemo, useState } from "react";
import "./About.css";

// Every image dropped into src/assets/gallery/ is picked up automatically
// (Vite's import.meta.glob scans the folder at build time) — add or
// remove a photo there and the slideshow updates on the next build, no
// code changes needed.
const galleryModules = import.meta.glob("../assets/gallery/*.{jpg,jpeg,png,webp}", {
  eager: true,
  import: "default",
});

const SLIDE_DURATION = 5000;

export default function About() {
  const slides = useMemo(
    () =>
      Object.keys(galleryModules)
        .sort()
        .map((key) => galleryModules[key]),
    []
  );

  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, SLIDE_DURATION);
    return () => clearInterval(id);
  }, [slides.length]);

  return (
    <section className="showcase" id="about">
      <p className="eyebrow showcase__eyebrow wrap">Boho's After Dark</p>

      <div className="showcase__frame">
        {slides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            className={
              "showcase__img" + (i === index ? " showcase__img--active" : "")
            }
            aria-hidden="true"
          />
        ))}
        {/* <div className="showcase__duotone" aria-hidden="true" /> */}
        {/* <div className="showcase__grain" aria-hidden="true" /> */}
        <div className="showcase__vignette" aria-hidden="true" />

        {slides.length > 1 && (
          <div className="showcase__dots" role="tablist" aria-label="Gallery slides">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Show photo ${i + 1}`}
                className={
                  "showcase__dot" + (i === index ? " showcase__dot--active" : "")
                }
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}

        <p className="showcase__credit">Victoria St, Stellenbosch</p>
      </div>
    </section>
  );
}