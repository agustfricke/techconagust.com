export const SITE = {
  title: "www",
  description: "La mejor web para aprender a programar",
  defaultLanguage: "es",
};

export interface Frontmatter {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  ogLocale?: string;
  isMdx?: boolean;
}

export const ALGOLIA = {
  indexName: "www",
  appId: "appId",
  apiKey: "apiKey",
};

export interface SidebarItem {
  text: string;
  link: `${string}`;
}

export type SidebarItemLink = SidebarItem["link"];

export const SIDEBAR = {
  Linux: [
    { text: "Comandos", link: "Comandos" },
    { text: "Comandos", link: "Comandos" },
    { text: "Comandos", link: "Comandos" },
  ],
  "Programacion con Go": [
    { text: "Variables", link: "variables" },
    { text: "Variables", link: "variables" },
    { text: "Variables", link: "variables" },
    { text: "Variables", link: "variables" },
  ],
  "Proyectos con Go": [
    { text: "X clone", link: "proyectos-con-go/Xclone" },
    { text: "X clone", link: "proyectos-con-go/Xclone" },
    { text: "X clone", link: "proyectos-con-go/Xclone" },
    { text: "X clone", link: "proyectos-con-go/Xclone" },
  ],
};
