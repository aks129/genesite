/*
 * The radio.
 *
 * Stations are YouTube rather than Spotify for one practical reason: a Spotify
 * embed only plays 30-second previews unless the listener happens to be signed
 * in to Spotify in that browser, which is not a radio. YouTube plays in full
 * for everyone, with no account.
 *
 * Every station carries `href` as well as `video`, so an embed that a channel
 * has disabled, geo-blocked, or taken down degrades to a working link out
 * rather than a dead panel. Channels are credited by name — this is somebody
 * else's stream, playing in Gene's house.
 *
 * Every id below was played in a real browser, inside a real embedding page,
 * and confirmed to reach the player rather than an error screen. That check
 * matters more than it sounds: oEmbed happily returns 200 for a stream that has
 * ended, and the first draft of this list shipped Lofi Girl's famous
 * `jfKfPfyJRdk`, which resolves fine and then plays "This live stream recording
 * is not available" — the stream was taken down in May 2026. An embed loaded as
 * a top-level page always errors too, so it has to be tested embedded.
 *
 * Two of these four are live streams, and live streams die. If a station goes
 * quiet, swap `video` here and nothing else changes; the "open on YouTube" link
 * in the dock means a dead embed degrades to a working link rather than a dead
 * panel, because the page cannot detect the failure cross-origin.
 */

export type Station = {
  /** what it is called on the dial */
  name: string;
  /** one line, lowercase, in the site's voice */
  blurb: string;
  /** YouTube video id */
  video: string;
  /** the channel this belongs to, credited on the dial */
  channel: string;
  /** the real YouTube title, so a swap can be sanity-checked later */
  source: string;
  /** a finite mix loops; a 24/7 stream does not need to */
  loop?: boolean;
};

export const stations: Station[] = [
  {
    name: "rain on the ridge",
    blurb: "wet forest, no melody in the way",
    video: "RAK1ka_M98g",
    channel: "FOCUS 365 studio",
    source: "Deep Focus Music 24/7 LIVE ~ Rainy Forest Ambience",
  },
  {
    name: "piano and rain",
    blurb: "for the reading corner",
    video: "-5ajVJ1Yxlg",
    channel: "Soothing Relaxation",
    source: "Rainy Piano Radio — Relaxing Music with Rain Sounds 24/7",
  },
  {
    name: "after hours",
    blurb: "Arnalds, Frahm, Hania Rani",
    video: "t1acwwbjfIk",
    channel: "Laurel Violet",
    source: "Neoclassical at Night ~ 1 hour mix",
    loop: true,
  },
  {
    name: "work light",
    blurb: "minimal grooves, nothing to sing along to",
    video: "MP0M6zS989g",
    channel: "ours.",
    source: "24/7 LIVE Chillout House Mix — Soft Minimal Grooves for Sustained Focus & Stillness",
  },
];

export function watchUrl(s: Station): string {
  return `https://www.youtube.com/watch?v=${s.video}`;
}

/**
 * Built only when a station is chosen, so the click that picks it is the user
 * gesture that permits unmuted playback.
 */
export function embedUrl(s: Station): string {
  const p = new URLSearchParams({
    autoplay: "1",
    rel: "0",
    modestbranding: "1",
    playsinline: "1",
    // Lets the page tell the player to pause — used when the podcast opens,
    // so two things are never talking at once.
    enablejsapi: "1",
  });
  // A finite mix has to be told to repeat; `loop` needs `playlist` to work on
  // a single video.
  if (s.loop) { p.set("loop", "1"); p.set("playlist", s.video); }
  return `https://www.youtube-nocookie.com/embed/${s.video}?${p}`;
}
