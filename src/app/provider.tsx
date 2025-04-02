"use client";

import { HeroUIProvider } from "@heroui/system";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

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