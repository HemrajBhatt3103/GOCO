import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import SuperAdminClient from "./SuperAdminClient";

export default async function SuperAdminDashboard() {
  const session = await getSession();
  if (!session || session.role !== "SUPER_ADMIN") {
    redirect("/login");
  }

  const [admins, totalProducts, totalCategories, totalCustomers, settings, subscription] =
    await Promise.all([
      prisma.user.findMany({
        where: { role: "ADMIN" },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { products: true, customers: true } },
        },
      }),
      prisma.product.count(),
      prisma.category.count(),
      prisma.customer.count(),
      prisma.storeSettings.findFirst(),
      prisma.subscription.findFirst({ orderBy: { createdAt: "desc" } }),
    ]);

  const stores = admins.map((a) => ({
    id: a.id,
    name: a.storeName ?? a.name,
    email: a.email,
    storeType: a.storeType ?? undefined,
    productCount: a._count.products,
    customerCount: a._count.customers,
    createdAt: a.createdAt.toISOString(),
  }));

  return (
    <SuperAdminClient
      session={{ name: session.name, email: session.email }}
      stores={stores}
      stats={{
        totalStores: stores.length,
        totalProducts,
        totalCategories,
        totalAdmins: admins.length,
        totalCustomers,
      }}
      settings={
        settings
          ? {
              storeName: settings.storeName,
              currency: settings.currency,
              currencySymbol: settings.currencySymbol,
              storeTagline: settings.storeTagline ?? "",
            }
          : null
      }
      subscription={
        subscription
          ? {
              planName: subscription.planName,
              startDate: subscription.startDate.toISOString(),
              endDate: subscription.endDate.toISOString(),
              status: subscription.status,
            }
          : null
      }
    />
  );
}

