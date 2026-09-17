import type { Metadata } from "next";
import { notFound } from "next/navigation";
import WikiDocumentView from "@/components/WikiDocumentView";
import { getAllDocuments, getDocument, getWikiConfig } from "@/lib/wiki";

export function generateStaticParams() {
  return getAllDocuments().filter((doc) => doc.slug !== "index").map((doc) => ({ slug: doc.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const doc = getDocument(decodeURIComponent(slug));
  if (!doc) return {};
  return { title: doc.title, description: doc.description || doc.excerpt };
}

export default async function WikiPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const doc = getDocument(decodeURIComponent(slug));
  if (!doc || doc.slug === "index") notFound();
  return <WikiDocumentView doc={doc} config={getWikiConfig()} />;
}
