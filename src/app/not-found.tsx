import { redirect } from "next/navigation";
import { headers, cookies } from "next/headers";

const SUPPORTED_LOCALES = ["pt", "en"];
const DEFAULT_LOCALE = "pt";

function getLocale(headersList: Headers, cookieStore: any): string {
  const cookieLocale = cookieStore.get("locale")?.value;
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = headersList.get("accept-language") ?? "";
  const preferred = acceptLanguage
    .split(",")
    .map((lang) => lang.split(";")[0].trim().substring(0, 2).toLowerCase())
    .find((lang) => SUPPORTED_LOCALES.includes(lang));

  return preferred ?? DEFAULT_LOCALE;
}

export default async function RootNotFound() {
  const headersList = await headers();
  const cookieStore = await cookies();
  const locale = getLocale(headersList, cookieStore);

  redirect(`/${locale}/not-found`);
}
