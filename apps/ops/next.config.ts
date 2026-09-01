import type { NextConfig } from "next";
import { createPgsNextConfig } from "@pgs/next-config";

const config: NextConfig = createPgsNextConfig({ surface: "ops" });
export default config;
