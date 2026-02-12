import "dotenv/config";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Settings } from "@/models/Settings";
import { Category } from "@/models/Category";
import { Product } from "@/models/Product";
import fs from "fs";
import path from "path";

type Node = { name: { en: string; bn: string }; slug: string; children?: Node[] };

async function upsertNode(node: Node, parentId: any, ancestors: any[]) {
  const cat = await Category.findOneAndUpdate(
    { slug: node.slug },
    { name: node.name, slug: node.slug, parent: parentId, path: ancestors, isActive: true },
    { upsert: true, new: true }
  );
  const nextAncestors = [...ancestors, cat._id];
  if (node.children?.length) {
    for (const ch of node.children) await upsertNode(ch, cat._id, nextAncestors);
  }
  return cat;
}

async function main() {
  await dbConnect();

  // Settings
  await Settings.findOneAndUpdate({}, { shippingInsideDhaka: 60, shippingOutsideDhaka: 120 }, { upsert: true });

  // Admin
  const adminEmail = "admin@eahiazmart.com";
  const exists = await User.findOne({ email: adminEmail });
  if (!exists) {
    const passwordHash = await bcrypt.hash("Admin@123456", 10);
    await User.create({ name: "Admin", email: adminEmail, passwordHash, role: "admin" });
    console.log("Admin created:", adminEmail, "pass: Admin@123456");
  } else {
    console.log("Admin exists:", adminEmail);
  }

  // Categories
  const treePath = path.join(process.cwd(), "scripts", "seedCategoryTree.json");
  const tree = JSON.parse(fs.readFileSync(treePath, "utf8")) as Node[];
  for (const root of tree) await upsertNode(root, null, []);

  // Sample products
  const anyLeaf = await Category.findOne({ slug: "smartphones" }).lean();
  if (anyLeaf) {
    await Product.findOneAndUpdate(
      { slug: "sample-smartphone-1" },
      {
        title: { en: "Sample Smartphone 1", bn: "স্যাম্পল স্মার্টফোন ১" },
        slug: "sample-smartphone-1",
        description: { en: "Demo product for seed.", bn: "সিড ডেমো পণ্য।" },
        category: anyLeaf._id,
        price: 19999,
        salePrice: 17999,
        stock: 50,
        images: [{ url: "https://res.cloudinary.com/demo/image/upload/sample.jpg", publicId: "demo/sample" }],
        variants: [{ name: "Color", options: [{ label: "Black", value: "black" }, { label: "Blue", value: "blue" }] }],
        featured: true,
        isActive: true,
      },
      { upsert: true }
    );
  }

  console.log("Seed complete.");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
