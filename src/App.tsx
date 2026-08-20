import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import WindBackground from "./components/WindBackground";
import WorldStage from "./components/WorldStage";
import LegoGene from "./components/LegoGene";
import Nav from "./components/Nav";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import RouteTransition from "./components/RouteTransition";
import PageShell from "./components/PageShell";
import Cursor from "./components/Cursor";
import ScrollProgress from "./components/ScrollProgress";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import CareerPage from "./pages/CareerPage";
import HobbiesPage from "./pages/HobbiesPage";
import WritingPage from "./pages/WritingPage";
import SpeakingPage from "./pages/SpeakingPage";
import ServicesPage from "./pages/ServicesPage";
import { startLenis, stopLenis, jumpToTop } from "./lenis";

const TITLES: Record<string, string> = {
  "/": "Gene Vestel — AI builder · healthcare technology",
  "/career": "Career — Gene Vestel",
  "/expertise": "Expertise — Gene Vestel",
  "/services": "Expertise — Gene Vestel",
  "/projects": "Projects — Gene Vestel",
  "/writing": "Podcast + Writing — Gene Vestel",
  "/speaking": "Speaking — Gene Vestel",
  "/hobbies": "Off Hours — Gene Vestel",
};

function RouteTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? TITLES["/"];
  }, [pathname]);
  return null;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    jumpToTop();
  }, [pathname]);
  return null;
}

function SmoothScroll() {
  const reduce = useReducedMotion();
  useEffect(() => {
    if (reduce) return;
    startLenis();
    return stopLenis;
  }, [reduce]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <WindBackground />
      <WorldStage />
      <Nav />
      <SmoothScroll />
      <ScrollToTop />
      <RouteTitle />
      <RouteTransition />
      <ScrollProgress />
      <Cursor />
      <main className="page">
        <PageShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/hobbies" element={<HobbiesPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/expertise" element={<ServicesPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
        </PageShell>
        <Contact />
        <Footer />
      </main>
      <LegoGene />
    </BrowserRouter>
  );
}
