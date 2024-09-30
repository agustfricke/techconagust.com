import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
      logo: {
        light: '/src/assets/logo.svg',
				dark: './src/assets/logo-dark.svg',
        replacesTitle: true,
      },
      title: "Zustack",
			social: {
				github: 'https://github.com/agustfricke',
        youtube: 'https://www.youtube.com/@agustfricke',
        "x.com": "https://x.com/agustfricke",
        twitch: "https://twitch.tv/agustfricke",
			},
			sidebar: [
				{
					label: 'Linux',
					autogenerate: { directory: 'linux' },
				},
      ]
		}),
	],
});
