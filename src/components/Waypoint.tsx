import { useLocation } from "react-router-dom";
import { waypointFor, isFilmRoute } from "../world/timeline";
import { useWorldEnabled } from "../world/useWorldEnabled";

/**
 * Wayfinding for the page head: which room of the house this tab is, and how
 * far along the flight it sits. Only shown when the world is actually running —
 * without the footage behind it, "the boardwalk" is a label for nothing.
 */
export default function Waypoint() {
  const enabled = useWorldEnabled();
  const { pathname } = useLocation();
  if (!enabled || isFilmRoute(pathname)) return null;
  const wp = waypointFor(pathname);
  return (
    <p className="waypoint">
      <span className="waypoint-caret" aria-hidden="true">▸</span>
      {wp.place}
      <span
        className="waypoint-map"
        aria-hidden="true"
        style={{ ["--u" as string]: `${(wp.u * 100).toFixed(1)}%` }}
      />
    </p>
  );
}
