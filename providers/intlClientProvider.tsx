"use client";

import { NextIntlClientProvider } from "next-intl";

export function IntlClientProvider({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale: string;
}) {
  return (
    <NextIntlClientProvider locale={locale}>{children} </NextIntlClientProvider>
  );
}
