import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import SearchBox from "@/components/SearchBox";
import ThemeToggle from "@/components/ThemeToggle";
import { getAllDocuments, getCategories, getWikiConfig } from "@/lib/wiki";

export async function generateMetadata(): Promise<Metadata> {
  const config = getWikiConfig();
  return {
    title: { default: config.siteName, template: `%s - ${config.siteName}` },
    description: config.siteDescription,
    openGraph: { title: config.siteName, description: config.siteDescription, type: "website" },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const config = getWikiConfig();
  const docs = getAllDocuments();
  const categories = getCategories();
  const searchDocs = docs.map(({ slug, title, description, aliases, excerpt }) => ({ slug, title, description, aliases, excerpt }));
  const cssVars = {
    "--accent": config.theme.accentColor,
    "--link": config.theme.linkColor,
    "--content-max": config.theme.maxContentWidth,
  } as React.CSSProperties;

  return (
    <html lang="ko" suppressHydrationWarning>
      <body style={cssVars} className={`${config.appearance.roundedCorners ? "rounded-ui" : ""} ${config.appearance.compactLayout ? "compact-ui" : ""}`.trim()}>
        <header className="topbar">
          <div className="topbar-inner">
            <Link href="/" className="brand" aria-label="wikiboutme 홈">
              <span className="brand-mark">W</span>
              <span>{config.siteName}</span>
            </Link>
            {config.navigation.showSearch && <SearchBox docs={searchDocs} />}
            <nav className="top-actions" aria-label="상단 메뉴">
              {config.navigation.showRecentChanges && <Link href="/recent">최근 수정</Link>}
              <ThemeToggle defaultTheme={config.appearance.defaultTheme} />
            </nav>
            <details className="mobile-menu">
              <summary aria-label="메뉴 열기">☰</summary>
              <div className="mobile-menu-panel">
                <Link href="/">대문</Link>
                {config.navigation.showRecentChanges && <Link href="/recent">최근 수정</Link>}
                {categories.map((category) => (
                  <Link key={category.name} href={`/category/${encodeURIComponent(category.name)}`}>{category.name}</Link>
                ))}
              </div>
            </details>
          </div>
        </header>

        <div className="site-shell">
          {config.navigation.showSidebar && (
            <aside className="sidebar">
              <nav aria-label="위키 탐색">
                <section>
                  <h2>wikiboutme</h2>
                  <Link href="/">대문</Link>
                  {config.navigation.showRecentChanges && <Link href="/recent">최근 수정</Link>}
                </section>
                <section>
                  <h2>문서</h2>
                  {docs.filter((doc) => doc.slug !== "index").map((doc) => (
                    <Link key={doc.slug} href={`/wiki/${doc.slug}`}>{doc.title}</Link>
                  ))}
                </section>
                {config.navigation.showCategories && (
                  <section>
                    <h2>분류</h2>
                    {categories.map((category) => (
                      <Link key={category.name} href={`/category/${encodeURIComponent(category.name)}`}>
                        {category.name} <small>{category.count}</small>
                      </Link>
                    ))}
                  </section>
                )}
              </nav>
            </aside>
          )}

          <main className="main-column">{children}</main>
        </div>

        <footer className="site-footer">
          <div>
            <span>{config.siteName}</span>
            <span>Markdown + GitHub 기반 개인 위키</span>
          </div>
          <div>
            <a href="https://github.com/vividhyeok/wikiboutme/edit/main/content/_config.md" target="_blank" rel="noreferrer">위키 설정</a>
            <a href="https://github.com/vividhyeok/wikiboutme/blob/main/content/_editing-guide.md" target="_blank" rel="noreferrer">작성 가이드</a>
            <a href="https://github.com/vividhyeok/wikiboutme" target="_blank" rel="noreferrer">GitHub</a>
          </div>
        </footer>
      </body>
    </html>
  );
}
