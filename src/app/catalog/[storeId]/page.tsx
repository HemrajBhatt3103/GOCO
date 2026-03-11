import { Metadata } from "next";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import StoreCatalogContent from "./StoreCatalogContent";

interface Props {
  params: Promise<{ storeId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { storeId } = await params;
  const store = await prisma.user.findUnique({
    where: { id: storeId, role: "ADMIN" },
    select: { storeName: true, storeDesc: true },
  });
  if (!store) return { title: "Store Not Found" };
  return {
    title: store.storeName ?? "Store Catalog",
    description: store.storeDesc ?? undefined,
  };
}

export default async function StoreCatalogPage({ params }: Props) {
  const { storeId } = await params;

  const store = await prisma.user.findUnique({
    where: { id: storeId, role: "ADMIN" },
    select: { id: true },
  });

  if (!store) notFound();

  return <StoreCatalogContent storeId={storeId} />;
}
