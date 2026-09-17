import Link from "next/link";
import TableOfContents from "@/components/TableOfContents";
import { extractToc, githubEditUrl, renderMarkdown, type WikiDocument, type WikiConfig } from "@/lib/wiki";

export default async function WikiDocumentView({ doc, config }: { doc: WikiDocument; config: WikiConfig }) {
  const html = await renderMarkdown(doc.content);
  const toc = extractToc(doc.content);

  return (
    <article className="wiki-document">
      <header className="document-header">
        <div>
          <h1>{doc.title}</h1>
          {doc.description && <p>{doc.description}</p>}
        </div>
        <div className="document-actions">
          <a href={githubEditUrl(doc.slug)} target="_blank" rel="noreferrer">편집</a>
        </div>
      </header>

      <div className="document-subline">
        {config.wiki.showUpdatedDate && doc.updated && <span>최근 수정: {doc.updated}</span>}
        <span>분류: <Link href={`/category/${encodeURIComponent(doc.category)}`}>{doc.category}</Link></span>
      </div>

      {config.wiki.showTableOfContents && <TableOfContents items={toc} />}
      <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />

      <footer className="document-footer">
        <span>이 문서는 GitHub의 Markdown 파일을 원본으로 사용합니다.</span>
        <a href={githubEditUrl(doc.slug)} target="_blank" rel="noreferrer">GitHub에서 이 문서 편집</a>
      </footer>
    </article>
  );
}
