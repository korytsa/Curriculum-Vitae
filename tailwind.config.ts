import type { Config } from "tailwindcss";

const config = {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
		"./shared/**/*.{ts,tsx}",
		"./entities/**/*.{ts,tsx}",
		"./features/**/*.{ts,tsx}",
		"./widgets/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: "2rem",
			screens: {
				"2xl": "1400px",
			},
		},
		extend: {
			colors: {
				border: "hsl(var(--border))",
				background: "hsl(var(--background))",
				foreground: "hsl(var(--foreground))",
				muted: {
					DEFAULT: "hsl(var(--muted))",
					foreground: "hsl(var(--muted-foreground))",
				},
				sidebar: {
					bg: "rgb(var(--sidebar-bg))",
					hover: "rgb(var(--sidebar-hover))",
					"avatar-bg": "rgb(var(--sidebar-avatar-bg))",
					"avatar-text": "rgb(var(--sidebar-avatar-text))",
					text: "rgb(var(--sidebar-text))",
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
