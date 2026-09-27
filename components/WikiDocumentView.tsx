import Link from "next/link";
import ProfileInfobox from "@/components/ProfileInfobox";
import TableOfContents from "@/components/TableOfContents";
import { extractToc, githubEditUrl, renderMarkdown, type WikiDocument, type WikiConfig } from "@/lib/wiki";

export default async function WikiDocumentView({ doc, config }: { doc: WikiDocument; config: WikiConfig }) {
  const html = await renderMarkdown(doc.content);
  const toc = extractToc(doc.content);
  const isHome = doc.slug === config.wiki.homeDocument;
  const encodedSlug = encodeURIComponent(doc.slug);
  const historyUrl = "https://github.com/vividhyeok/wikiboutme/commits/main/content/" + encodedSlug + ".md";
  const discussionUrl = "https://github.com/vividhyeok/wikiboutme/issues?q=" + encodeURIComponent(doc.title);

  return (
    <article className="wiki-document">
      <header className="document-header">
        <div><h1>{doc.title}</h1>{doc.description && <p>{doc.description}</p>}</div>
        <div className="document-actions" aria-label="문서 도구">
          <a href={githubEditUrl(doc.slug)} target="_blank" rel="noreferrer">편집</a>
          <a href={historyUrl} target="_blank" rel="noreferrer">역사</a>
          <a href={discussionUrl} target="_blank" rel="noreferrer">토론</a>
        </div>
      </header>
      <div className="document-subline">
        {config.wiki.showUpdatedDate && doc.updated && <span>최근 수정 시각: {doc.updated}</span>}
        {doc.aliases.length > 0 && <span>다른 이름: {doc.aliases.join(", ")}</span>}
      </div>
      <div className="document-flow">
        {isHome && <ProfileInfobox profile={config.profile} />}
        {config.wiki.showTableOfContents && <TableOfContents items={toc} />}
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <div className="wiki-category-box">
        <strong>분류:</strong>
        <Link href={"/category/" + encodeURIComponent(doc.category)}>{doc.category}</Link>
      </div>
    </article>
  );
}
