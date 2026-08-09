import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useReducedMotion } from "framer-motion";
import WindBackground from "./components/WindBackground";
import LegoGene from "./components/LegoGene";
import Nav from "./components/Nav";
import Home from "./pages/Home";
import ProjectsPage from "./pages/ProjectsPage";
import CareerPage from "./pages/CareerPage";
import HobbiesPage from "./pages/HobbiesPage";
import WritingPage from "./pages/WritingPage";
import SpeakingPage from "./pages/SpeakingPage";
import ServicesPage from "./pages/ServicesPage";
import { startLenis, stopLenis, jumpToTop } from "./lenis";

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
      <Nav />
      <SmoothScroll />
      <ScrollToTop />
      <main className="page">
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
      </main>
      <LegoGene />
    </BrowserRouter>
  );
}
