import { useEffect, useRef, useState } from "react";
import "./Gigs.css";
import GIGS from "../data/gigs.json";

// Event data lives in src/data/gigs.json, which is regenerated at build
// time by scripts/fetch-gigs.mjs (scraping Bohemia's Quicket organiser
// page — see that script for why this can't happen live in the browser).
// The card list below is driven entirely by that array's length, so
// however many events Quicket has live at build time, that many cards
// render here automatically.

const DRAG_CLICK_THRESHOLD = 6; // px — beyond this, treat it as a drag, not a click on a card

export default function Gigs() {
  const scrollerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, startScrollLeft: 0, moved: false });

  const handlePointerDown = (e) => {
    // Touch/pen already get native scrolling via overflow-x + touch-action;
    // this is purely to give mouse users click-and-drag scrolling too.
    if (e.pointerType !== "mouse") return;
    const scroller = scrollerRef.current;
    if (!scroller) return;
    dragState.current = {
      startX: e.clientX,
      startScrollLeft: scroller.scrollLeft,
      moved: false,
    };
    setIsDragging(true);
    // Deliberately NOT using setPointerCapture here — capturing the
    // pointer on the scroller causes the browser to redirect the
    // resulting `click` event to the scroller itself instead of the card
    // underneath, which is what was breaking card links. Plain window
    // listeners (below) track the drag just as reliably without that
    // side effect.
  };

  useEffect(() => {
    if (!isDragging) return;

    const handleMove = (e) => {
      const scroller = scrollerRef.current;
      if (!scroller) return;
      const dx = e.clientX - dragState.current.startX;
      if (Math.abs(dx) > DRAG_CLICK_THRESHOLD) dragState.current.moved = true;
      scroller.scrollLeft = dragState.current.startScrollLeft - dx;
    };

    const handleUp = () => setIsDragging(false);

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
    window.addEventListener("blur", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      window.removeEventListener("blur", handleUp);
    };
  }, [isDragging]);

  // Cards are <a> tags — a click fires right after pointerup on the same
  // element, so if the pointer actually moved we swallow that click here
  // rather than letting a drag-release accidentally open a link.
  const handleCardClick = (e) => {
    if (dragState.current.moved) {
      e.preventDefault();
    }
  };

  return (
    <section className="gigs" id="gigs">
      <div className="wrap">
        <div className="gigs__head">
          <div>
            <p className="eyebrow">What's On</p>
            <h2 className="gigs__heading">Live Music</h2>
          </div>
          <a
            className="btn btn-mustard"
            href="https://www.quicket.co.za/organisers/90799-bohemia-stellenbosch"
            target="_blank"
            rel="noreferrer"
          >
            All Events on Quicket
          </a>
        </div>

        {GIGS.length === 0 && (
          <p className="gigs__empty">
            No gigs on the calendar right now. <br></br> Check back soon.
          </p>
        )}

        <div
          className={"gigs__scroller" + (isDragging ? " gigs__scroller--dragging" : "")}
          ref={scrollerRef}
          onPointerDown={handlePointerDown}
        >
          <div className="gigs__track">
            {GIGS.map((g, i) => (
              <a
                className="gig-card"
                href={g.href}
                target="_blank"
                rel="noreferrer"
                key={`${g.title}-${i}`}
                style={{ "--i": i }}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                onClick={handleCardClick}
              >
                {g.image && (
                  <span
                    className="gig-card__bg"
                    style={{ backgroundImage: `url(${g.image})` }}
                    aria-hidden="true"
                  />
                )}
                <span className="gig-card__scrim" aria-hidden="true" />
                <span className="gig-card__content">
                  <span className="gig-card__tag">{g.tag}</span>
                  <span className="gig-card__date">{g.date}</span>
                  <h3 className="gig-card__title">{g.title}</h3>
                  <p className="gig-card__bands">{g.bands}</p>
                  <p className="gig-card__detail">{g.detail}</p>
                  <span className="gig-card__cta">
                    {g.cta} <span aria-hidden="true">&rarr;</span>
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}