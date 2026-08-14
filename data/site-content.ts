import { publicPath } from "@/utils/public-path";

export const heroSlides = [
  {
    image: publicPath("/assets/ferasa/field-supply.jpg"),
    kicker: "Procurement · Libya",
    title: "Equipment delivered where the work happens.",
  },
  {
    image: publicPath("/assets/ferasa/field-logistics.jpg"),
    kicker: "Project logistics",
    title: "From international sourcing to site delivery.",
  },
  {
    image: publicPath("/assets/ferasa/field-maintenance.jpg"),
    kicker: "Technical services",
    title: "Field teams that install, maintain and support.",
  },
];

export const services = [
  {
    number: "01",
    title: "Industrial supply & global sourcing",
    text: "Specification-led sourcing for oilfield, mechanical, electrical, safety and industrial requirements—from manufacturer identification to final delivery.",
    points: [
      "Manufacturer & cross-reference search",
      "Commercial and technical offers",
      "Freight and project delivery",
    ],
  },
  {
    number: "02",
    title: "Fire, gas detection & extinguishing",
    text: "Application-driven fire and fixed-point gas detection solutions, engineered around the facility, hazard and operating environment.",
    points: [
      "Engineering and design",
      "Supply and installation",
      "Commissioning and servicing",
    ],
  },
  {
    number: "03",
    title: "Corrosion monitoring & cathodic protection",
    text: "Complete support for corrosion-monitoring, chemical-injection and cathodic-protection projects at onshore and remote locations.",
    points: [
      "Studies and system design",
      "Monitoring equipment",
      "Installation and after-sales",
    ],
  },
  {
    number: "04",
    title: "Repair, fabrication & offshore services",
    text: "Field-focused repair, structural fabrication, equipment skids, workshops, mobile cabins and offshore accommodation refurbishment.",
    points: [
      "Fabrication and welding",
      "Mechanical and electrical works",
      "Painting and refurbishment",
    ],
  },
  {
    number: "05",
    title: "Security, access & public systems",
    text: "Integrated access control and physical-security solutions for industrial, commercial and public environments.",
    points: [
      "Cameras and access control",
      "Barriers, bollards and gates",
      "Public address and evacuation",
    ],
  },
  {
    number: "06",
    title: "Pumps, equipment & plant support",
    text: "Equipment selection, supply, installation and maintenance for temporary and permanent oilfield and industrial applications.",
    points: [
      "Pumps and generators",
      "Cranes and handling equipment",
      "Maintenance and spare parts",
    ],
  },
];

export const downloads = [
  {
    number: "01",
    title: "Oilfield & Technical Services",
    description: "Gas detection · corrosion · offshore · maintenance",
    href: publicPath("/downloads/ferasa-oilfield-technical-services.pdf"),
  },
  {
    number: "02",
    title: "Stationary Extinguishing Systems",
    description: "Fire detection · suppression · rescue equipment",
    href: publicPath("/downloads/ferasa-stationary-extinguishing-systems.pdf"),
  },
  {
    number: "03",
    title: "Technology & Security Services",
    description: "Access control · barriers · public systems",
    href: publicPath("/downloads/ferasa-technology-security-services.pdf"),
  },
];
