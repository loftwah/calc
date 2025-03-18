export const operooConfig = {
  id: 'operoo',
  name: 'Operoo Cost Calculator',
  description: 'Calculate costs related to Operoo usage in schools',
  elements: [
    {
      type: "slider",
      id: "students",
      label: "Number of Students",
      min: 0,
      max: 3000,
      step: 1,
      default: 1000,
      description: "Total number of students in the school"
    },
    {
      type: "slider",
      id: "pagesStudent",
      label: "Pages per Student",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description: "Includes registration, consent forms, handbooks, policies, agreements..."
    },
    {
      type: "slider",
      id: "mailoutsStudent",
      label: "Mailouts per Student",
      min: 0,
      max: 50,
      step: 1,
      default: 10,
      description: "Letters via mail. Most schools conduct about 18 mail-outs per year."
    },
    {
      type: "slider",
      id: "staff",
      label: "Number of Staff",
      min: 0,
      max: 300,
      step: 1,
      default: 50,
      description: "Total number of staff members"
    },
    {
      type: "slider",
      id: "pagesStaff",
      label: "Pages per Staff",
      min: 0,
      max: 500,
      step: 1,
      default: 100,
      description: "Includes HR forms, contracts, policies, agreements, etc."
    },
    {
      type: "result",
      id: "paperCost",
      label: "Paper Costs @ 1.4c per page",
      formula: "(inputs.students * inputs.pagesStudent) * 0.014"
    },
    {
      type: "result",
      id: "printingCost",
      label: "Printing/Toner Costs @ 1.2c per page",
      formula: "(inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) * 0.012"
    },
    {
      type: "result",
      id: "maintenanceCost",
      label: "Printer/Copier Maintenance @ $395 service fee every 50,000 copies",
      formula: "((inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) / 50000) * 395"
    },
    {
      type: "result",
      id: "postageCost",
      label: "Postage Costs @ 50c per mailout",
      formula: "(inputs.students * inputs.mailoutsStudent) * 0.5"
    },
    {
      type: "result",
      id: "totalCost",
      label: "Total",
      isTotal: true,
      // For the total cost formula, don't use a multi-line template literal,
      // but put everything on one line to work with the function converter
      formula: "(function(inputs) { const paperCost = (inputs.students * inputs.pagesStudent) * 0.014; const printingCost = (inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) * 0.012; const maintenanceCost = ((inputs.students * inputs.pagesStudent + inputs.staff * inputs.pagesStaff) / 50000) * 395; const postageCost = (inputs.students * inputs.mailoutsStudent) * 0.5; return paperCost + printingCost + maintenanceCost + postageCost; })(inputs)"
    }
  ],
  allowedDomains: ["deanlofts.xyz", "*.deanlofts.xyz", "*.operoo.com", "operoo.com", "localhost"]
};