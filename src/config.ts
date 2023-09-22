export const SITE = {
  title: "Tech con Agust",
  description: "The best way to start a full-stack, typesafe Next.js app.",
  defaultLanguage: "en_US",
};

export const OPEN_GRAPH = {
  image: {
    src: "logo.png",
    alt: "techconagust.com",
  },
  twitter: "@techconagust",
};

export interface Frontmatter {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: "ltr" | "rtl";
  ogLocale?: string;
  lang?: KnownLanguageCode;
  isMdx?: boolean;
}

export const KNOWN_LANGUAGES = {
  en: "English",
  es: "Español",
} as const;
export type KnownLanguageCode = keyof typeof KNOWN_LANGUAGES;

export const ALGOLIA = {
  indexName: "techconagust.com",
  appId: "VLI6IWYN16",
  apiKey: "3b5e1bfef294e04ae6072bc680c4a6b0",
};

export type OuterHeaders = "Go development";

export interface SidebarItem {
  text: string;
  link: `${string}`;
}

export type SidebarItemLink = SidebarItem["link"];

export type Sidebar = {
  [TCode in KnownLanguageCode]: {
    [THeader in OuterHeaders]?: SidebarItem[];
  };
};
export const SIDEBAR: Sidebar = {
  en: {
    "Go development": [
      { text: "GO HTMX CRUD", link: "go-htmx-crud" },
      { text: "Send emails with Go", link: "go-send-email" },
    ],
  },
  es: {
    "Go development": [
      { text: "GO HTMX CRUD", link: "go-htmx-crud" },
      { text: "Manda correos con Go", link: "go-send-email" },
    ],
  },
};

export const SIDEBAR_HEADER_MAP: Record<
  Exclude<KnownLanguageCode, "en">,
  Record<OuterHeaders, string>
> = {
  es: {
    "Go development": "Desarrollo con Go",
  },
};
