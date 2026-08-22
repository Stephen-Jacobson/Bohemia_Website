import "./Location.css";

export default function Location() {
  return (
    <section className="location" id="location">
      <div className="wrap location__grid">
        <div className="location__copy">
          <p className="eyebrow">Find Us</p>
          <h2 className="location__heading">On Victoria Street</h2>

          <div className="location__block">
            <strong>Address</strong>
            <p>1 Victoria Street, Stellenbosch Central, Stellenbosch, 7600</p>
          </div>

          <div className="location__block">
            <strong>Hours</strong>
            <p>Monday &mdash; Sunday, 11:00 &mdash; late</p>
          </div>

          <div className="location__block">
            <strong>Contact</strong>
            <p>
              <a href="tel:+27210071219">+27 21 007 1219</a>
              <br />
              <a href="mailto:info@bohemia.co.za">info@bohemia.co.za</a>
            </p>
          </div>

          <div className="location__actions">
            <a
              className="btn btn-solid"
              href="https://www.google.com/maps/search/?api=1&query=Bohemia+1+Victoria+Street+Stellenbosch"
              target="_blank"
              rel="noreferrer"
            >
              Get Directions
            </a>
            <a
              className="btn"
              href="https://www.instagram.com/bohemia_stb/?hl=en"
              target="_blank"
              rel="noreferrer"
            >
              @bohemia_stb
            </a>
          </div>
        </div>

        <div className="location__map">
          <iframe
            title="Bohemia Stellenbosch map"
            src="https://www.google.com/maps?q=1+Victoria+Street,+Stellenbosch+Central,+Stellenbosch,+7600&output=embed"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
