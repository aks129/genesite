export type Platform = { label: string; href: string };

export type Writing = {
  name: string;
  kind: "newsletter" | "podcast";
  href: string;
  tagline: string;
  description: string;
  platforms?: Platform[];
};

export const writings: Writing[] = [
  {
    name: "FHIR IQ Playbook",
    kind: "newsletter",
    href: "https://evestel.substack.com/",
    tagline: "A Substack for people doing the actual FHIR work.",
    description:
      "Weekly issues on FHIR implementation, healthcare AI, and what agents change about the stack. Written for engineers, product leads, and the standards community.",
    platforms: [
      { label: "Subscribe on Substack", href: "https://evestel.substack.com/subscribe" },
      { label: "Read the archive", href: "https://evestel.substack.com/archive" },
    ],
  },
  {
    name: "Out of the FHIR",
    kind: "podcast",
    href: "https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU",
    tagline: "Stories behind the standards.",
    description:
      "Conversations with HL7 work-group chairs, founders, and CMS policy makers about how interoperability gets built in practice.",
    platforms: [
      { label: "Spotify", href: "https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU" },
      { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/out-of-the-fhir-podcast/id1822845248" },
      { label: "YouTube", href: "https://www.youtube.com/@OutoftheFHIRPodcast" },
      { label: "Substack", href: "https://evestel.substack.com/" },
    ],
  },
];

export type RecentItem = {
  date: string;   // e.g. "Jul 2026"
  title: string;
  href: string;
};

/** Most recent issues/episodes, newest first. Refresh occasionally from
 *  https://evestel.substack.com/feed — keep to ~6 entries. */
export const recentItems: RecentItem[] = [
  {
    date: "Jul 2026",
    title: "Is TEFCA a Bridge to Nowhere? Why the National Health Network Could Collapse Under Success",
    href: "https://evestel.substack.com/p/is-tefca-a-bridge-to-nowhere-why",
  },
  {
    date: "Jul 2026",
    title: "Fear of New Tools",
    href: "https://evestel.substack.com/p/fear-of-new-tools",
  },
  {
    date: "Jul 2026",
    title: "The Illusion of Interoperability: Why Healthcare is Broken (and How FHIR APIs can Fix It)",
    href: "https://evestel.substack.com/p/the-illusion-of-interoperability",
  },
  {
    date: "Jul 2026",
    title: "An AI Found a Clinically Dangerous Bug in the Code Another AI Helped Write",
    href: "https://evestel.substack.com/p/an-ai-found-a-clinically-dangerous",
  },
  {
    date: "Jun 2026",
    title: "HL7 FHIR DevDays 2026: A Conference Where Everyone's Building Something, Not Selling You Anything",
    href: "https://evestel.substack.com/p/hl7-fhir-devdays-2026-a-conference",
  },
  {
    date: "Jun 2026",
    title: "Killing the Clipboard: Building an Autonomous Healthcare Agent in 5 Minutes",
    href: "https://evestel.substack.com/p/killing-the-clipboard-building-an",
  },
];
