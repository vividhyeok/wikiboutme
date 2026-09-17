import { notFound } from "next/navigation";
import WikiDocumentView from "@/components/WikiDocumentView";
import { getDocument, getWikiConfig } from "@/lib/wiki";

export default function HomePage() {
  const config = getWikiConfig();
  const doc = getDocument(config.wiki.homeDocument);
  if (!doc) notFound();
  return <WikiDocumentView doc={doc} config={config} />;
}
