import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.join(process.cwd(), "prisma", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: "file:" + dbPath });
const prisma = new PrismaClient({ adapter } as ConstructorParameters<typeof PrismaClient>[0]);

async function main() {
  console.log("🌱 Seeding database...");

  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("✅ Database already seeded. Skipping.");
    return;
  }

  // ── SuperAdmin ────────────────────────────────────────────────
  const superPw = await bcrypt.hash("SuperAdmin@123", 12);
  await prisma.user.create({
    data: {
      email: "superadmin@goretail.com",
      password: superPw,
      name: "System Administrator",
      role: "SUPER_ADMIN",
      storeName: "GoCo Platform",
    },
  });
  console.log("✅ SuperAdmin: superadmin@goretail.com / SuperAdmin@123");

  const adminPw = await bcrypt.hash("Admin@123", 12);

  // ── Store 1: Fresh Organic Café ───────────────────────────────
  const cafeAdmin = await prisma.user.create({
    data: {
      email: "admin1@freshcafe.com",
      password: adminPw,
      name: "Sarah Chen",
      role: "ADMIN",
      storeName: "Fresh Organic Café",
      storeDesc: "Farm-fresh food & artisan coffee in the heart of the city",
      storeType: "Food & Beverage",
    },
  });
  console.log("✅ Store 1 Admin: admin1@freshcafe.com / Admin@123");

  // ── Store 2: Urban Fashion Boutique ──────────────────────────
  const fashionAdmin = await prisma.user.create({
    data: {
      email: "admin2@urbanfashion.com",
      password: adminPw,
      name: "Marcus Rodriguez",
      role: "ADMIN",
      storeName: "Urban Fashion Boutique",
      storeDesc: "Contemporary fashion for the modern lifestyle",
      storeType: "Clothing & Accessories",
    },
  });
  console.log("✅ Store 2 Admin: admin2@urbanfashion.com / Admin@123");

  // ── Store 3: Tech Gadgets Hub ─────────────────────────────────
  const techAdmin = await prisma.user.create({
    data: {
      email: "admin3@techgadgets.com",
      password: adminPw,
      name: "Priya Sharma",
      role: "ADMIN",
      storeName: "Tech Gadgets Hub",
      storeDesc: "Latest tech accessories & gadgets for every need",
      storeType: "Electronics & Accessories",
    },
  });
  console.log("✅ Store 3 Admin: admin3@techgadgets.com / Admin@123");

  // ── Store Settings (for the main/global settings page) ────────
  await prisma.storeSettings.create({
    data: {
      storeName: "GoRetail",
      storeTagline: "Sell Smarter, Grow Faster",
      currency: "INR",
      currencySymbol: "₹",
      primaryColor: "#0052CC",
      accentColor: "#1966E8",
    },
  });

  // ── Categories ────────────────────────────────────────────────
  const [food, clothing, electronics, accessories] = await Promise.all([
    prisma.category.create({ data: { name: "Food & Drinks", slug: "food-drinks", description: "Fresh food and beverages" } }),
    prisma.category.create({ data: { name: "Clothing", slug: "clothing", description: "Fashion and apparel" } }),
    prisma.category.create({ data: { name: "Electronics", slug: "electronics", description: "Tech gadgets and devices" } }),
    prisma.category.create({ data: { name: "Accessories", slug: "accessories", description: "Bags, cables, and more" } }),
  ]);

  // ── Café Products ──────────────────────────────────────────────
  const cafeProducts = [
    { name: "Espresso", slug: "espresso", description: "Rich, bold shot of premium arabica espresso.", price: 150, sku: "CAFE-001", images: [{ url: "https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=600", alt: "Espresso", isPrimary: true, order: 0 }] },
    { name: "Cappuccino", slug: "cappuccino", description: "Velvety espresso with perfectly steamed milk foam.", price: 180, sku: "CAFE-002", images: [{ url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600", alt: "Cappuccino", isPrimary: true, order: 0 }] },
    { name: "Avocado Toast", slug: "avocado-toast", description: "Sourdough toast topped with smashed avocado, cherry tomatoes & microgreens.", price: 250, sku: "CAFE-003", featured: true, images: [{ url: "https://images.unsplash.com/photo-1541519227354-08fa5d50c820?w=600", alt: "Avocado Toast", isPrimary: true, order: 0 }] },
    { name: "Croissant", slug: "croissant", description: "Flaky, buttery French croissant baked fresh every morning.", price: 100, sku: "CAFE-004", images: [{ url: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600", alt: "Croissant", isPrimary: true, order: 0 }] },
    { name: "Smoothie Bowl", slug: "smoothie-bowl", description: "Acai & berry smoothie base topped with granola, banana & coconut flakes.", price: 200, sku: "CAFE-005", featured: true, images: [{ url: "https://images.unsplash.com/photo-1490323814186-f77e3bb3e38f?w=600", alt: "Smoothie Bowl", isPrimary: true, order: 0 }] },
    { name: "Cold Brew Coffee", slug: "cold-brew", description: "24-hour steeped cold brew, served over ice. Smooth and strong.", price: 160, sku: "CAFE-006", images: [{ url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600", alt: "Cold Brew", isPrimary: true, order: 0 }] },
    { name: "Matcha Latte", slug: "matcha-latte", description: "Ceremonial grade matcha whisked with oat milk. Earthy and calming.", price: 190, sku: "CAFE-007", images: [{ url: "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=600", alt: "Matcha Latte", isPrimary: true, order: 0 }] },
    { name: "Granola Parfait", slug: "granola-parfait", description: "Layers of Greek yogurt, house-made granola, and seasonal berries.", price: 220, sku: "CAFE-008", images: [{ url: "https://images.unsplash.com/photo-1511690743698-d9d85f2fbf38?w=600", alt: "Granola Parfait", isPrimary: true, order: 0 }] },
  ];

  for (const { images, ...rest } of cafeProducts) {
    await prisma.product.create({
      data: { ...rest, featured: (rest as { featured?: boolean }).featured ?? false, storeId: cafeAdmin.id, categoryId: food.id, images: { create: images } },
    });
  }
  console.log(`✅ Created ${cafeProducts.length} café products`);

  // ── Fashion Products ──────────────────────────────────────────
  const fashionProducts = [
    { name: "Classic Cotton T-Shirt", slug: "classic-cotton-tshirt", description: "100% organic cotton tee. Breathable, soft, and built to last.", price: 500, comparePrice: 700, sku: "FASH-001", featured: true, images: [{ url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", alt: "T-Shirt", isPrimary: true, order: 0 }] },
    { name: "Summer Floral Dress", slug: "summer-floral-dress", description: "Light, airy dress perfect for warm days. Available in multiple prints.", price: 1200, comparePrice: 1600, sku: "FASH-002", featured: true, images: [{ url: "https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600", alt: "Dress", isPrimary: true, order: 0 }] },
    { name: "Premium Leather Jacket", slug: "leather-jacket", description: "Full-grain leather jacket with quilted lining. A timeless investment.", price: 3500, comparePrice: 4500, sku: "FASH-003", images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600", alt: "Leather Jacket", isPrimary: true, order: 0 }] },
    { name: "Casual Sneakers", slug: "casual-sneakers", description: "Clean, minimal sneakers in white canvas. Pairs with everything.", price: 2000, comparePrice: 2500, sku: "FASH-004", featured: true, images: [{ url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", alt: "Sneakers", isPrimary: true, order: 0 }] },
    { name: "Crossbody Bag", slug: "crossbody-bag", description: "Vegan leather crossbody. Multiple slots and a magnetic clasp.", price: 1800, sku: "FASH-005", images: [{ url: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600", alt: "Crossbody Bag", isPrimary: true, order: 0 }] },
    { name: "Linen Wide-Leg Pants", slug: "linen-pants", description: "Relaxed linen pants with an elastic waistband. Summer staple.", price: 900, comparePrice: 1200, sku: "FASH-006", images: [{ url: "https://images.unsplash.com/photo-1594938298603-c8148c4b4281?w=600", alt: "Pants", isPrimary: true, order: 0 }] },
    { name: "Striped Oversized Shirt", slug: "oversized-shirt", description: "Relaxed fit striped shirt in a breathable cotton blend.", price: 750, sku: "FASH-007", images: [{ url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600", alt: "Shirt", isPrimary: true, order: 0 }] },
  ];

  for (const { images, ...rest } of fashionProducts) {
    await prisma.product.create({
      data: { ...rest, featured: (rest as { featured?: boolean }).featured ?? false, storeId: fashionAdmin.id, categoryId: clothing.id, images: { create: images } },
    });
  }
  console.log(`✅ Created ${fashionProducts.length} fashion products`);

  // ── Tech Products ─────────────────────────────────────────────
  const techProducts = [
    { name: "Clear Phone Case", slug: "clear-phone-case", description: "Military-grade drop protection in a slim, crystal-clear design.", price: 400, comparePrice: 600, sku: "TECH-001", featured: true, images: [{ url: "https://images.unsplash.com/photo-1601972599720-36938d4ecd31?w=600", alt: "Phone Case", isPrimary: true, order: 0 }] },
    { name: "USB-C Braided Cable 2m", slug: "usbc-cable", description: "Nylon-braided USB-C cable. 100W fast charging, data transfer up to 480 Mbps.", price: 300, sku: "TECH-002", images: [{ url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600", alt: "USB Cable", isPrimary: true, order: 0 }] },
    { name: "15W Wireless Charger", slug: "wireless-charger", description: "Qi-certified 15W fast wireless charging pad. Compatible with all Qi devices.", price: 1500, comparePrice: 1999, sku: "TECH-003", featured: true, images: [{ url: "https://images.unsplash.com/photo-1591370874773-6702e8f12fd8?w=600", alt: "Wireless Charger", isPrimary: true, order: 0 }] },
    { name: "Tempered Glass Screen Protector", slug: "screen-protector", description: "9H hardness anti-fingerprint screen protector. Bubble-free application.", price: 200, sku: "TECH-004", images: [{ url: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600", alt: "Screen Protector", isPrimary: true, order: 0 }] },
    { name: "20000mAh Power Bank", slug: "power-bank", description: "Slim 20000mAh power bank. Dual USB-A + USB-C output. Charges 3 devices.", price: 1200, comparePrice: 1600, sku: "TECH-005", featured: true, images: [{ url: "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=600", alt: "Power Bank", isPrimary: true, order: 0 }] },
    { name: "Wireless Earbuds", slug: "wireless-earbuds", description: "32hr total playback. Active noise cancellation. IPX4 water resistance.", price: 2500, comparePrice: 3200, sku: "TECH-006", images: [{ url: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600", alt: "Earbuds", isPrimary: true, order: 0 }] },
    { name: "Phone Stand & Holder", slug: "phone-stand", description: "Adjustable aluminium phone stand for desk use. 360° rotation.", price: 450, sku: "TECH-007", images: [{ url: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600", alt: "Phone Stand", isPrimary: true, order: 0 }] },
    { name: "GaN 65W USB-C Charger", slug: "gan-charger", description: "Compact GaN charger. 65W via USB-C. Charge laptop, phone, tablet simultaneously.", price: 999, comparePrice: 1299, sku: "TECH-008", images: [{ url: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600", alt: "Charger", isPrimary: true, order: 0 }] },
  ];

  for (const { images, ...rest } of techProducts) {
    await prisma.product.create({
      data: { ...rest, featured: (rest as { featured?: boolean }).featured ?? false, storeId: techAdmin.id, categoryId: accessories.id, images: { create: images } },
    });
  }
  console.log(`✅ Created ${techProducts.length} tech products`);

  console.log("\n🎉 Database seeded!\n");
  console.log("─────────────────────────────────────────");
  console.log("  SuperAdmin:  superadmin@goretail.com / SuperAdmin@123");
  console.log("  Café Admin:  admin1@freshcafe.com    / Admin@123");
  console.log("  Fashion:     admin2@urbanfashion.com / Admin@123");
  console.log("  Tech:        admin3@techgadgets.com  / Admin@123");
  console.log("─────────────────────────────────────────");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
