import WindBackground from "./components/WindBackground";
import Hero from "./components/Hero";

export default function App() {
  return (
    <>
      <WindBackground />
      <main className="page">
        <Hero />
      </main>
    </>
  );
}
