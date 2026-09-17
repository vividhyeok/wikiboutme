import type { TocItem } from "@/lib/wiki";

export default function TableOfContents({ items }: { items: TocItem[] }) {
  if (!items.length) return null;
  return (
    <nav className="toc" aria-label="문서 목차">
      <div className="toc-title">목차</div>
      <ol>
        {items.map((item, index) => (
          <li key={`${item.id}-${index}`} className={`toc-level-${item.level}`}>
            <a href={`#${item.id}`}><span>{index + 1}.</span> {item.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
