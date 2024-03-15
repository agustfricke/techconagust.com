import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'agusttech',
      logo: {
        // light: '/src/assets/logo-light.svg',
				// dark: './src/assets/logo-dark.svg',
				src: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
			social: {
				github: 'https://github.com/agustfricke',
        youtube: 'https://youtube.com/@agusttech',
        "x.com": "https://x.com/agusttech",
        twitch: "https://twitch.tv/agusttech",
			},
			sidebar: [
				{
					label: 'Go programing',
					autogenerate: { directory: 'go' },
				},
				{
					label: 'Tools',
					autogenerate: { directory: 'tools' },
				},
			],
		}),
	],
});
