import Link from "next/link";
import ProfileInfobox from "@/components/ProfileInfobox";
import TableOfContents from "@/components/TableOfContents";
import { extractToc, githubEditUrl, renderMarkdown, type WikiDocument, type WikiConfig } from "@/lib/wiki";

export default async function WikiDocumentView({ doc, config }: { doc: WikiDocument; config: WikiConfig }) {
  const html = await renderMarkdown(doc.content);
  const toc = extractToc(doc.content);
  const isHome = doc.slug === config.wiki.homeDocument;
  const historyUrl = `https://github.com/vividhyeok/wikiboutme/commits/main/content/${encodeURIComponent(doc.slug)}.md`;

  return (
    <article className="wiki-document">
      <header className="document-header">
        <div><h1>{doc.title}</h1>{doc.description && <p>{doc.description}</p>}</div>
        <div className="document-actions">
          <a href={githubEditUrl(doc.slug)} target="_blank" rel="noreferrer">편집</a>
          <a href={historyUrl} target="_blank" rel="noreferrer">역사</a>
        </div>
      </header>
      <div className="document-subline">
        {config.wiki.showUpdatedDate && doc.updated && <span>최근 수정 시각: {doc.updated}</span>}
        <span>분류: <Link href={`/category/${encodeURIComponent(doc.category)}`}>{doc.category}</Link></span>
      </div>
      <div className="document-flow">
        {isHome && <ProfileInfobox profile={config.profile} />}
        {config.wiki.showTableOfContents && <TableOfContents items={toc} />}
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    </article>
  );
}
