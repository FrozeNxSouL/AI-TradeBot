"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export function Providers({children}: { children: React.ReactNode }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme()
  setTheme('light')

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider attribute="class">
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  );
}