"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type SearchDoc = { slug: string; title: string; description: string; aliases: string[]; excerpt: string };
export default function SearchBox({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLocaleLowerCase("ko");
  const results = useMemo(() => normalized ? docs.filter((doc) => [doc.title, doc.description, doc.excerpt, ...doc.aliases].join(" ").toLocaleLowerCase("ko").includes(normalized)).slice(0, 8) : [], [docs, normalized]);
  return <div className="search-box"><label className="sr-only" htmlFor="wiki-search">위키 검색</label><input id="wiki-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="검색" autoComplete="off" />{normalized && <div className="search-results">{results.length ? results.map((doc) => <Link key={doc.slug} href={doc.slug === "index" ? "/" : `/wiki/${doc.slug}`} onClick={() => setQuery("")} className="search-result"><strong>{doc.title}</strong><span>{doc.description}</span></Link>) : <div className="search-empty">일치하는 문서가 없습니다.</div>}</div>}</div>;
}
