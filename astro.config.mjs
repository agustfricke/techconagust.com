import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Machine Lab',
      logo: {
        // light: '/src/assets/logo-light.svg',
				// dark: './src/assets/logo-dark.svg',
				src: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
			social: {
				github: 'https://github.com/withastro/starlight',
        youtube: 'https://youtube.com',
        "x.com": "https://x.com/TechConAgust",
        twitch: "https://agustech.dev",
			},
			sidebar: [
				{
					label: 'Go programing',
					autogenerate: { directory: 'go' },
				},
			],
		}),
	],
});
