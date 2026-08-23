import "./Specials.css";

const SPECIALS = [
  {
    time: "16:00 – 19:00, daily",
    name: "Happy Hour",
    detail: "Discounted drinks every night of the week.",
  },
  {
    time: "11:00 – 16:00, daily",
    name: "Lunch Special",
    detail: "R100 - 2x Beef Burgers.\n R50 - Chicken Strips and Chips.",
  },
  {
    time: "Sundays",
    name: "Pizza Special",
    detail: "R85 - Delicious discounted pizza. A Stellenbosch Favourite",
  },
];

export default function Specials() {
  return (
    <section className="specials" id="menu">
      <div className="wrap">
        <p className="eyebrow">Eat &amp; Drink</p>
        <h2 className="specials__heading">Specials &amp; Happy Hour</h2>

        <div className="specials__list">
          {SPECIALS.map((s) => (
            <div className="specials__row" key={s.name}>
              <span className="specials__time">{s.time}</span>
              <div className="specials__row-copy">
                <h3>{s.name}</h3>
                <p style={{ whiteSpace: "pre-line" }}>{s.detail}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="specials__foot">
          Regulars come back for the pizza and the chicken strips &amp;
          chips. Specials change from time to time &mdash; check the board
          when you're in, or ask your waiter what's running tonight.
        </p>
      </div>
    </section>
  );
}
