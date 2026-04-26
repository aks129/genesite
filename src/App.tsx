import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";
import About from "./components/About";
import Projects from "./components/Projects";
import Passions from "./components/Passions";
import Travels from "./components/Travels";
import Contact from "./components/Contact";
import Socials from "./components/Socials";
import Footer from "./components/Footer";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
        <About />
        <Projects />
        <Passions />
        <Travels />
        <Contact />
        <Socials />
        <Footer />
      </main>
    </>
  );
}
