'use server'

import type { Product } from "@/types/product";

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const response = await fetch("http://127.0.0.1:3000/products/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: decodeURIComponent(query),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    return response.json();
  } catch (err) {
    console.error("Error fetching products:", err);
    throw err;
  }
} 