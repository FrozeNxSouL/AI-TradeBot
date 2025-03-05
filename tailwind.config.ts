import {heroui} from '@heroui/theme';
import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(button|card|chip|divider|drawer|dropdown|form|input|link|listbox|modal|navbar|select|toggle|table|tabs|user|ripple|spinner|menu|popover|scroll-shadow|checkbox|spacer|avatar).js"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#26DE29",
        secondary: "#F2CC24",
        accent: "#EDEDED",
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [heroui()],
} satisfies Config;
