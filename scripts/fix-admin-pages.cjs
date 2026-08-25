const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..", "src", "app", "admin");
const NL = String.fromCharCode(10);

function writePage(rel, body) {
  const file = path.join(root, rel, "page.tsx");
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, body, "utf8");
  console.log("wrote", file);
}

function cms(entityKey) {
  return [
    'import { ContentCmsTable } from "@/features/admin/ContentCmsTable";',
    "",
    "export default function Page() {",
    '  return <ContentCmsTable entityKey="' + entityKey + '" />;',
    "}",
    "",
  ].join(NL);
}

function legal(documentType, heading) {
  return [
    'import { LegalDocEditor } from "@/features/admin/LegalDocEditor";',
    "",
    "export default function Page() {",
    "  return (",
    '    <LegalDocEditor documentType="' + documentType + '" heading="' + heading + '" />',
    "  );",
    "}",
    "",
  ].join(NL);
}

function premium(settingKey, heading) {
  return [
    'import { PremiumContentEditor } from "@/features/admin/PremiumContentEditor";',
    "",
    "export default function Page() {",
    "  return (",
    '    <PremiumContentEditor settingKey="' + settingKey + '" heading="' + heading + '" />',
    "  );",
    "}",
    "",
  ].join(NL);
}

function readonly(title, table, columns) {
  const cols = columns.map((c) => '"' + c + '"').join(", ");
  return [
    'import { ReadOnlyTable } from "@/features/admin/ReadOnlyTable";',
    "",
    "export default function Page() {",
    "  return (",
    "    <ReadOnlyTable",
    '      title="' + title + '"',
    '      table="' + table + '"',
    "      columns={[" + cols + "]}",
    "    />",
    "  );",
    "}",
    "",
  ].join(NL);
}

const simple = [
  ["course-categories", "course_categories"],
  ["event-categories", "event_categories"],
  ["universities", "universities"],
  ["univmeet", "university_meeting_slots"],
  ["student-resources/key-dates", "key_dates"],
  ["student-resources/urgent-deadlines", "urgent_deadlines"],
  ["student-resources/pgs-stats", "pgs_stats"],
  ["student-resources/study-abroad-facts", "study_abroad_facts"],
  ["faqs", "faqs"],
  ["testimonials", "testimonials"],
  ["about/founder", "founder"],
  ["about/advisory", "advisory"],
  ["weekly-wall", "weekly_wall"],
  ["highlights", "highlights"],
  ["social", "social"],
  ["marquee", "marquee"],
];

for (const [dir, key] of simple) {
  writePage(dir, cms(key));
}

writePage("legal/privacy", legal("privacy", "Privacy Policy"));
writePage("legal/terms", legal("terms", "Terms Conditions"));
writePage("legal/refund", legal("refund", "Refund Policy"));
writePage("premium-content/meetup", premium("meetup", "Premium Meetup Card"));
writePage("premium-content/video", premium("video", "Premium Hero Video"));
writePage(
  "study-journey",
  readonly("Study abroad journey", "study_journey_enquiries", [
    "name",
    "email",
    "phone",
    "pathway",
    "message",
    "replied",
    "created_at",
  ]),
);
writePage(
  "student-resources/subscribers",
  readonly("Deadline Subscribers", "deadline_subscriptions", [
    "email",
    "source_page",
    "created_at",
  ]),
);

console.log("done");
