/**
 * TV shows and episodes. To add a production, append a show; to add an episode,
 * append to that show's `episodes`. Only add episodes that are actually published.
 */
export type Person = { name: string; role?: string };
export type Episode = {
  number: number;
  title: string;
  youtubeId: string;
  publishedAt?: string; // ISO date, if known
  intro: string[];
  guests: Person[];
  presenter?: string;
  producer?: string;
  director?: string;
  thumbnail?: string; // defaults to the YouTube thumbnail
};
export type CreditGroup = { label: string; people: string[] };
export type TvShow = {
  slug: string;
  title: string;
  presentedBy: string;
  tagline: string;
  description: string[];
  featured?: boolean;
  episodes: Episode[];
  credits: CreditGroup[];
};

export const YOUTUBE_CHANNEL = "https://www.youtube.com/@worldchangersmentalhealthc3036";

export const tvShows: TvShow[] = [
  {
    slug: "gen-x-talks",
    title: "GEN-X TALKS",
    presentedBy: "Rokem4eva",
    tagline: "Breaking the Silence. Changing the Conversation.",
    featured: true,
    description: [
      "In a world that often prioritises physical health over mental health, Gen-X Talks aims to bridge the gap.",
      "Through insightful discussions, expert interviews and personal experiences, the show explores mental health challenges, misconceptions and triumphs.",
      "Our mission is to break the stigma surrounding mental illness, encourage open dialogue and create a platform where meaningful conversations about mental well-being can take place.",
    ],
    episodes: [
      {
        number: 1,
        title: "What Is Mental Health?",
        youtubeId: "qr8JyDdfNRQ",
        intro: [
          "What exactly is mental health, and why does it matter?",
          "In this opening episode, we introduce the fundamentals of mental health through insightful conversations and professional perspectives.",
        ],
        guests: [
          { name: "Wendy Duncan", role: "Child Psychiatry" },
          { name: "Rozanne Myburgh", role: "Drama Therapist" },
          { name: "Cara Downing" },
        ],
        presenter: "Naomi Schauer",
        producer: "Nigel Jeche",
        director: "Nicom Muza",
      },
    ],
    credits: [
      { label: "Director", people: ["Nicom Muza"] },
      { label: "Producer", people: ["Nigel Jeche"] },
      { label: "Presenter", people: ["Naomi Schauer"] },
      { label: "Screenplay", people: ["Tshepiso Maledu"] },
      { label: "Director of Photography", people: ["Nicom Muza"] },
      { label: "Editor / Colourist", people: ["Nicom Muza"] },
      { label: "Visual Effects", people: ["Nicom Muza"] },
      { label: "Sound", people: ["Kaya Rokem4eva"] },
      { label: "Camera Crew", people: ["Don Franco Tafaro", "Artwel Masiya", "Smiles Maungwe"] },
      { label: "Set Designers", people: ["Ewan Schauer", "Nicom Muza", "Naomi Schauer", "Don Franco Tafaro", "Nigel Jeche"] },
    ],
  },
];
