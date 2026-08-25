export type FieldType = "text" | "textarea" | "checkbox" | "select" | "number" | "date" | "datetime";

export type ContentField = {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
};

export type ContentEntityConfig = {
  table: string;
  title: string;
  idKey?: string;
  permission?: string;
  defaultValues?: Record<string, unknown>;
  columns: string[];
  fields: ContentField[];
  /** Extra equality filters applied on list */
  filters?: Record<string, string | boolean | number>;
  orderBy?: { column: string; ascending?: boolean };
};

export const CONTENT_ENTITIES: Record<string, ContentEntityConfig> = {
  course_categories: {
    table: "course_categories",
    title: "Course Categories",
    columns: ["name", "slug", "published", "display_order"],
    fields: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0 },
  },
  event_categories: {
    table: "event_categories",
    title: "Event Categories",
    columns: ["name", "slug", "published"],
    fields: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    defaultValues: { published: false },
  },
  universities: {
    table: "universities",
    title: "Universities",
    columns: ["name", "slug", "location", "published", "updated_at"],
    fields: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "summary", label: "Summary", type: "textarea" },
      { key: "location", label: "Location" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    defaultValues: { published: false, summary: "", location: "" },
    orderBy: { column: "updated_at", ascending: false },
  },
  university_meeting_slots: {
    table: "university_meeting_slots",
    title: "#univMeet Dates",
    columns: ["label", "starts_at", "booking_url", "published", "display_order"],
    fields: [
      { key: "label", label: "Label" },
      { key: "starts_at", label: "Starts at", type: "datetime" },
      { key: "booking_url", label: "Booking URL" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0 },
  },
  key_dates: {
    table: "key_dates",
    title: "Key Dates",
    columns: ["title", "occurs_on", "published", "display_order"],
    fields: [
      { key: "title", label: "Title" },
      { key: "occurs_on", label: "Date", type: "date" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, description: "" },
  },
  urgent_deadlines: {
    table: "urgent_deadlines",
    title: "Urgent Deadlines",
    columns: ["title", "due_at", "published", "display_order"],
    fields: [
      { key: "title", label: "Title" },
      { key: "due_at", label: "Due at", type: "datetime" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, description: "" },
  },
  pgs_stats: {
    table: "pgs_stats",
    title: "PGS Stats",
    columns: ["label", "value_text", "published", "display_order"],
    fields: [
      { key: "label", label: "Label" },
      { key: "value_text", label: "Value" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0 },
  },
  study_abroad_facts: {
    table: "study_abroad_facts",
    title: "Study Abroad Facts",
    columns: ["title", "published", "display_order"],
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, body: "" },
  },
  faqs: {
    table: "faqs",
    title: "FAQs",
    columns: ["question", "category", "published", "display_order"],
    fields: [
      { key: "question", label: "Question" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "category", label: "Category" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      category: "general",
      answer: "",
    },
  },
  testimonials: {
    table: "testimonials",
    title: "Testimonials",
    columns: ["name", "role_label", "published", "display_order"],
    fields: [
      { key: "name", label: "Name" },
      { key: "role_label", label: "Role" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, role_label: "", quote: "" },
  },
  founder: {
    table: "content_people",
    title: "Meet The Founder",
    columns: ["name", "title", "published", "display_order"],
    filters: { person_type: "founder" },
    fields: [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "biography", label: "Biography", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      person_type: "founder",
      published: false,
      display_order: 0,
      title: "",
      biography: "",
    },
  },
  advisory: {
    table: "content_people",
    title: "Advisory Team",
    columns: ["name", "title", "published", "display_order"],
    filters: { person_type: "advisory" },
    fields: [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "biography", label: "Biography", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      person_type: "advisory",
      published: false,
      display_order: 0,
      title: "",
      biography: "",
    },
  },
  weekly_wall: {
    table: "weekly_wall_items",
    title: "Weekly Wall",
    columns: ["title", "published", "display_order", "created_at"],
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, body: "" },
  },
  highlights: {
    table: "highlights",
    title: "Highlights",
    columns: ["title", "published", "display_order", "updated_at"],
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Body", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0, body: "" },
  },
  social: {
    table: "site_social_links",
    title: "Social Media Links",
    columns: ["platform", "url", "published", "display_order"],
    fields: [
      { key: "platform", label: "Platform" },
      { key: "url", label: "URL" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: { published: false, display_order: 0 },
  },
  marquee: {
    table: "site_notices",
    title: "Marquee",
    columns: ["text", "active", "display_order", "updated_at"],
    filters: { notice_type: "marquee" },
    fields: [
      { key: "text", label: "Text" },
      { key: "link_url", label: "Link URL" },
      { key: "active", label: "Active", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      notice_type: "marquee",
      active: false,
      display_order: 0,
      text: "",
    },
  },
};
