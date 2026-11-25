import { parseCataloguePreview } from "@/lib/catalogue-preview";
import { laterListing } from "@/lib/featured-listing";
import { publicDataOrigin } from "@/lib/public-data";
import { ListingRecord } from "./listing-record";

export async function ListingExample() {
  let later = null;
  try {
    const response = await fetch(`${publicDataOrigin()}/v1/public/search?q=Spotify`, {
      headers: { Accept: "application/json" }, next: { revalidate: 300 }, signal: AbortSignal.timeout(4000),
    });
    if (response.ok) later = laterListing(parseCataloguePreview(await response.json()).sample_jobs);
  } catch {
    // The dated public observation is available even if the public preview is offline.
  }
  return <ListingRecord later={later} />;
}
