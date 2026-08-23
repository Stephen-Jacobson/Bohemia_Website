import "./Gigs.css";
import GIGS from "../data/gigs.json";

// Event data lives in src/data/gigs.json, which is regenerated at build
// time by scripts/fetch-gigs.mjs (scraping Bohemia's Quicket organiser
// page — see that script for why this can't happen live in the browser).
// The card list below is driven entirely by that array's length, so
// however many events Quicket has live at build time, that many cards
// render here automatically.

export default function Gigs() {
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

        <div className="gigs__scroller">
          <div className="gigs__track">
            {GIGS.map((g, i) => (
              <a
                className="gig-card"
                href={g.href}
                target="_blank"
                rel="noreferrer"
                key={g.title}
                style={{ "--i": i }}
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