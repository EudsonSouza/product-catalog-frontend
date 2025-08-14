"use client";

import { useMemo, useState } from "react";

// ---- Seed payload (replace later with a fetch) ----
const products = [
  {
    id: "0203edcb-3a42-4b4b-85fb-5ba1a7c1fc71",
    name: "Sleek Metal Tuna",
    description:
      "The automobile layout consists of a front-engine design, with transaxle-type transmissions mounted at the rear of the engine and four wheel drive",
    slug: "sleek-metal-tuna",
    categoryId: "8a5e78b9-3866-4c15-b3c3-5967154f4a99",
    gender: 1,
    basePrice: 41.77,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-10-13T19:49:20.811085Z",
    updatedAt: "2024-11-07T19:49:20.811085Z",
  },
  {
    id: "06f5008b-a98b-4d38-9872-659cb2c67fa9",
    name: "Awesome Cotton Chair",
    description:
      "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
    slug: "awesome-cotton-chair",
    categoryId: "8a5e78b9-3866-4c15-b3c3-5967154f4a99",
    gender: 0,
    basePrice: 96.05,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-09-05T17:53:09.97388Z",
    updatedAt: "2024-09-23T17:53:09.97388Z",
  },
  {
    id: "0c662bbf-f306-464a-9e0a-00a0ad024ef2",
    name: "Tasty Concrete Car",
    description: "The Football Is Good For Training And Recreational Purposes",
    slug: "tasty-concrete-car",
    categoryId: "8a5e78b9-3866-4c15-b3c3-5967154f4a99",
    gender: 1,
    basePrice: 89.39,
    isActive: true,
    isFeatured: false,
    createdAt: "2025-02-16T07:16:41.78981Z",
    updatedAt: "2025-02-27T07:16:41.78981Z",
  },
  {
    id: "0eae88c3-f512-482f-90c1-5faffd402700",
    name: "Sleek Steel Pizza",
    description:
      "Andy shoes are designed to keeping in mind durability as well as trends, the most stylish range of shoes & sandals",
    slug: "sleek-steel-pizza",
    categoryId: "de5a10ce-e335-4388-8e29-aaf5d3951ad0",
    gender: 2,
    basePrice: 22.36,
    isActive: true,
    isFeatured: false,
    createdAt: "2025-04-01T23:14:54.74538Z",
    updatedAt: "2025-04-10T23:14:54.74538Z",
  },
  {
    id: "0f392cc3-c5d1-4b38-94b7-894988e507cb",
    name: "Gorgeous Metal Cheese",
    description:
      "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
    slug: "gorgeous-metal-cheese",
    categoryId: "9d9eda5a-d3cc-4b91-9222-8e3dc0552917",
    gender: 2,
    basePrice: 57.65,
    isActive: true,
    isFeatured: true,
    createdAt: "2025-01-10T04:37:09.430712Z",
    updatedAt: "2025-01-19T04:37:09.430712Z",
  },
  {
    id: "13305363-4493-42ea-858d-9a0f345b5d73",
    name: "Unbranded Concrete Chair",
    description:
      "Boston's most advanced compression wear technology increases muscle oxygenation, stabilizes active muscles",
    slug: "unbranded-concrete-chair",
    categoryId: "eff38d2d-f60b-4fd1-87ef-eb927f14535f",
    gender: 2,
    basePrice: 153.01,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-11-28T21:54:11.10505Z",
    updatedAt: "2024-12-23T21:54:11.10505Z",
  },
  {
    id: "156d501a-ef32-403e-a10d-deae9f1b2ada",
    name: "Sleek Granite Soap",
    description:
      "Carbonite web goalkeeper gloves are ergonomically designed to give easy fit",
    slug: "sleek-granite-soap",
    categoryId: "127ad0df-6b0b-400c-8c4e-a39b6c5e6023",
    gender: 0,
    basePrice: 163.41,
    isActive: true,
    isFeatured: false,
    createdAt: "2024-08-26T23:31:28.414793Z",
    updatedAt: "2024-09-19T23:31:28.414793Z",
  },
  {
    id: "1a99d61b-99c8-491c-870a-9e406882a1b9",
    name: "Awesome Steel Shoes",
    description:
      "Ergonomic executive chair upholstered in bonded black leather and PVC padded seat and back for all-day comfort and support",
    slug: "awesome-steel-shoes",
    categoryId: "9d9eda5a-d3cc-4b91-9222-8e3dc0552917",
    gender: 0,
    basePrice: 95.3,
    isActive: true,
    isFeatured: true,
    createdAt: "2025-02-08T12:41:52.148815Z",
    updatedAt: "2025-03-06T12:41:52.148815Z",
  },
  {
    id: "26b00abd-438a-4889-ab1c-5b09832934e2",
    name: "Fantastic Fresh Pizza",
    description:
      "New range of formal shirts are designed keeping you in mind. With fits and styling that will make you stand apart",
    slug: "fantastic-fresh-pizza",
    categoryId: "eff38d2d-f60b-4fd1-87ef-eb927f14535f",
    gender: 0,
    basePrice: 104.01,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-12-22T00:16:44.497121Z",
    updatedAt: "2025-01-05T00:16:44.497121Z",
  },
  {
    id: "2c006292-63da-46ed-87ec-581c9e0785c2",
    name: "Rustic Soft Hat",
    description: "The Football Is Good For Training And Recreational Purposes",
    slug: "rustic-soft-hat",
    categoryId: "de5a10ce-e335-4388-8e29-aaf5d3951ad0",
    gender: 1,
    basePrice: 140.31,
    isActive: true,
    isFeatured: true,
    createdAt: "2024-10-07T22:54:59.636491Z",
    updatedAt: "2024-10-16T22:54:59.636491Z",
  },
];

// ---- Helpers ----
const GENDER_LABEL: Record<number, string> = {
  0: "Male",
  1: "Female",
  2: "Unisex",
};

function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

function isNew(dateIso: string) {
  const created = new Date(dateIso).getTime();
  const days30 = 1000 * 60 * 60 * 24 * 30;
  return Date.now() - created < days30;
}

function cn(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

// ---- UI Controls + Grid ----
export default function Page() {
  const [query, setQuery] = useState("");
  const [gender, setGender] = useState<"all" | 0 | 1 | 2>("all");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [sort, setSort] = useState<
    "newest" | "priceAsc" | "priceDesc" | "name"
  >("newest");

  const filtered = useMemo(() => {
    let data = products.filter((p) => p.isActive);

    if (query.trim()) {
      const q = query.toLowerCase();
      data = data.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    if (gender !== "all") {
      data = data.filter((p) => p.gender === gender);
    }

    if (featuredOnly) {
      data = data.filter((p) => p.isFeatured);
    }

    switch (sort) {
      case "priceAsc":
        data = [...data].sort((a, b) => a.basePrice - b.basePrice);
        break;
      case "priceDesc":
        data = [...data].sort((a, b) => b.basePrice - a.basePrice);
        break;
      case "name":
        data = [...data].sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "newest":
      default:
        data = [...data].sort(
          (a, b) => +new Date(b.createdAt) - +new Date(a.createdAt)
        );
    }

    return data;
  }, [query, gender, featuredOnly, sort]);

  return (
    <main className="min-h-dvh bg-neutral-950 text-neutral-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Product Catalog
            </h1>
            <p className="text-neutral-400 mt-1">
              Responsive grid with search, filters and badges.
            </p>
          </div>

          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products…"
                className="w-full rounded-2xl bg-neutral-900 border border-neutral-800 px-4 py-2.5 outline-none focus:border-neutral-600"
              />
              <span className="pointer-events-none absolute right-3 top-2.5 text-neutral-500 text-sm">
                ⌘K
              </span>
            </div>

            <select
              value={gender as any}
              onChange={(e) =>
                setGender(
                  (e.target.value as any) === "all"
                    ? "all"
                    : (Number(e.target.value) as 0 | 1 | 2)
                )
              }
              className="rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2.5"
            >
              <option value="all">Gender: All</option>
              <option value={0}>Male</option>
              <option value={1}>Female</option>
              <option value={2}>Unisex</option>
            </select>

            <button
              onClick={() => setFeaturedOnly((v) => !v)}
              className={cn(
                "rounded-2xl px-4 py-2.5 border transition",
                featuredOnly
                  ? "bg-emerald-600/20 border-emerald-600/40"
                  : "bg-neutral-900 border-neutral-800 hover:border-neutral-700"
              )}
            >
              {featuredOnly ? "★ Featured only" : "☆ Include all"}
            </button>

            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-2xl bg-neutral-900 border border-neutral-800 px-3 py-2.5"
            >
              <option value="newest">Sort: Newest</option>
              <option value="priceAsc">Price ↑</option>
              <option value="priceDesc">Price ↓</option>
              <option value="name">Name A→Z</option>
            </select>
          </div>
        </header>

        {/* Grid */}
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((p) => (
            <li key={p.id} className="group">
              <article
                className="h-full rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 to-neutral-950 p-4 shadow-lg shadow-black/20 hover:shadow-black/40 transition"
                title={p.name}
              >
                {/* Media placeholder */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-inset ring-neutral-800">
                  <div className="absolute inset-0 opacity-60 bg-[radial-gradient(ellipse_at_top_left,rgba(59,130,246,0.35),transparent_45%),radial-gradient(ellipse_at_bottom_right,rgba(16,185,129,0.35),transparent_45%)]"></div>
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    {p.isFeatured && (
                      <span className="rounded-full bg-amber-500/20 text-amber-300 text-[10px] px-2 py-1 ring-1 ring-amber-400/30">
                        Featured
                      </span>
                    )}
                    {isNew(p.createdAt) && (
                      <span className="rounded-full bg-sky-500/20 text-sky-300 text-[10px] px-2 py-1 ring-1 ring-sky-400/30">
                        New
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="pt-4 flex flex-col h-[9.5rem]">
                  <h3 className="text-base font-medium leading-tight line-clamp-2">
                    {p.name}
                  </h3>
                  <p className="mt-1 text-sm text-neutral-400 line-clamp-2">
                    {p.description}
                  </p>

                  <div className="mt-auto flex items-center justify-between pt-3">
                    <span className="text-sm text-neutral-400">
                      {GENDER_LABEL[p.gender]}
                    </span>
                    <span className="text-lg font-semibold">
                      {usd(p.basePrice)}
                    </span>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="mt-3 flex items-center gap-2">
                  <a
                    href={`/product/${p.slug}`}
                    className="flex-1 text-center rounded-2xl bg-neutral-800 hover:bg-neutral-700 transition px-4 py-2 text-sm"
                  >
                    View
                  </a>
                  <button
                    className="rounded-2xl px-4 py-2 text-sm border border-neutral-700 hover:border-neutral-600"
                    onClick={() => navigator.clipboard.writeText(p.slug)}
                    aria-label="Copy product slug"
                  >
                    Copy slug
                  </button>
                </div>
              </article>
            </li>
          ))}
        </ul>

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="text-center py-24 text-neutral-400">
            No products found.
          </div>
        )}
      </div>
    </main>
  );
}
