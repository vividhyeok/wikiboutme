import Image from "next/image";
import Link from "next/link";
import type { WikiDocument } from "@/lib/wiki";

const keywords = ["ENTP", "5w6", "인간관계", "취향", "음악", "애니", "AI", "스케이트보드"];

export default function RightRail({ docs }: { docs: WikiDocument[] }) {
  const recent = [...docs]
    .filter((doc) => doc.slug !== "index")
    .sort((a, b) => b.updated.localeCompare(a.updated) || a.order - b.order)
    .slice(0, 7);

  return (
    <aside className="right-rail" aria-label="보조 정보">
      <section className="rail-card">
        <div className="rail-title">주요 키워드 <span>›</span></div>
        <ol className="keyword-list">
          {keywords.map((keyword, index) => (
            <li key={keyword}>
              <span>{index + 1}</span>
              <Link href={`/wiki/personality#${index < 2 ? (index === 0 ? "1-mbti" : "2-에니어그램") : "3-성향-키워드"}`}>{keyword}</Link>
            </li>
          ))}
        </ol>
      </section>

      <section className="rail-card">
        <div className="rail-title">최근 변경 <span>›</span></div>
        <div className="rail-recent">
          {recent.map((doc) => (
            <Link key={doc.slug} href={`/wiki/${doc.slug}`}>
              <span>{doc.title}</span>
              <time>{doc.updated ? doc.updated.slice(5) : "-"}</time>
            </Link>
          ))}
        </div>
      </section>

      <a className="rail-ad" href="https://blog.naver.com/vividm00d" target="_blank" rel="noreferrer" aria-label="Vivid Mood 블로그 열기">
        <Image src="/sidebar-ad.svg" alt="Vivid Mood archive" width={300} height={600} sizes="280px" />
      </a>
    </aside>
  );
}
