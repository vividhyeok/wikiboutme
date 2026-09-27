"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SearchDoc = { slug: string; title: string; description: string; aliases: string[]; excerpt: string };

export default function SearchBox({ docs }: { docs: SearchDoc[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("ko");
  const results = useMemo(() => {
    if (!normalized) return [];
    return docs
      .map((doc) => {
        const title = doc.title.toLocaleLowerCase("ko");
        const aliases = doc.aliases.map((alias) => alias.toLocaleLowerCase("ko"));
        const haystack = [doc.title, doc.description, doc.excerpt, ...doc.aliases].join(" ").toLocaleLowerCase("ko");
        const score = title === normalized ? 4 : aliases.includes(normalized) ? 3 : title.includes(normalized) ? 2 : haystack.includes(normalized) ? 1 : 0;
        return { ...doc, score };
      })
      .filter((doc) => doc.score > 0)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, "ko"))
      .slice(0, 8);
  }, [docs, normalized]);

  function openFirstResult() {
    const first = results[0];
    if (!first) return;
    router.push(first.slug === "index" ? "/" : "/wiki/" + first.slug);
    setQuery("");
  }

  return (
    <div className="search-box">
      <label className="sr-only" htmlFor="wiki-search">위키 검색</label>
      <div className="search-input-row">
        <input
          id="wiki-search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") openFirstResult();
            if (event.key === "Escape") setQuery("");
          }}
          placeholder="검색"
          autoComplete="off"
          aria-expanded={Boolean(normalized)}
          aria-controls="wiki-search-results"
        />
        <button type="button" onClick={openFirstResult} aria-label="검색">⌕</button>
      </div>
      {normalized && (
        <div className="search-results" id="wiki-search-results" role="listbox">
          {results.length ? results.map((doc) => (
            <Link key={doc.slug} href={doc.slug === "index" ? "/" : "/wiki/" + doc.slug} onClick={() => setQuery("")} className="search-result">
              <strong>{doc.title}</strong>
              <span>{doc.description || doc.excerpt || "문서"}</span>
            </Link>
          )) : <div className="search-empty">일치하는 문서가 없습니다.</div>}
        </div>
      )}
    </div>
  );
}
