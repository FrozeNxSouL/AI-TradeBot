import { heroui } from '@heroui/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|chip|divider|drawer|dropdown|form|input|link|listbox|modal|navbar|pagination|select|skeleton|toggle|table|tabs|popover|user|ripple|spinner|menu|scroll-shadow|checkbox|spacer|avatar).js"
  ],
  addCommonColors: false, // override common colors (e.g. "blue", "green", "pink").
  defaultTheme: "light", // default theme from the themes object
  defaultExtendTheme: "light", // default theme to extend on custom themes
  theme: {
    // light: {
    //   layout: {},
    //   colors: {
    //     primary: "#26DE29",
    //     secondary: "#F2CC24",
    //     accent: "#EDEDED",
    //     background: "var(--background)",
    //     foreground: "var(--foreground)"
    //   }
    // },
    extend: {
      colors: {
        primary: "#26DE29",
        secondary: "#F2CC24",
        accent: "#EDEDED",
        background: "#F2F2F2",
        foreground: "#080808",
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
} satisfies Config;
