export type Travel = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

// Intrinsic dimensions are required to prevent layout shift.
// Update the list once you drop your selected favorites into public/travels/.
// To get dimensions: `sips -g pixelWidth -g pixelHeight public/travels/01.jpg`
export const travels: Travel[] = [
  { src: "/travels/01.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/02.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/03.jpg", alt: "Work travel — placeholder", width: 1067, height: 1600 },
  { src: "/travels/04.jpg", alt: "Work travel — placeholder", width: 1600, height: 1067 },
  { src: "/travels/05.jpg", alt: "Work travel — placeholder", width: 1600, height: 900 },
  { src: "/travels/06.jpg", alt: "Work travel — placeholder", width: 1067, height: 1600 },
];

export const ALBUM_URL = "https://photos.app.goo.gl/REpyEw2T14UsGcju8";
