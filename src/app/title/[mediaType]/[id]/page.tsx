import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TitleDetails from "@/components/title-details";

type PageProps = { params: Promise<{ mediaType: string; id: string }> };

export const metadata: Metadata = {
  title: "Title details — ZEX BOX",
  description: "Explore cast, seasons, episodes, trailers and authorized viewing options on ZEX BOX."
};

export default async function TitlePage({ params }: PageProps) {
  const { mediaType, id } = await params;
  if ((mediaType !== "movie" && mediaType !== "tv") || !/^\d{1,12}$/.test(id)) notFound();
  return <TitleDetails mediaType={mediaType} id={id} />;
}
