import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import RightRail from "@/components/RightRail";
import SearchBox from "@/components/SearchBox";
import ThemeToggle from "@/components/ThemeToggle";
import { getAllDocuments, getWikiConfig } from "@/lib/wiki";

export async function generateMetadata(): Promise<Metadata> {
  const config = getWikiConfig();
  return { title: { default: config.siteName, template: `%s - ${config.siteName}` }, description: config.siteDescription };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = getWikiConfig();
  const docs = getAllDocuments();
  const searchDocs = docs.map(({ slug, title, description, aliases, excerpt }) => ({ slug, title, description, aliases, excerpt }));
  const cssVars = { "--link": config.theme.linkColor, "--content-max": config.theme.maxContentWidth } as React.CSSProperties;

  return (
    <html lang="ko" suppressHydrationWarning data-theme={config.appearance.defaultTheme}>
      <body style={cssVars}>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand"><span className="brand-mark">W</span><span>{config.siteName}</span></Link>
            <nav className="top-links"><span>최근 변경</span><span>최근 토론</span></nav>
            <SearchBox docs={searchDocs} />
            <ThemeToggle defaultTheme={config.appearance.defaultTheme} />
          </div>
        </header>
        <div className="site-shell">
          <main className="main-column">{children}</main>
          <RightRail />
        </div>
        <footer className="site-footer"><span>{config.siteName}</span><span>이 문서의 내용은 작성 시점에 따라 달라질 수 있습니다.</span></footer>
      </body>
    </html>
  );
}
