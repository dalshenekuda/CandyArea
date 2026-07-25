import uiKitPreset from '@dalshenekuda/candy-ui/tailwind.preset';

const tokens = uiKitPreset.theme.extend;

/** @type {import('tailwindcss').Config} */
export default {
  presets: [uiKitPreset],
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    // Replace Tailwind default spacing scale with candy-ui tokens only.
    spacing: tokens.spacing,
  },
  corePlugins: {
    preflight: false,
    fontSize: false,
    fontFamily: false,
    fontWeight: false,
    lineHeight: false,
    letterSpacing: false,
    textColor: false,
  },
};
