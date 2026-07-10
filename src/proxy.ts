import { NextRequest, NextResponse } from "next/server";
import { i18nRouter } from "next-i18n-router";
import { i18nConfig } from "./config/i18nConfig";

export async function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);

  const response = i18nRouter(request, i18nConfig);

  const rewriteUrl = response.headers.get("x-middleware-rewrite");
  if (rewriteUrl) {
    return NextResponse.rewrite(new URL(rewriteUrl, request.url), {
      request: {
        headers: requestHeaders,
      },
      headers: response.headers,
    });
  }

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!/|assets/|_next/static|.*\\..*|_next/image|favicon.ico|favicon.png|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot)$).*)",
    },
  ],
};
