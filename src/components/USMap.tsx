import { motion, useReducedMotion } from "framer-motion";
import { cityCoords, type City } from "../data/career";

/**
 * Stylized, hand-drawn-feeling SVG of the U.S. East with three pinned cities
 * (NYC, NJ, Pittsburgh) and a dotted path connecting them in journey order.
 *
 * `activeCity` highlights one pin (used when hovering a career card).
 */
type Props = {
  activeCity?: City | null;
  onCityHover?: (city: City | null) => void;
};

const PATH_ORDER: City[] = ["NYC", "NJ", "PGH"];

// Viewbox: 800 × 500. cityCoords use normalized 0-1; we multiply by these.
const W = 800;
const H = 500;

// Highly simplified outline of the contiguous U.S., focused on East coast
// detail. Hand-traced; not geographically accurate, intentionally so.
const USA_PATH = `
M 60 240
Q 80 170 140 150
Q 200 130 290 130
Q 360 130 420 110
Q 500 95 560 100
Q 600 105 640 115
Q 680 130 700 150
L 715 170
Q 720 180 725 195
L 720 215
Q 710 230 698 245
L 690 260
Q 680 275 670 280
L 658 290
Q 650 300 642 305
L 628 312
Q 615 318 608 320
L 598 330
Q 590 340 580 348
L 570 360
Q 555 372 540 380
L 525 388
Q 510 395 495 398
L 480 402
L 460 405
L 440 405
L 420 402
L 400 400
L 380 395
L 360 385
L 340 380
L 320 380
L 300 385
L 280 395
L 265 400
L 250 400
L 230 395
L 210 388
L 190 380
L 170 370
L 150 358
L 132 345
L 115 330
L 100 312
L 88 295
L 78 278
L 70 260 Z
`;

export default function USMap({ activeCity = null, onCityHover }: Props) {
  const reduce = useReducedMotion();

  const points = PATH_ORDER.map(c => {
    const { x, y } = cityCoords[c];
    return { x: x * W, y: y * H, city: c };
  });

  // Smooth path through the three points
  const pathD = `M ${points[0].x} ${points[0].y} ` +
    `Q ${(points[0].x + points[1].x) / 2 - 20} ${(points[0].y + points[1].y) / 2 - 10}, ${points[1].x} ${points[1].y} ` +
    `Q ${(points[1].x + points[2].x) / 2 + 20} ${(points[1].y + points[2].y) / 2 + 30}, ${points[2].x} ${points[2].y}`;

  return (
    <figure className="us-map" aria-label="Career journey map: New York City to New Jersey to Pittsburgh">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
      >
        {/* Subtle dotted-paper background grid */}
        <defs>
          <pattern id="paper-dots" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="0.6" fill="#E0DED7" />
          </pattern>
        </defs>
        <rect x="0" y="0" width={W} height={H} fill="url(#paper-dots)" />

        {/* USA outline — hand-traced, ink stroke */}
        <path
          d={USA_PATH}
          fill="#FDFCF9"
          stroke="#0A0A0A"
          strokeWidth="1.4"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Connecting journey path (dotted) */}
        <motion.path
          d={pathD}
          fill="none"
          stroke="#0A0A0A"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2 8"
          initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut", delay: 0.4 }}
        />

        {/* City pins */}
        {points.map(({ x, y, city }, i) => {
          const isActive = activeCity === city;
          const { label } = cityCoords[city];
          return (
            <g
              key={city}
              transform={`translate(${x}, ${y})`}
              onMouseEnter={() => onCityHover?.(city)}
              onMouseLeave={() => onCityHover?.(null)}
              style={{ cursor: "pointer" }}
            >
              <motion.circle
                r={isActive ? 11 : 7}
                fill="#0A0A0A"
                stroke="#FFFFFF"
                strokeWidth="2"
                initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.3, type: "spring", stiffness: 220, damping: 12 }}
              />
              {isActive && !reduce && (
                <motion.circle
                  r={7}
                  fill="none"
                  stroke="#0A0A0A"
                  strokeWidth="1"
                  initial={{ scale: 1, opacity: 0.6 }}
                  animate={{ scale: 2.4, opacity: 0 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeOut" }}
                />
              )}
              <text
                x="0"
                y={city === "NJ" ? 26 : -16}
                textAnchor="middle"
                fontSize="14"
                fontFamily='"Newsreader", serif'
                fontWeight="600"
                fill="#0A0A0A"
                style={{ pointerEvents: "none" }}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption className="us-map-caption">
        Brooklyn → New Jersey → Pittsburgh. Two decades, one continent's worth
        of pharmacies, payers, providers, and platforms.
      </figcaption>
    </figure>
  );
}
