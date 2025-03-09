"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SearchBar } from "@/components/search-bar";
import { ProductCard } from "@/components/product-card";
import { CartSummary } from "@/components/cart-summary";

export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query") || "";

  return (
    <main className="flex min-h-screen flex-col items-center py-8 px-4 pb-24">
      <div className="container max-w-7xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          Productos disponibles
        </h1>
        <SearchBar />
      </div>
      <CartSummary />
    </main>
  );
}
