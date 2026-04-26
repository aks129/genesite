import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";
import About from "./components/About";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
        <About />
      </main>
    </>
  );
}
