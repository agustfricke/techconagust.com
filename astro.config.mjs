import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'AgusTech',
			social: {
				github: 'https://github.com/withastro/starlight',
        youtube: 'https://youtube.com',
        "x.com": "https://x.com/TechConAgust",
			},
			sidebar: [
				{
					label: 'Programacion con Go',
					autogenerate: { directory: 'go' },
				},
				{
					label: 'Proyectos con Go',
					autogenerate: { directory: 'proyeyctos-go' },
				},
				{
					label: 'Herramientas',
					autogenerate: { directory: 'herramientas' },
				},
			],
		}),
	],
});
