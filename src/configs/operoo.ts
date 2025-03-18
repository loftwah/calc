export const operooConfig = {
  elements: [
    {
      type: "slider",
      id: "students",
      label: "Number of Students",
      min: 0,
      max: 3000,
      step: 1,
      default: 1000,
    },
    {
      type: "slider",
      id: "pagesStudent",
      label: "Pages per Student",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description:
        "Includes registration, consent forms, handbooks, policies, agreements…",
    },
    {
      type: "slider",
      id: "mailoutsStudent",
      label: "Mailouts per Student",
      min: 0,
      max: 50,
      step: 1,
      default: 10,
      description:
        "Letters via mail. Most schools conduct about 18 mail-outs per year.",
    },
    {
      type: "slider",
      id: "staff",
      label: "Number of Staff",
      min: 0,
      max: 300,
      step: 1,
      default: 50,
    },
    {
      type: "slider",
      id: "pagesStaff",
      label: "Pages per Staff",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description: "Includes HR forms, contracts, policies, agreements, etc.",
    }
  ],
  allowedDomains: ["deanlofts.xyz", "*.deanlofts.xyz"],
}; 