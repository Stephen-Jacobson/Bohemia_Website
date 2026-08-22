import "./Gigs.css";

const GIGS = [
  {
    tag: "Next up",
    date: "Thu 30 Apr",
    title: "Bohemia Rumble",
    bands: "Black Math · Man Motels · Cistamatic · Under Arrest",
    detail: "Happy hour 18:00–20:00, thanks to Stella Artois. Tickets R100.",
    href: "https://www.quicket.co.za/events/368090-bohemia-rumble-black-math-man-motels-cistamatic-under-arrest-live-at-bohemia-st/",
    cta: "Get Tickets",
  },
  {
    tag: "Weekly",
    date: "Every Thursday",
    title: "Rock Night",
    bands: "Local & touring bands on the Bohemia stage",
    detail: "Doors open early, floor clears out late. Line-up drops on Instagram.",
    href: "https://www.instagram.com/bohemia_stb/?hl=en",
    cta: "Check Line-up",
  },
];

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

        <div className="gigs__list">
          {GIGS.map((g, i) => (
            <a
              className="gig-card"
              href={g.href}
              target="_blank"
              rel="noreferrer"
              key={g.title}
              style={{ "--i": i }}
            >
              <span className="gig-card__tag">{g.tag}</span>
              <span className="gig-card__date">{g.date}</span>
              <h3 className="gig-card__title">{g.title}</h3>
              <p className="gig-card__bands">{g.bands}</p>
              <p className="gig-card__detail">{g.detail}</p>
              <span className="gig-card__cta">
                {g.cta} <span aria-hidden="true">&rarr;</span>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
