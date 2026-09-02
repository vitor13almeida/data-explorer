import { Footer } from "../types/footer";

export const footer: Footer = {
  brands: [
    {
      icon: "/logos/footer/pt-republic-color.svg",
      alt: "brands.rp",
      href: "https://www.portugal.gov.pt/pt/gc25",
    },
    {
      icon: "/logos/footer/ARTE__Horizontal_branco_pt.svg",
      alt: "brands.arte",
      href: "https://www.arte.gov.pt/",
    },
  ],
  description: "Explorador de dados públicos portugueses",
  logos: [
    {
      icon: "/logos/footer/republica-portuguesa.svg",
      alt: "logos.rp",
    },
    {
      icon: "/logos/footer/NextGenerationEU.svg",
      alt: "logos.nextGenEU",
    },
  ],
  social: [
    {
      icon: "agora-line-linkedin",
      href: "https://www.linkedin.com/company/arte-gov-pt/",
      alt: "LinkedIn",
    },
    {
      icon: "github",
      href: "https://github.com/amagovpt/",
      alt: "Github",
    },
  ],
  related: [
    {
      children: "relatedLinks.rp",
      href: "https://www.portugal.gov.pt/pt/gc25",
    },
    {
      children: "relatedLinks.cp",
      href: "https://www.compete2020.gov.pt/",
    },
    {
      children: "relatedLinks.pt",
      href: "https://portugal2020.pt/",
    },
    {
      children: "relatedLinks.ce",
      href: "https://eur-lex.europa.eu/legal-content/PT/LSU/?uri=CELEX:32019L1024",
    },
    /*{
        children: "Mapa do site",
        href: "/sitemap",
    },*/
  ],
  copyright: "copyright",
};
