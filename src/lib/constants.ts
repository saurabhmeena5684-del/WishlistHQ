import type { Product, Status } from "./types";

export const APP_NAME = "Vitrine";

export const CATEGORIES = [
  "Fashion",
  "Footwear",
  "Electronics",
  "Beauty",
  "Home",
  "Accessories",
  "Sports",
  "Other",
] as const;

export const STATUS_META: Record<
  Status,
  { label: string; hint: string; tone: "neutral" | "warm" | "good" | "mute" }
> = {
  watching: { label: "Watching", hint: "Keeping an eye", tone: "neutral" },
  sale: { label: "Wait for sale", hint: "Buy when cheaper", tone: "warm" },
  budget: { label: "Wait for budget", hint: "Buy when ready", tone: "warm" },
  bought: { label: "Bought", hint: "Already yours", tone: "good" },
  passed: { label: "Passed", hint: "Let it go", tone: "mute" },
};

export const COLOR_SWATCHES: { name: string; hex: string }[] = [
  { name: "Black", hex: "#1a1a1a" },
  { name: "White", hex: "#f5f5f2" },
  { name: "Ivory", hex: "#ece6d9" },
  { name: "Beige", hex: "#d8cbb8" },
  { name: "Tan", hex: "#c4a574" },
  { name: "Brown", hex: "#6b4a32" },
  { name: "Navy", hex: "#1c2a4a" },
  { name: "Blue", hex: "#3d6ea8" },
  { name: "Teal", hex: "#2f6b66" },
  { name: "Green", hex: "#3f6b46" },
  { name: "Olive", hex: "#6b6b3a" },
  { name: "Red", hex: "#9b2c2c" },
  { name: "Burgundy", hex: "#6b2434" },
  { name: "Pink", hex: "#d4a0b0" },
  { name: "Grey", hex: "#7a7a7a" },
  { name: "Silver", hex: "#c5c5c8" },
  { name: "Multi", hex: "multi" },
];

export const SAMPLE_ITEMS: Product[] = [
  {
    id: "sample-coat",
    name: "Oversized wool overcoat",
    url: "https://www.zara.com/",
    imageUrl:
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=900&q=80",
    category: "Fashion",
    price: 7990,
    targetPrice: 5990,
    currency: "INR",
    colors: ["Camel", "Black"],
    brand: "Zara",
    website: "Zara",
    notes: "Wait for winter sale.",
    status: "sale",
    createdAt: "2026-09-12T10:00:00.000Z",
    updatedAt: "2026-09-12T10:00:00.000Z",
    sample: true,
  },
  {
    id: "sample-phones",
    name: "WH-1000XM5 wireless headphones",
    url: "https://www.amazon.in/",
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
    category: "Electronics",
    price: 24990,
    targetPrice: 19990,
    currency: "INR",
    colors: ["Black", "Silver"],
    brand: "Sony",
    website: "Amazon",
    notes: "Price-drop alert set in my head.",
    status: "watching",
    createdAt: "2026-09-18T08:00:00.000Z",
    updatedAt: "2026-09-18T08:00:00.000Z",
    sample: true,
  },
  {
    id: "sample-kicks",
    name: "Air Max everyday sneakers",
    url: "https://www.nike.com/",
    imageUrl:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
    category: "Footwear",
    price: 8495,
    targetPrice: null,
    currency: "INR",
    colors: ["Red", "White"],
    brand: "Nike",
    website: "Nike",
    notes: "",
    status: "budget",
    createdAt: "2026-09-20T12:00:00.000Z",
    updatedAt: "2026-09-20T12:00:00.000Z",
    sample: true,
  },
  {
    id: "sample-lamp",
    name: "Paper shade table lamp",
    url: "https://www.ikea.com/",
    imageUrl:
      "https://images.unsplash.com/photo-1507473883500-ef53c3793acc?auto=format&fit=crop&w=900&q=80",
    category: "Home",
    price: 2499,
    targetPrice: null,
    currency: "INR",
    colors: ["Ivory", "Wood"],
    brand: "IKEA",
    website: "IKEA",
    notes: "For the reading corner.",
    status: "watching",
    createdAt: "2026-09-22T16:00:00.000Z",
    updatedAt: "2026-09-22T16:00:00.000Z",
    sample: true,
  },
];

export const SHEET_HEADERS = [
  "Id",
  "Name",
  "Link",
  "Category",
  "Price",
  "Target",
  "Currency",
  "Colors",
  "Brand",
  "Website",
  "Status",
  "Notes",
  "Image",
  "Added",
] as const;
