import { NavLink, Link } from "react-router-dom";

const items: { to: string; label: string }[] = [
  { to: "/", label: "home" },
  { to: "/career", label: "career" },
  { to: "/projects", label: "projects" },
  { to: "/writing", label: "writing" },
  { to: "/speaking", label: "speaking" },
  { to: "/hobbies", label: "hobbies" },
];

export default function Nav() {
  return (
    <nav className="top-nav" aria-label="Primary">
      <div className="top-nav-inner">
        <Link to="/" className="brand">Eugene Vestel</Link>
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
      </div>
    </nav>
  );
}
