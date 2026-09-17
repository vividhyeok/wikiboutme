import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import GithubSlugger from "github-slugger";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const CONTENT_DIR = path.join(process.cwd(), "content");

export type WikiDocument = {
  slug: string;
  title: string;
  description: string;
  category: string;
  order: number;
  updated: string;
  aliases: string[];
  content: string;
  excerpt: string;
};

export type TocItem = {
  level: number;
  text: string;
  id: string;
};

export type WikiConfig = {
  siteName: string;
  siteDescription: string;
  theme: {
    accentColor: string;
    linkColor: string;
    maxContentWidth: string;
  };
  appearance: {
    defaultTheme: "system" | "light" | "dark";
    roundedCorners: boolean;
    compactLayout: boolean;
  };
  navigation: {
    showRecentChanges: boolean;
    showCategories: boolean;
    showSearch: boolean;
    showSidebar: boolean;
  };
  wiki: {
    homeDocument: string;
    showUpdatedDate: boolean;
    showTableOfContents: boolean;
    enableInternalLinks: boolean;
  };
};

export const defaultConfig: WikiConfig = {
  siteName: "wikiboutme",
  siteDescription: "김민혁에 대한 개인 위키",
  theme: {
    accentColor: "#00a495",
    linkColor: "#0275d8",
    maxContentWidth: "1180px",
  },
  appearance: {
    defaultTheme: "system",
    roundedCorners: false,
    compactLayout: false,
  },
  navigation: {
    showRecentChanges: true,
    showCategories: true,
    showSearch: true,
    showSidebar: true,
  },
  wiki: {
    homeDocument: "index",
    showUpdatedDate: true,
    showTableOfContents: true,
    enableInternalLinks: true,
  },
};

function parseFrontmatter(raw: string) {
  return matter(raw, {
    engines: {
      yaml: (source) => yaml.load(source) as Record<string, unknown>,
    },
  });
}

function mergeConfig(input: Partial<WikiConfig>): WikiConfig {
  return {
    ...defaultConfig,
    ...input,
    theme: { ...defaultConfig.theme, ...(input.theme ?? {}) },
    appearance: { ...defaultConfig.appearance, ...(input.appearance ?? {}) },
    navigation: { ...defaultConfig.navigation, ...(input.navigation ?? {}) },
    wiki: { ...defaultConfig.wiki, ...(input.wiki ?? {}) },
  };
}

export function getWikiConfig(): WikiConfig {
  const configPath = path.join(CONTENT_DIR, "_config.md");
  if (!fs.existsSync(configPath)) return defaultConfig;

  try {
    const { data } = parseFrontmatter(fs.readFileSync(configPath, "utf8"));
    return mergeConfig(data as Partial<WikiConfig>);
  } catch {
    return defaultConfig;
  }
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, slug, label) => label || slug)
    .replace(/[#>*_~|\-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getAllDocuments(): WikiDocument[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") && !file.startsWith("_"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
      const { data, content } = parseFrontmatter(raw);
      const plain = stripMarkdown(content);
      return {
        slug,
        title: String(data.title || slug),
        description: String(data.description || ""),
        category: String(data.category || "기타"),
        order: Number(data.order ?? 999),
        updated: String(data.updated || ""),
        aliases: Array.isArray(data.aliases) ? data.aliases.map(String) : [],
        content,
        excerpt: plain.slice(0, 220),
      } satisfies WikiDocument;
    })
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title, "ko"));
}

export function getDocument(slug: string) {
  return getAllDocuments().find((doc) => doc.slug === slug) ?? null;
}

export function getCategories() {
  const docs = getAllDocuments();
  const grouped = new Map<string, WikiDocument[]>();
  for (const doc of docs) {
    const current = grouped.get(doc.category) ?? [];
    current.push(doc);
    grouped.set(doc.category, current);
  }
  return Array.from(grouped.entries())
    .map(([name, items]) => ({ name, count: items.length, docs: items }))
    .sort((a, b) => a.name.localeCompare(b.name, "ko"));
}

function preprocessWikiLinks(markdown: string, docs: WikiDocument[]) {
  const existing = new Set(docs.map((doc) => doc.slug));
  return markdown.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, rawSlug, rawLabel) => {
    const slug = String(rawSlug).trim();
    const label = String(rawLabel || rawSlug).trim();
    const href = slug === "index" ? "/" : `/wiki/${encodeURIComponent(slug)}`;
    return existing.has(slug)
      ? `[${label}](${href})`
      : `[${label}](${href} "아직 만들어지지 않은 문서")`;
  });
}

export function extractToc(markdown: string): TocItem[] {
  const slugger = new GithubSlugger();
  return markdown
    .split("\n")
    .map((line) => {
      const match = /^(#{2,4})\s+(.+?)\s*$/.exec(line);
      if (!match) return null;
      const text = match[2].replace(/\[(.*?)\]\(.*?\)/g, "$1").replace(/[*_`~]/g, "").trim();
      return { level: match[1].length, text, id: slugger.slug(text) };
    })
    .filter((item): item is TocItem => item !== null);
}

export async function renderMarkdown(markdown: string) {
  const source = preprocessWikiLinks(markdown, getAllDocuments());
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, { behavior: "wrap" })
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(source);

  return String(result);
}

export function githubEditUrl(slug: string) {
  return `https://github.com/vividhyeok/wikiboutme/edit/main/content/${encodeURIComponent(slug)}.md`;
}
