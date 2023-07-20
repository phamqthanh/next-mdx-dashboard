const plugin = require("tailwindcss/plugin");
function withOpacityValue(variable, fallbackColor) {
  return ({ opacityValue }) => {
    let fallbackColorValue = "";
    if (fallbackColor) {
      fallbackColorValue = `, var(${fallbackColor})`;
    }
    if (opacityValue === undefined) {
      return `rgba(var(${variable}${fallbackColorValue}))`;
    }
    return `rgba(var(${variable}${fallbackColorValue}) / ${opacityValue})`;
  };
}

const colorObject = {
  "base-100": withOpacityValue("--b1"),
  "base-200": withOpacityValue("--b2", "--b1"),
  "base-300": withOpacityValue("--b3", "--b2"),
  "base-content": withOpacityValue("--bc"),
  "subtle-content": withOpacityValue("--stc"),
  // 'base-content': withOpacityValue('--bc'),

  neutral: withOpacityValue("--n"),
  "neutral-focus": withOpacityValue("--nf", "--n"),
  "neutral-content": withOpacityValue("--nc"),
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{ts,tsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: { ...colorObject },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        xxs: ["0.625rem", "0.875rem"],
        "2xs": ["0.75rem", { lineHeight: "1.25rem" }],
        xs: ["0.8125rem", { lineHeight: "1.5rem" }],
        sm: ["0.875rem", { lineHeight: "1.5rem" }],
        base: ["1rem", { lineHeight: "1.75rem" }],
        lg: ["1.125rem", { lineHeight: "1.75rem" }],
        xl: ["1.25rem", { lineHeight: "1.75rem" }],
        "2xl": ["1.5rem", { lineHeight: "2rem" }],
        "3xl": ["1.875rem", { lineHeight: "2.25rem" }],
        "4xl": ["2.25rem", { lineHeight: "2.5rem" }],
        "5xl": ["3rem", { lineHeight: "1" }],
        "6xl": ["3.75rem", { lineHeight: "1" }],
        "7xl": ["4.5rem", { lineHeight: "1" }],
        "8xl": ["6rem", { lineHeight: "1" }],
        "9xl": ["8rem", { lineHeight: "1" }],
      },
      typography: require("./typography"),
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    plugin(({ addBase, addComponents }) => {
      // Color
      addBase({
        ":root,[data-theme]": {
          backgroundColor: "rgba(var(--b1)/var(--tw-bg-opacity,1))",
          color: "rgba(var(--bc)/var(--tw-text-opacity,1))",
        },
        ":root": {
          "--bc": "0 0 0",
          "--b1": "255 255 255",
        },
        "[data-theme='dark']": {
          "--bc": "255 255 255",
          "--b1": "24 24 27",
        },
      });
      addComponents({
        ".block-image": {
          zIndex: "0",
          position: "relative",
        },
        ".block-square": {
          paddingBottom: "100%",
        },
      });
    }),
  ],
};
