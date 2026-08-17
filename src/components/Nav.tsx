import { NavLink, Link } from "react-router-dom";
import { useMagnetic } from "../hooks/useMagnetic";

const items: { to: string; label: string }[] = [
  { to: "/", label: "home" },
  { to: "/career", label: "career" },
  { to: "/expertise", label: "expertise" },
  { to: "/projects", label: "projects" },
  { to: "/writing", label: "podcast + writing" },
  { to: "/speaking", label: "speaking" },
  { to: "/hobbies", label: "hobbies" },
];

export default function Nav() {
  const magLi = useMagnetic(0.2, 6);
  const magCv = useMagnetic(0.2, 6);
  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav-inner">
        <Link to="/" className="brand">Gene</Link>
        <ul>
          {items.map(({ to, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-actions">
          <a
            className="nav-action magnetic"
            href="https://linkedin.com/in/evestel"
            target="_blank"
            rel="noopener noreferrer"
            {...magLi}
          >
            LinkedIn ↗
          </a>
          <a
            className="nav-action nav-action-solid magnetic"
            href="/Eugene-Vestel-CV.pdf"
            download
            {...magCv}
          >
            CV ↓
          </a>
        </div>
      </div>
    </nav>
  );
}
