/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary":                    "var(--color-primary)",
        "primary-container":          "var(--color-primary-container)",
        "on-primary":                 "var(--color-on-primary)",
        "primary-fixed":              "var(--color-primary-fixed)",
        "on-primary-fixed":           "var(--color-on-primary-fixed)",
        "on-primary-fixed-variant":   "var(--color-on-primary-fixed-variant)",
        "primary-fixed-dim":          "var(--color-primary-fixed-dim)",
        "inverse-primary":            "var(--color-inverse-primary)",
        
        "surface":                    "var(--color-surface)",
        "surface-bright":             "var(--color-surface-bright)",
        "surface-dim":                "var(--color-surface-dim)",
        "surface-container-lowest":   "var(--color-surface-container-lowest)",
        "surface-container-low":      "var(--color-surface-container-low)",
        "surface-container":          "var(--color-surface-container)",
        "surface-container-high":     "var(--color-surface-container-high)",
        "surface-container-highest":  "var(--color-surface-container-highest)",
        "surface-variant":            "var(--color-surface-variant)",
        "inverse-surface":            "var(--color-inverse-surface)",
        "inverse-on-surface":         "var(--color-inverse-on-surface)",
        
        "on-surface":                 "var(--color-on-surface)",
        "on-surface-variant":         "var(--color-on-surface-variant)",
        "on-background":              "var(--color-on-background)",
        "background":                 "var(--color-background)",
        
        "secondary":                  "var(--color-secondary)",
        "secondary-container":        "var(--color-secondary-container)",
        "on-secondary":               "var(--color-on-secondary)",
        "on-secondary-container":     "var(--color-on-secondary-container)",
        "secondary-fixed":            "var(--color-secondary-fixed)",
        "secondary-fixed-dim":        "var(--color-secondary-fixed-dim)",
        "on-secondary-fixed":         "var(--color-on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--color-on-secondary-fixed-variant)",
        
        "tertiary":                   "var(--color-tertiary)",
        "tertiary-container":         "var(--color-tertiary-container)",
        "tertiary-fixed":             "var(--color-tertiary-fixed)",
        "tertiary-fixed-dim":         "var(--color-tertiary-fixed-dim)",
        "on-tertiary":                "var(--color-on-tertiary)",
        "on-tertiary-container":      "var(--color-on-tertiary-container)",
        "on-tertiary-fixed":          "var(--color-on-tertiary-fixed)",
        "on-tertiary-fixed-variant":  "var(--color-on-tertiary-fixed-variant)",
        
        "outline":                    "var(--color-outline)",
        "outline-variant":            "var(--color-outline-variant)",
        
        "error":                      "var(--color-error)",
        "error-container":            "var(--color-error-container)",
        "on-error":                   "var(--color-on-error)",
        "on-error-container":         "var(--color-on-error-container)",
        
        "surface-tint":               "var(--color-surface-tint)",
      },
      fontFamily: {
        headline: ["Manrope", "sans-serif"],
        body:     ["Inter", "sans-serif"],
        label:    ["Inter", "sans-serif"],
        mono:     ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        none:    "0",
        sm:      "4px",
        DEFAULT: "8px",
        md:      "12px",
        lg:      "16px",
        xl:      "20px",
        "2xl":   "24px",
        "3xl":   "32px",
        full:    "9999px",
      },
      boxShadow: {
        card:    "0 1px 3px rgba(26, 26, 46, 0.06), 0 1px 2px rgba(26, 26, 46, 0.04)",
        "card-hover": "0 4px 16px rgba(84, 33, 172, 0.10), 0 2px 6px rgba(26, 26, 46, 0.06)",
        primary: "0 4px 14px rgba(84, 33, 172, 0.30)",
        "primary-sm": "0 2px 8px rgba(84, 33, 172, 0.20)",
        none:    "none",
      }
    },
  },
  plugins: [],
}
