import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'www',
      logo: {
        // light: '/src/assets/logo-light.svg',
				// dark: './src/assets/logo-dark.svg',
				src: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
			social: {
				github: 'https://github.com/',
        youtube: 'https://youtube.com/',
        "x.com": "https://x.com/",
        twitch: "https://twitch.tv/",
			},
			sidebar: [
				{
					label: 'Go Programming',
					autogenerate: { directory: 'go' },
				},
      ]
		}),
	],
});
