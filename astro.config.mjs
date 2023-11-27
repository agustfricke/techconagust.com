import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export const locales = {
	root: { label: 'English', lang: 'en' },
	es: { label: 'Español', lang: 'es' },
};

const VERCEL_PREVIEW_SITE =
	process.env.VERCEL_ENV !== 'production' &&
	process.env.VERCEL_URL &&
	`https://${process.env.VERCEL_URL}`;

const site = VERCEL_PREVIEW_SITE || 'https://zustex.com';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'Machine Lab',
			social: {
				github: 'https://github.com/agustfricke',
				youtube: 'https://youtube.com/@techconagust',
        "x.com": 'https://x.com/agustfricke.com'
			},
			head: [
				{
					tag: 'script',
					attrs: {
						src: 'https://cdn.usefathom.com/script.js',
						'data-site': 'EZBHTSIG',
						defer: true,
					},
				},
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: site + 'og.jpg?v=1' },
				},
				{
					tag: 'meta',
					attrs: { property: 'twitter:image', content: site + 'og.jpg?v=1' },
				},
			],
			customCss: process.env.NO_GRADIENTS ? [] : ['./src/assets/landing.css'],
			locales,
			sidebar: [
				{
					label: 'Go programing',
					translations: {
						es: 'Programacion con Go',
					},
					autogenerate: { directory: 'go' },
        },
				{
					label: 'Go Projects',
					translations: {
						es: 'Proyectos en Go',
					},
					autogenerate: { directory: 'go-projects' },
				},
				{
					label: 'Tools',
					translations: {
						es: 'Herramientas',
					},
					autogenerate: { directory: 'tools' },
				},
			],
		}),
	],
});
