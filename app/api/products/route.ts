import { products } from "@/data/products"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("query")?.toLowerCase() || ""

  // Simulate a slight delay for API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  if (!query) {
    return NextResponse.json(products)
  }

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query),
  )

  return NextResponse.json(filteredProducts)
}

