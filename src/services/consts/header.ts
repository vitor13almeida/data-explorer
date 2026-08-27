import { EcosystemItem, LanguageOption } from "../types/header";


export const languages: LanguageOption[] = [
  { value: "pt", label: "Português", abbr: "PT" },
  { value: "en", label: "English", abbr: "EN" },
];

export const FLAGS: Record<string, string> = {
  pt: "/languages/pt.svg",
  en: "/languages/en.svg",
};


export const ECOSYSTEM: EcosystemItem[] = [
  {
    label: "Gov.pt",
    href: "https://www.gov.pt/",
    icon: "/logos/ecosystems/logo_gov.svg",
    bgColor: "#034ad8",
  },
  {
    label: "Academia Portugal Digital",
    href: "https://academiaportugaldigital.pt/",
    icon: "/logos/ecosystems/academia_gov.svg",
    bgColor: "#d6e045",
  },
  {
    label: "Digital.gov",
    href: "https://digital.gov.pt/",
    icon: "/logos/ecosystems/digital_gov.svg",
    bgColor: "#2c5ce7",
  },
  {
    label: "Mosaico",
    href: "https://mosaico.gov.pt/",
    icon: "/logos/ecosystems/mosaico_gov.svg",
    bgColor: "#0902a2",
  },
  {
    label: "Inteligência Artificial",
    href: "https://ia.gov.pt/",
    icon: "/logos/ecosystems/ia_gov.svg",
    bgColor: "#a855f7",
  },
  {
    label: "Dados Abertos",
    href: "https://dados.gov.pt/",
    icon: "/logos/ecosystems/dados_gov.svg",
    bgColor: "#ff7000",
  },
  {
    label: "Interoperabilidade",
    href: "https://www.iap.gov.pt/",
    icon: "/logos/ecosystems/iap_gov.svg",
    bgColor: "#0e02f2",
  },
  {
    label: "Acessibilidade",
    href: "https://www.acessibilidade.gov.pt/",
    icon: "/logos/ecosystems/acessibilidade_gov.svg",
    bgColor: "#333399",
  },
  {
    label: "Autenticação.gov",
    href: "https://www.autenticacao.gov.pt/",
    icon: "/logos/ecosystems/autent_gov.svg",
    bgColor: "#3c5bdc",
  },
  {
    label: "Territórios Inteligentes",
    href: "https://territoriosinteligentes.gov.pt/",
    icon: "/logos/ecosystems/territorios_gov.svg",
    bgColor: "#188656",
  },
  {
    label: "Participação Cívica",
    href: "https://participa.gov.pt/",
    icon: "/logos/ecosystems/participa_gov.svg",
    bgColor: "#092c4c",
  },
  {
    label: "E-Avalia",
    href: "https://eavalia.arte.gov.pt/",
    icon: "/logos/ecosystems/eavalia_gov.svg",
    bgColor: "#2b658d",
  },
  {
    label: "Portal ARTE",
    href: "https://www.arte.gov.pt/",
    icon: "/logos/ecosystems/arte_gov.svg",
    bgColor: "#0e02f2",
  },
];
