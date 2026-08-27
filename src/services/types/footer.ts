export type FooterCard = {
  title: string;
  href: string;
  enabled: boolean;
};

export type FooterBrand = {
  alt: string;
  href: string;
  icon: string;
};

export type FooterLogo = {
  icon: string;
  alt: string;
};

export type FooterSocial = {
  icon: string;
  href: string;
  alt: string;
};

export type FooterRelatedLink = {
  children: string;
  href: string;
};

export type Footer = {
  brands: FooterBrand[];
  description: string;
  logos: FooterLogo[];
  social: FooterSocial[];
  related: FooterRelatedLink[];
  copyright: string;
};
