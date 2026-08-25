export const IMPORTANT_ALERTS = [
  "LOR is pending",
  "Two UNIs have proved CAS!",
  "Have to submit application by 28th June, 2025",
] as const;

export type DocStatus = "Approved" | "InDraft" | "pending" | "blank";

export type DocRow = {
  name: string;
  uploadedOn: string | null;
  status: DocStatus;
  action: "view" | "upload";
};

export const DOC_ROWS: DocRow[] = [
  {
    name: "Passport Front",
    uploadedOn: "24 April 2025",
    status: "Approved",
    action: "view",
  },
  {
    name: "Passport Back",
    uploadedOn: "24 April 2025",
    status: "InDraft",
    action: "view",
  },
  {
    name: "CV",
    uploadedOn: "24 April 2025",
    status: "InDraft",
    action: "view",
  },
  {
    name: "LoR",
    uploadedOn: null,
    status: "blank",
    action: "view",
  },
  {
    name: "UG Marksheet - 1",
    uploadedOn: null,
    status: "blank",
    action: "view",
  },
  {
    name: "UG Provisional Certificate",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "UG Degree Certificate",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "SOP",
    uploadedOn: "24 April 2025",
    status: "Approved",
    action: "view",
  },
  {
    name: "12th Marksheet",
    uploadedOn: "24 April 2025",
    status: "InDraft",
    action: "view",
  },
  {
    name: "10th Marksheet",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "PG Marksheet - 1",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "PG Consolidated Marksheet",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "PG Provisional Certificate",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "PG Degree Certificate",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
  {
    name: "pre-journey checklist",
    uploadedOn: null,
    status: "blank",
    action: "upload",
  },
];
