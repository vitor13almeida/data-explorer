"use client";

import { footer } from "@/services/consts/footer";
import { Footer as FooterType } from "@/services/types/footer";
import {
  FinancingSectionContainer,
  Footer as FooterADS,
  FooterDisclaimer,
  FooterGenericLogo,
  FooterLink,
  LinksSectionContainer,
  LinksSectionRelatedLinks,
  LinksSectionRelatedLinksCopyright,
  LinksSectionSocialLinks,
  LinksSectionSocialLinksLabel,
} from "@ama-pt/agora-design-system";
import Image from "next/image";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";

// -------------------------------------------------------------------------------------------------------------------

export type FooterI = FooterType;

export type FooterBrandsI = {
  brands: FooterI["brands"];
};

export type FooterBottomI = {
  description: FooterI["description"];
  logos: FooterI["logos"];
  social: FooterI["social"];
  related: FooterI["related"];
  copyright: FooterI["copyright"];
};

// -------------------------------------------------------------------------------------------------------------------

const FooterBrands = ({ brands }: FooterBrandsI) => {
  const { t } = useTranslation("footer");

  return (
    <div className="container mx-auto flex flex-wrap items-center gap-48 py-64">
      {brands.map((brand) => {
        return (
          <Image
            src={brand.icon}
            alt={t(brand.alt)}
            height={48}
            width={160}
            style={{ height: 48, width: "auto" }}
            className="object-contain"
          />
        );
      })}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------------------------

const FooterBottom = ({
  description,
  logos,
  social,
  related,
  copyright,
}: FooterBottomI) => {
  const { t } = useTranslation("footer");

  const financingSectionContent = [
    <FooterDisclaimer key="footer-description">{description}</FooterDisclaimer>,
    ...(logos?.map((logo, index) => (
      <FooterGenericLogo key={`footer-logo-${index}`}>
        <Image
          src={logo.icon}
          alt={t(logo.alt)}
          height={32}
          width={130}
          style={{ opacity: 0.5, height: 32, width: "auto" }}
          className="object-fill"
        />
      </FooterGenericLogo>
    )) ?? []),
  ];

  const linksSectionSocialContent = [
    <LinksSectionSocialLinksLabel key="footer-social-label">
      {t("socialLabel")}
    </LinksSectionSocialLinksLabel>,
    ...(social?.map((s, index) => {
      const iconName = s.icon.startsWith("agora-")
        ? s.icon
        : `/logos/footer/${s.icon}.svg`;
      return (
        <FooterLink
          key={`footer-social-link-${index}`}
          hasIcon
          iconOnly
          variant="neutral"
          trailingIcon={iconName}
          trailingIconHover={iconName}
          trailingIconActive={iconName}
          aria-label={s.alt}
          href={s.href}
          target="_blank"
        />
      );
    }) ?? []),
  ] as ComponentProps<typeof LinksSectionSocialLinks>["children"];

  const linksSectionRelatedContent = [
    ...(related?.map((r, index) => (
      <FooterLink
        key={`footer-related-links-${index}`}
        appearance="link"
        variant="neutral"
        href={r.href}
        target="_blank"
      >
        {t(r.children)}
      </FooterLink>
    )) ?? []),
    <LinksSectionRelatedLinksCopyright key={"footer-copyright"}>
      {t(copyright)}
    </LinksSectionRelatedLinksCopyright>,
  ];

  const linksSectionContent = [
    <LinksSectionSocialLinks
      key={"footer-social-links"}
      linksSectionSocialAriaLabel={t("social")}
      className="flex flex-col w-full items-start border-t-2 border-t-[#ffffff0d] py-32 lg:w-1/3 lg:border-t-0 [&_ul]:flex [&_ul]:flex-row [&_ul]:flex-wrap [&_ul]:gap-8"
    >
      {linksSectionSocialContent}
    </LinksSectionSocialLinks>,
    <LinksSectionRelatedLinks
      key={"footer-related-links"}
      linksSectionRelatedAriaLabel={t("external")}
      className="flex flex-1 flex-col items-start gap-32 border-t-2 border-t-[#ffffff0d] border-l-2 border-l-[#ffffff0d] px-32 py-32 pl-32 lg:px-0 lg:items-end lg:border-t-0 lg:py-32 pb-64 lg:pl-[100px] lg:my-32 [&_ul]:flex [&_ul]:flex-col [&_ul]:gap-4 [&_ul]:lg:flex-row [&_ul]:lg:flex-wrap [&_ul]:lg:justify-end [&_ul]:lg:gap-32 [&_ul]:lg:gap-y-0"
    >
      {linksSectionRelatedContent}
    </LinksSectionRelatedLinks>,
  ];

  return (
    <div>
      <FooterADS variant="primary-900">
        <FinancingSectionContainer
          aria-label={t("partners")}
          className="relative mx-auto flex justify-between gap-32 py-32 before:absolute before:left-1/2 before:top-0 before:w-screen before:-translate-x-1/2 before:border-t-2 before:border-[#ffffff0d] before:content-[''] after:absolute after:bottom-0 after:left-1/2 after:w-screen after:-translate-x-1/2 after:border-b-2 after:border-[#ffffff0d] after:content-[''] lg:container [&_ul]:flex [&_ul]:flex-1 [&_ul]:gap-32"
        >
          {financingSectionContent}
        </FinancingSectionContainer>
        <LinksSectionContainer
          aria-label={t("related")}
          className="mx-auto lg:container flex"
        >
          {linksSectionContent}
        </LinksSectionContainer>
      </FooterADS>
    </div>
  );
};

// -------------------------------------------------------------------------------------------------------------------

export default function Footer() {
  const { t } = useTranslation("footer");

  const data = footer;

  return (
    <footer
      className="overflow-x-hidden bg-primary-900 text-white"
      aria-label={t("footer")}
    >
      <FooterBrands brands={data.brands} />
      <FooterBottom
        description={data.description}
        logos={data.logos}
        social={data.social}
        related={data.related}
        copyright={data.copyright}
      />
    </footer>
  );
}
