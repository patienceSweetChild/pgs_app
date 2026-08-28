import type { Metadata } from "next";
import { ExploreCountriesPage } from "@/features/explorecountries/ExploreCountriesPage";

export const metadata: Metadata = {
  title: "Explore Countries",
};

export default function Page() {
  return <ExploreCountriesPage />;
}
