import "./Specials.css";

const SPECIALS = [
  {
    time: "19:00 – 21:00, daily",
    name: "Happy Hour",
    detail: "Discounted drinks every night of the week.",
  },
  {
    time: "11:00–17:00 Mon–Sat · 12:00–17:00 Sun",
    name: "Lunch Special",
    detail: "Discounted food off the lunch menu, every day.",
  },
  {
    time: "Sundays",
    name: "Pizza Special",
    detail: "Regulars rate this as one of the best-value pizza nights in town.",
  },
  {
    time: "Rotating",
    name: "Buy 1 Get 1 Free Noodle Dishes",
    detail: "Keep an eye on the board — this one comes and goes.",
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
                <p>{s.detail}</p>
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
