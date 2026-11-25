import type { PublicSample } from "./catalogue-preview";

// This public projection was captured from /v1/public/search on 25 Nov 2026.
export const publishedListing: PublicSample = {
  id: "025c8db1-72f7-4d8f-990f-4b02af6ea1a6",
  title: "Senior Machine Learning Engineer - Messaging Platform",
  company: "Spotify",
  location: "London",
  country_code: null,
  employment_type: "unknown",
  workplace_type: "unknown",
  status: "active",
  first_seen_at: "2026-09-04T12:09:21.552Z",
  last_seen_at: "2026-11-25T01:46:08.995Z",
};
export const employerListingUrl = "https://www.lifeatspotify.com/jobs/senior-machine-learning-engineer-messaging-platform";
export const listingFields = [
  ["title", "Role"], ["company", "Company"], ["location", "Location"],
  ["country_code", "Country"], ["workplace_type", "Work mode"], ["employment_type", "Employment"],
  ["status", "Status"], ["first_seen_at", "First observed"],
] as const;

export function laterListing(samples: PublicSample[]): PublicSample | null {
  const match = samples.find(sample => sample.id === publishedListing.id);
  if (!match?.last_seen_at || Date.parse(match.last_seen_at) <= Date.parse(publishedListing.last_seen_at!)) return null;
  return match;
}

export function observationTime(value: string | null) {
  if (!value) return "Not reported";
  return new Intl.DateTimeFormat("en-GB", {
    day:"numeric", month:"short", year:"numeric", hour:"2-digit", minute:"2-digit", timeZone:"UTC", hourCycle:"h23",
  }).format(new Date(value)) + " UTC";
}
