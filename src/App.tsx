import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
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

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <BrowserRouter>
      <WindBackground />
      <Nav />
      <ScrollToTop />
      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/career" element={<CareerPage />} />
          <Route path="/hobbies" element={<HobbiesPage />} />
          <Route path="/writing" element={<WritingPage />} />
          <Route path="/speaking" element={<SpeakingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <LegoGene />
    </BrowserRouter>
  );
}
