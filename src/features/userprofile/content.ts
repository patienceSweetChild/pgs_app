export const PROFILE_CARD = {
  name: "Rajeev Singh",
  handle: "@rajsingh",
  id: "2123456",
  avatar: "/assets/img/avatar.jpg",
  pathway: "STEM PATHWAY",
  premiumLabel: "#PURPLEPREMIUM",
} as const;

export const DEFAULT_PROFILE_FORM = {
  name: "Rajeev Singh",
  phone: "",
  whatsapp: "" as "Yes" | "No" | "",
  country: "",
  preferredCountry: "",
  studyLevel: "",
  fieldInterest: "",
  workExperience: "",
  referralCode: "",
};
