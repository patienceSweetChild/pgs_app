import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Legacy ThemeZaa CSS lives in /public/assets — must load via <link>, not CSS modules.
      "@next/next/no-css-tags": "off",
    },
  },
];

export default eslintConfig;
