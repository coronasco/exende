import { publicDataOrigin } from "@/lib/public-data";
import { CatalogueModal } from "./catalogue-modal";
export function PublicCatalogue({ surface = "homepage" }: { surface?: "homepage" | "jobs" | "coverage" }) {
  return <CatalogueModal endpoint={`${publicDataOrigin()}/v1/public/search`} surface={surface} />;
}
