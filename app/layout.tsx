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
  return {
    title: { default: config.siteName, template: "%s - " + config.siteName },
    description: config.siteDescription,
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = getWikiConfig();
  const docs = getAllDocuments();
  const searchDocs = docs.map(({ slug, title, description, aliases, excerpt }) => ({
    slug, title, description, aliases, excerpt,
  }));
  const cssVars = {
    "--accent": config.theme.accentColor,
    "--topbar": config.theme.accentColor,
    "--link": config.theme.linkColor,
    "--content-max": config.theme.maxContentWidth,
  } as React.CSSProperties;
  const bodyClass = [
    config.appearance.roundedCorners ? "rounded-ui" : "",
    config.appearance.compactLayout ? "compact-ui" : "",
  ].filter(Boolean).join(" ");

  return (
    <html lang="ko" suppressHydrationWarning data-theme={config.appearance.defaultTheme}>
      <body style={cssVars} className={bodyClass}>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label={config.siteName + " 대문"}>
              <span className="brand-mark">W</span>
              <span>{config.siteName}</span>
            </Link>
            <nav className="top-links" aria-label="위키 메뉴">
              {config.navigation.showRecentChanges && <Link href="/recent">최근 변경</Link>}
              <a href="https://github.com/vividhyeok/wikiboutme/issues" target="_blank" rel="noreferrer">토론</a>
            </nav>
            {config.navigation.showSearch && <SearchBox docs={searchDocs} />}
            <ThemeToggle defaultTheme={config.appearance.defaultTheme} />
          </div>
        </header>
        <div className="site-shell">
          <main className="main-column">{children}</main>
          {config.navigation.showSidebar && <RightRail docs={docs} />}
        </div>
        <footer className="site-footer">
          <span>{config.siteName}</span>
          <span>Markdown · GitHub 기반 개인 위키</span>
        </footer>
      </body>
    </html>
  );
}
