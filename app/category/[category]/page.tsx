import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/wiki";

export function generateStaticParams() {
  return getCategories().map((category) => ({ category: category.name }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const name = decodeURIComponent(category);
  const group = getCategories().find((item) => item.name === name);
  if (!group) notFound();

  return (
    <article className="listing-page">
      <header className="document-header"><div><h1>분류:{group.name}</h1><p>{group.count}개의 문서</p></div></header>
      <div className="wiki-list">
        {group.docs.map((doc) => (
          <Link key={doc.slug} href={doc.slug === "index" ? "/" : `/wiki/${doc.slug}`}>
            <strong>{doc.title}</strong>
            <span>{doc.description || doc.excerpt}</span>
            {doc.updated && <small>{doc.updated}</small>}
          </Link>
        ))}
      </div>
    </article>
  );
}
