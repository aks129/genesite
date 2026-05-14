import { useState, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { career, cityCoords, type CareerRole } from "../data/career";

/**
 * Interactive Gantt-style chart of career roles across years.
 * Each role is a horizontal bar on its own row; x-axis is years.
 * Hover or focus a bar to see the role detail in the panel below.
 */

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const CURRENT_YEAR = new Date().getFullYear() + (new Date().getMonth() / 12);

function yearOf(s: string): number {
  if (s.toLowerCase() === "present") return CURRENT_YEAR;
  const monthYear = s.match(/^([A-Za-z]+)\s+(\d{4})$/);
  if (monthYear) {
    const month = MONTHS[monthYear[1]] ?? 0;
    return parseInt(monthYear[2], 10) + month / 12;
  }
  const yearOnly = s.match(/(\d{4})/);
  return yearOnly ? parseInt(yearOnly[1], 10) : CURRENT_YEAR;
}

// Layout constants
const LEFT_PAD = 18;
const RIGHT_PAD = 18;
const TOP_PAD = 42;
const BOTTOM_PAD = 12;
const ROW_HEIGHT = 28;
const BAR_HEIGHT = 18;
const VIEWBOX_W = 1000;

const CITY_LABEL: Record<keyof typeof cityCoords, string> = {
  NYC: "NYC",
  NJ:  "NJ",
  PGH: "PGH",
};

export default function CareerChart() {
  const reduce = useReducedMotion();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const { rows, minYear, maxYear, viewBoxH } = useMemo(() => {
    const r = career.map((role, i) => ({
      ...role,
      idx: i,
      startYear: yearOf(role.start),
      endYear: yearOf(role.end),
    }));
    const sorted = [...r].sort((a, b) => a.startYear - b.startYear);
    const minY = Math.floor(Math.min(...r.map(x => x.startYear)));
    const maxY = Math.ceil(Math.max(...r.map(x => x.endYear)));
    const h = TOP_PAD + sorted.length * ROW_HEIGHT + BOTTOM_PAD;
    return { rows: sorted, minYear: minY, maxYear: maxY, viewBoxH: h };
  }, []);

  const chartLeft = LEFT_PAD;
  const chartRight = VIEWBOX_W - RIGHT_PAD;
  const chartWidth = chartRight - chartLeft;
  const yearRange = maxYear - minYear;
  const xFor = (year: number) => chartLeft + ((year - minYear) / yearRange) * chartWidth;

  // Year tick markers — every 4 years
  const ticks: number[] = [];
  for (let y = minYear; y <= maxYear; y += 4) ticks.push(y);
  if (ticks[ticks.length - 1] !== maxYear) ticks.push(maxYear);

  const active = hoveredIdx !== null ? rows.find(r => r.idx === hoveredIdx) : null;

  return (
    <div className="career-chart-wrap">
      <div className="career-chart-head">
        <h3 className="career-chart-title">Each company, by year.</h3>
        <p className="career-chart-hint">Hover or tap a bar for detail.</p>
      </div>

      <svg
        viewBox={`0 0 ${VIEWBOX_W} ${viewBoxH}`}
        className="career-chart"
        role="img"
        aria-label="Career timeline chart from 2002 to present"
      >
        {/* Year grid lines */}
        {ticks.map(t => (
          <g key={t}>
            <line
              x1={xFor(t)}
              y1={TOP_PAD - 6}
              x2={xFor(t)}
              y2={viewBoxH - BOTTOM_PAD}
              stroke="#E5E5E5"
              strokeWidth="1"
              shapeRendering="crispEdges"
            />
            <text
              x={xFor(t)}
              y={TOP_PAD - 14}
              textAnchor="middle"
              fontSize="13"
              fontFamily='"Newsreader", serif'
              fill="#6B6B6B"
            >
              {t}
            </text>
          </g>
        ))}

        {/* Bottom rule */}
        <line
          x1={chartLeft}
          y1={viewBoxH - BOTTOM_PAD}
          x2={chartRight}
          y2={viewBoxH - BOTTOM_PAD}
          stroke="#0A0A0A"
          strokeWidth="1.2"
          shapeRendering="crispEdges"
        />

        {/* Role bars */}
        {rows.map((role, rowIdx) => {
          const y = TOP_PAD + rowIdx * ROW_HEIGHT + (ROW_HEIGHT - BAR_HEIGHT) / 2;
          const x = xFor(role.startYear);
          const w = Math.max(6, xFor(role.endYear) - x);
          const isActive = hoveredIdx === role.idx;
          const isDim = hoveredIdx !== null && !isActive;
          const label = role.org.length > 28 ? role.org.slice(0, 26) + "…" : role.org;

          return (
            <g
              key={role.idx}
              onMouseEnter={() => setHoveredIdx(role.idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onFocus={() => setHoveredIdx(role.idx)}
              onBlur={() => setHoveredIdx(null)}
              tabIndex={0}
              role="button"
              aria-label={`${role.role} at ${role.org}, ${role.start} to ${role.end}, ${cityCoords[role.city].label}`}
              style={{ cursor: "pointer", outline: "none" }}
              className="career-bar-group"
            >
              <motion.rect
                x={x}
                y={y}
                width={w}
                height={BAR_HEIGHT}
                fill={isActive ? "#0A0A0A" : isDim ? "#C9C9C9" : "#0A0A0A"}
                rx="2"
                initial={reduce ? { scaleX: 1 } : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={reduce ? { duration: 0 } : { duration: 0.6, delay: rowIdx * 0.05, ease: "easeOut" }}
                style={{ transformOrigin: `${x}px ${y}px`, opacity: isDim ? 0.5 : 1, transition: "opacity 180ms ease, fill 180ms ease" }}
              />
              {/* Org name inside or beside the bar */}
              {w > 90 ? (
                <text
                  x={x + 8}
                  y={y + BAR_HEIGHT / 2 + 4}
                  fontSize="11"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="#FFFFFF"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              ) : (
                <text
                  x={x + w + 6}
                  y={y + BAR_HEIGHT / 2 + 4}
                  fontSize="11"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fill="#0A0A0A"
                  style={{ pointerEvents: "none" }}
                >
                  {label}
                </text>
              )}
              {/* City badge dot at left edge of row */}
              <circle
                cx={chartLeft - 8}
                cy={y + BAR_HEIGHT / 2}
                r="3"
                fill={role.city === "NYC" ? "#0A0A0A" : role.city === "NJ" ? "#6B6B6B" : "#FFFFFF"}
                stroke="#0A0A0A"
                strokeWidth="1"
              />
            </g>
          );
        })}
      </svg>

      <div className="career-chart-legend" aria-hidden="true">
        <span><span className="dot dot-nyc" /> NYC</span>
        <span><span className="dot dot-nj" /> New Jersey</span>
        <span><span className="dot dot-pgh" /> Pittsburgh</span>
      </div>

      <div className="career-chart-panel" aria-live="polite">
        {active ? (
          <RoleDetail role={active} />
        ) : (
          <p className="chart-panel-empty">Hover a bar to see the role.</p>
        )}
      </div>
    </div>
  );
}

function RoleDetail({ role }: { role: CareerRole }) {
  return (
    <div className="role-detail">
      <div className="role-detail-when">
        <span className="role-detail-years">{role.start} → {role.end}</span>
        <span className="role-detail-city">{cityCoords[role.city].label}</span>
        <span className="role-detail-citycode">{CITY_LABEL[role.city]}</span>
      </div>
      <div className="role-detail-what">
        <div className="role-detail-role">{role.role}</div>
        <div className="role-detail-org">{role.org}</div>
        {role.note && <p className="role-detail-note">{role.note}</p>}
      </div>
    </div>
  );
}
