import Image from "next/image";
import Link from "next/link";
import type { WikiDocument } from "@/lib/wiki";

export default function RightRail({ docs }: { docs: WikiDocument[] }) {
  const recent = [...docs]
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.order - b.order)
    .slice(0, 7);
  const categories = Array.from(new Set(docs.map((doc) => doc.category)))
    .sort((a, b) => a.localeCompare(b, "ko"))
    .slice(0, 8);

  return (
    <aside className="right-rail" aria-label="위키 보조 정보">
      <section className="rail-card">
        <div className="rail-heading">
          <strong>최근 변경</strong>
          <Link href="/recent">더 보기</Link>
        </div>
        <div className="rail-recent">
          {recent.map((doc) => (
            <Link key={doc.slug} href={doc.slug === "index" ? "/" : "/wiki/" + doc.slug}>
              <span>{doc.title}</span>
              <time>{doc.updated ? doc.updated.slice(5) : "-"}</time>
            </Link>
          ))}
        </div>
      </section>
      {categories.length > 0 && (
        <section className="rail-card">
          <div className="rail-heading"><strong>분류</strong></div>
          <div className="rail-categories">
            {categories.map((category) => (
              <Link key={category} href={"/category/" + encodeURIComponent(category)}>{category}</Link>
            ))}
          </div>
        </section>
      )}
      <div>
        <div className="rail-ad-label">ADVERTISEMENT</div>
        <div className="rail-ad">
          <Image src="/ad-kimchi.png" alt="광고 이미지" width={684} height={2048} sizes="260px" />
        </div>
      </div>
    </aside>
  );
}
