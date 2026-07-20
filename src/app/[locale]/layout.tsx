import type { Metadata } from "next";
import { Noto_Sans, Noto_Sans_Mono } from "next/font/google";
import { i18nConfig } from "@/config/i18nConfig";
import TranslationsProvider from "@/providers/TranslationProvider";
import { ReactNode } from "react";
import initTranslations from "../i18n";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"],
});

const notoSansMono = Noto_Sans_Mono({
  variable: "--font-noto-sans-mono",
  subsets: ["latin"],
});

const namespaces = ["common", "explorer"];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { t } = await initTranslations({
    locale,
    namespaces,
  });

  return {
    title: {
      default: t("title"),
      template: `%s | ${t("title")}`,
    },
    description: t("description"),
    icons: {
      icon: "/favicon.png",
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = i18nConfig.locales.includes(rawLocale)
    ? rawLocale
    : i18nConfig.defaultLocale;
  const { resources } = await initTranslations({
    locale,
    namespaces,
  });

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <body
        className={`${notoSans.variable} ${notoSansMono.variable} antialiased`}
      >
        <TranslationsProvider
          locale={locale}
          namespaces={namespaces}
          resources={resources}
        >
          <div className="flex min-h-screen w-full flex-col">
            {/* <Header /> */}
            <div>{children}</div>
            {/* <Footer /> */}
          </div>
        </TranslationsProvider>
      </body>
    </html>
  );
}
