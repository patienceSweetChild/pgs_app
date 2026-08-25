import fs from "fs";
import path from "path";

const phpPath = "E:/pgs/purpleguide - Copy/application/views/home.php";
const outDir = "E:/pgs/pgs_app/src/features/home/generated";
const php = fs.readFileSync(phpPath, "utf8");

const bodyStart = php.indexOf(
  '<section class="about-section half-section overlap-height position-relative overflow-hidden pt-13">',
);
const differentGoals = php.indexOf("section-video-category", bodyStart);

// Must start at <section …>, not mid-attribute (was leaking class="…" as text)
const galleryClass = php.indexOf("home-gallery-mobile", bodyStart);
const galleryStart = php.lastIndexOf("<section", galleryClass);

const newsStart = php.indexOf("#PGS in the news", bodyStart);
const newsSection = php.lastIndexOf("<section", newsStart);
const readyStart = php.indexOf("Ready to get started?", bodyStart);
const readySection = php.lastIndexOf("<section", readyStart);
const modalStart = php.indexOf('id="ppPremiumModal"', bodyStart);

function clean(html) {
  html = html.replace(/<\?(?:php)?[\s\S]*?\?>/g, "");
  html = html.replace(/\.\/assets\//g, "/assets/");
  html = html.replace(/base_url\('([^']+)'\)/g, "/$1");
  html = html.replace(/base_url\("([^"]+)"\)/g, "/$1");
  html = html.replace(/<!--[\s\S]*?-->/g, "");
  html = html.replace(/\son[a-zA-Z]+="[^"]*"/g, "");
  html = html.replace(/\son[a-zA-Z]+='[^']*'/g, "");
  html = html.replace(/<\s*=\s*[^>]*>/g, "");
  html = html.replace(/<\/?\s*>/g, "");
  html = html.replace(/class="portfolio-wrapper grid-loading/g, 'class="portfolio-wrapper');
  return html;
}

if (
  bodyStart < 0 ||
  differentGoals < 0 ||
  galleryStart < 0 ||
  newsSection < 0 ||
  readySection < 0
) {
  console.error({
    bodyStart,
    differentGoals,
    galleryStart,
    newsSection,
    readySection,
  });
  process.exit(1);
}

const early = clean(php.slice(bodyStart, differentGoals));
const middle = clean(php.slice(galleryStart, newsSection));
const late = clean(
  php.slice(readySection, modalStart > 0 ? modalStart : php.length),
);

console.log("middle starts with:", middle.slice(0, 80).replace(/\s+/g, " "));

fs.mkdirSync(outDir, { recursive: true });
const ts = `/* Split home HTML: React owns Different goals / Study journey / News / Masterclass */
export const HOME_EARLY_HTML = ${JSON.stringify(`<div class="home-shared-early">${early}</div>`)};
export const HOME_MIDDLE_HTML = ${JSON.stringify(`<div class="home-shared-middle">${middle}</div>`)};
export const HOME_LATE_HTML = ${JSON.stringify(`<div class="home-shared-late">${late}</div>`)};
`;

fs.writeFileSync(path.join(outDir, "homeSharedHtml.ts"), ts, "utf8");
console.log("ok early", early.length, "middle", middle.length, "late", late.length);
