// Tailwind v4 is used ONLY by the /admin CMS (see src/app/admin/admin.css).
// Files without Tailwind directives (e.g. src/app/globals.css) pass through unchanged.
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
