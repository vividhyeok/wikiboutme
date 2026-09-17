import Link from "next/link";
import { getAllDocuments } from "@/lib/wiki";

export const metadata = { title: "최근 수정" };

export default function RecentPage() {
  const docs = getAllDocuments().sort((a, b) => b.updated.localeCompare(a.updated));
  return (
    <article className="listing-page">
      <header className="document-header"><div><h1>최근 수정</h1><p>frontmatter의 updated 값을 기준으로 정렬합니다.</p></div></header>
      <div className="recent-table" role="table">
        {docs.map((doc) => (
          <Link key={doc.slug} href={doc.slug === "index" ? "/" : `/wiki/${doc.slug}`} className="recent-row">
            <time>{doc.updated || "날짜 없음"}</time>
            <strong>{doc.title}</strong>
            <span>{doc.category}</span>
          </Link>
        ))}
      </div>
    </article>
  );
}
