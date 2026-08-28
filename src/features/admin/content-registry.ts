export type FieldType =
  | "text"
  | "textarea"
  | "checkbox"
  | "select"
  | "number"
  | "date"
  | "datetime"
  | "media";

export type ContentField = {
  key: string;
  label: string;
  type?: FieldType;
  options?: { value: string; label: string }[];
  /** Load options at runtime from a related table. */
  optionsSource?: "countries" | "universities" | "courses";
  /** Empty string is coerced to null on save. */
  nullable?: boolean;
  /** For type "media": images only, or images + PDF. */
  mediaAccept?: "image" | "document";
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

const SOCIAL_PLATFORMS = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "linkedin", label: "LinkedIn" },
  { value: "threads", label: "Threads" },
  { value: "twitter", label: "Twitter / X" },
  { value: "tiktok", label: "TikTok" },
];

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
      {
        key: "country_id",
        label: "Country",
        type: "select",
        optionsSource: "countries",
        nullable: true,
      },
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    defaultValues: {
      published: false,
      summary: "",
      location: "",
      country_id: null,
      image_asset_id: null,
    },
    orderBy: { column: "updated_at", ascending: false },
  },
  university_meeting_slots: {
    table: "university_meeting_slots",
    title: "#univMeet Dates",
    columns: ["label", "starts_at", "booking_url", "published", "display_order"],
    fields: [
      { key: "label", label: "Label" },
      { key: "starts_at", label: "Starts at", type: "datetime", nullable: true },
      {
        key: "course_id",
        label: "Linked course",
        type: "select",
        optionsSource: "courses",
        nullable: true,
      },
      { key: "booking_url", label: "Booking URL", nullable: true },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      course_id: null,
      booking_url: null,
      starts_at: null,
    },
  },
  key_dates: {
    table: "key_dates",
    title: "Key Dates",
    columns: ["title", "occurs_on", "published", "display_order"],
    fields: [
      { key: "title", label: "Title" },
      { key: "occurs_on", label: "Date", type: "date", nullable: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      description: "",
      occurs_on: null,
    },
  },
  urgent_deadlines: {
    table: "urgent_deadlines",
    title: "Urgent Deadlines",
    columns: ["title", "due_at", "published", "display_order"],
    fields: [
      { key: "title", label: "Title" },
      { key: "due_at", label: "Due at", type: "datetime", nullable: true },
      { key: "description", label: "Description", type: "textarea" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      description: "",
      due_at: null,
    },
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
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      role_label: "",
      quote: "",
      image_asset_id: null,
    },
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
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      person_type: "founder",
      published: false,
      display_order: 0,
      title: "",
      biography: "",
      image_asset_id: null,
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
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      person_type: "advisory",
      published: false,
      display_order: 0,
      title: "",
      biography: "",
      image_asset_id: null,
    },
  },
  weekly_wall: {
    table: "weekly_wall_items",
    title: "Weekly Wall",
    columns: ["title", "published", "display_order", "created_at"],
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Body", type: "textarea" },
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      body: "",
      image_asset_id: null,
    },
  },
  highlights: {
    table: "highlights",
    title: "Highlights",
    columns: ["title", "published", "display_order", "updated_at"],
    fields: [
      { key: "title", label: "Title" },
      { key: "body", label: "Body", type: "textarea" },
      {
        key: "image_asset_id",
        label: "Image",
        type: "media",
        mediaAccept: "image",
        nullable: true,
      },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      body: "",
      image_asset_id: null,
    },
  },
  social: {
    table: "site_social_links",
    title: "Social Media Links",
    columns: ["platform", "url", "published", "display_order"],
    fields: [
      {
        key: "platform",
        label: "Platform",
        type: "select",
        options: SOCIAL_PLATFORMS,
      },
      { key: "url", label: "URL" },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      platform: "instagram",
    },
  },
  marquee: {
    table: "site_notices",
    title: "Marquee",
    columns: ["text", "active", "display_order", "updated_at"],
    filters: { notice_type: "marquee" },
    fields: [
      { key: "text", label: "Text" },
      { key: "link_url", label: "Link URL", nullable: true },
      { key: "active", label: "Active", type: "checkbox" },
      { key: "starts_at", label: "Starts at", type: "datetime", nullable: true },
      { key: "ends_at", label: "Ends at", type: "datetime", nullable: true },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      notice_type: "marquee",
      active: false,
      display_order: 0,
      text: "",
      link_url: null,
      starts_at: null,
      ends_at: null,
    },
  },
  catalog_tags: {
    table: "catalog_tags",
    title: "Catalog Tags",
    columns: ["name", "slug", "tag_type", "published"],
    fields: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "tag_type", label: "Tag type" },
      { key: "published", label: "Published", type: "checkbox" },
    ],
    defaultValues: { published: false, tag_type: "general" },
  },
  countries: {
    table: "countries",
    title: "Countries",
    columns: ["name", "slug", "iso_code", "published", "display_order"],
    fields: [
      { key: "name", label: "Name" },
      { key: "slug", label: "Slug" },
      { key: "iso_code", label: "ISO code", nullable: true },
      { key: "dial_code", label: "Dial code", nullable: true },
      { key: "published", label: "Published", type: "checkbox" },
      { key: "display_order", label: "Order", type: "number" },
    ],
    defaultValues: {
      published: false,
      display_order: 0,
      iso_code: null,
      dial_code: null,
    },
  },
};
