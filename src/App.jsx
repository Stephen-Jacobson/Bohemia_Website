import Nav from "./components/Nav";
import Hero from "./components/Hero";
import LiquidDivider from "./components/LiquidDivider";
import About from "./components/About";
import Gigs from "./components/Gigs";
import Bingo from "./components/Bingo";
import Specials from "./components/Specials";
import Location from "./components/Location";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <div className="grain-overlay" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <LiquidDivider />
        <About />
        <Gigs />
        <Bingo />
        <Specials />
        <Location />
      </main>
      <Footer />
    </>
  );
}
