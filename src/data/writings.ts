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
      "Weekly issues on FHIR implementation, healthcare AI, and the cognitive layer being built above the standards. 550+ subscribers in the first year. Written for engineers, product leads, and the standards community — not for a press release.",
    platforms: [
      { label: "Read on Substack", href: "https://evestel.substack.com/" },
    ],
  },
  {
    name: "Out of the FHIR",
    kind: "podcast",
    href: "https://evestel.substack.com/",
    tagline: "Stories behind the standards.",
    description:
      "Twenty-five episodes in. Conversations with HL7 work-group chairs, founders, and CMS policy makers. We talk about how interoperability actually gets built — and what's coming next as AI agents move closer to clinical systems.",
    platforms: [
      { label: "Spotify", href: "https://open.spotify.com/show/6GBZT7KA1Ug8xMZ4l5LThU" },
      { label: "Apple Podcasts", href: "https://podcasts.apple.com/us/podcast/out-of-the-fhir-podcast/id1822845248" },
      { label: "YouTube", href: "https://www.youtube.com/@OutoftheFHIRPodcast" },
      { label: "Substack", href: "https://evestel.substack.com/" },
    ],
  },
];
