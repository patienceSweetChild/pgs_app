import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@pgs/shared"],
  async redirects() {
    return [
      {
        source: "/purpleprogramsfull",
        destination: "/programsfull",
        permanent: false,
      },
      { source: "/countriesusa", destination: "/countries/usa", permanent: false },
      { source: "/countriesuk", destination: "/countries/uk", permanent: false },
      { source: "/countriesaus", destination: "/countries/aus", permanent: false },
      {
        source: "/countriesgermany",
        destination: "/countries/germany",
        permanent: false,
      },
      { source: "/countriesnz", destination: "/countries/nz", permanent: false },
      {
        source: "/countrieseurope",
        destination: "/countries/europe",
        permanent: false,
      },
      {
        source: "/countriesfrance",
        destination: "/countries/france",
        permanent: false,
      },
      {
        source: "/countriescanada",
        destination: "/countries/canada",
        permanent: false,
      },
      {
        source: "/countriesmauritius",
        destination: "/countries/mauritius",
        permanent: false,
      },
      {
        source: "/countriesothers",
        destination: "/countries/others",
        permanent: false,
      },
      { source: "/purpleusme", destination: "/pathways/usmle", permanent: false },
      { source: "/purpleplab", destination: "/pathways/plab", permanent: false },
      { source: "/purpleamc", destination: "/pathways/amc", permanent: false },
      { source: "/purplenonmedical", destination: "/pathways/stem", permanent: false },
    ];
  },
};

export default nextConfig;
