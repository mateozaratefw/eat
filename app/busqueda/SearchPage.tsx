"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { CartSummary } from "@/components/cart-summary";
import { ProductCard } from "@/components/product-card";
import { ChevronLeft } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import type { Product, StoreProductsResponse } from "@/types/product";
import { useCart } from "@/context/cart-context";

interface SearchPageProps {
  initialProducts: Product[];
  searchQuery: string;
}

export default function SearchPage({
  initialProducts,
  searchQuery,
}: SearchPageProps) {
  const { addToCart, removeFromCart, isInCart, getCartItemQuantity } =
    useCart();

  const [products] = useState<Product[]>(
    initialProducts.filter(
      (product) =>
        product.image !==
          "https://images.rappi.com.ar/products/?d=300x300&e=webp&q=1" &&
        product.isAvailable
    )
  );
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [viewingStore, setViewingStore] = useState(false);
  const [storeUrl, setStoreUrl] = useState<string | null>(null);
  const [storeName, setStoreName] = useState<string | null>(null);
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [loadingStoreProducts, setLoadingStoreProducts] = useState(false);
  const [storeError, setStoreError] = useState<string | null>(null);

  const fetchStoreProducts = async (storeUrl: string) => {
    try {
      setLoadingStoreProducts(true);
      setStoreError(null);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_WEB_API_URL}/products/store`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            store_url: storeUrl,
            limit: 100,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Error al obtener productos de la tienda");
      }

      const data: StoreProductsResponse = await response.json();
      const filteredStoreProducts = data.products.filter(
        (p) => p.id !== selectedProductId
      );
      setStoreProducts(filteredStoreProducts);
    } catch (err) {
      setStoreError(
        err instanceof Error
          ? err.message
          : "Error al obtener productos de la tienda"
      );
    } finally {
      setLoadingStoreProducts(false);
    }
  };

  const handleProductSelect = async (productId: string) => {
    try {
      if (selectedProductId === productId) {
        setSelectedProductId(null);
        setViewingStore(false);
        setStoreUrl(null);
        setStoreName(null);
        setStoreProducts([]);
        return;
      }

      setSelectedProductId(productId);

      const selectedProduct = products.find((p) => p.id === productId);
      if (!selectedProduct || !selectedProduct.restaurant?.url) {
        throw new Error("No se pudo obtener la URL de la tienda");
      }

      if (!isInCart(productId) && selectedProduct.isAvailable) {
        addToCart(selectedProduct, 1);
      }

      const storeUrl = selectedProduct.restaurant.url;
      const storeName = selectedProduct.restaurant.name || "la tienda";
      setStoreUrl(storeUrl);
      setStoreName(storeName);
      setViewingStore(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      await fetchStoreProducts(storeUrl);
    } catch (err) {
      setSelectedProductId(null);
      setViewingStore(false);
      setStoreUrl(null);
      setStoreName(null);
      setStoreProducts([]);
    }
  };

  const handleBackToSearch = () => {
    setSelectedProductId(null);
    setViewingStore(false);
    setStoreUrl(null);
    setStoreName(null);
    setStoreProducts([]);
  };

  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center p-4 md:py-8 px-4 pb-24">
      <div className="">
        {viewingStore && (
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  onClick={handleBackToSearch}
                  className="flex items-center text-secondary-foreground hover:text-secondary-foreground/80 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Volver
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        )}
        <div className="mb-4 md:mb-6">
          <SearchBar />
        </div>

        <h1 className="text-xl font-bold text-start md:mb-6">
          {viewingStore && storeName
            ? `Productos de ${storeName}`
            : `Resultados para: ${decodeURIComponent(searchQuery)}`}
        </h1>

        {products.length === 0 && (
          <div className="text-center py-8">
            <p>No se encontraron productos para tu búsqueda.</p>
          </div>
        )}

        {viewingStore && selectedProduct && (
          <div className="mb-12">
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Producto seleccionado
              </h2>
              <div className="flex justify-center">
                <div className="max-w-md w-full max-h-md">
                  <ProductCard
                    product={selectedProduct}
                    isSelected={true}
                    onSelect={() => handleProductSelect(selectedProduct.id)}
                  />
                  {isInCart(selectedProduct.id) && (
                    <div className="mt-2 flex justify-center">
                      <div className="flex items-center space-x-2 bg-primary/10 p-2 rounded-md">
                        <button
                          className="text-sm text-primary hover:text-primary/80 px-2 py-1"
                          onClick={() => {
                            const currentQuantity = getCartItemQuantity(
                              selectedProduct.id
                            );
                            if (currentQuantity > 1) {
                              addToCart(selectedProduct, currentQuantity - 1);
                            } else {
                              removeFromCart(selectedProduct.id);
                            }
                          }}
                        >
                          -
                        </button>
                        <span className="text-sm font-medium">
                          {getCartItemQuantity(selectedProduct.id)}
                        </span>
                        <button
                          className="text-sm text-primary hover:text-primary/80 px-2 py-1"
                          onClick={() => {
                            const currentQuantity = getCartItemQuantity(
                              selectedProduct.id
                            );
                            addToCart(selectedProduct, currentQuantity + 1);
                          }}
                        >
                          +
                        </button>
                        <button
                          className="text-sm text-primary hover:text-primary/80 ml-2"
                          onClick={() => removeFromCart(selectedProduct.id)}
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">
                Otros productos de {storeName}
              </h2>

              {loadingStoreProducts && (
                <div className="text-center py-4">
                  <p>Cargando productos de la tienda...</p>
                </div>
              )}

              {storeError && (
                <div className="text-center py-4 text-red-500">
                  <p>{storeError}</p>
                </div>
              )}

              {!loadingStoreProducts &&
                !storeError &&
                storeProducts.length === 0 && (
                  <div className="text-center py-4">
                    <p>No hay otros productos disponibles de esta tienda.</p>
                  </div>
                )}

              {!loadingStoreProducts &&
                !storeError &&
                storeProducts.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {storeProducts.map((product) => (
                      <div key={product.id}>
                        <ProductCard
                          product={product}
                          isSelected={false}
                          onSelect={() => handleProductSelect(product.id)}
                          isStoreProduct={true}
                        />
                      </div>
                    ))}
                  </div>
                )}
            </div>

            <div className="border-t border-gray-200 my-8"></div>

            <h2 className="text-xl font-semibold mb-4">
              Resultados de búsqueda originales
            </h2>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8 pb-[80px]">
            {products.map((product) => (
              <div
                key={product.id}
                className={`transition-all duration-300 ${
                  selectedProductId && product.id !== selectedProductId
                    ? "opacity-40 scale-95"
                    : product.id === selectedProductId
                    ? "ring-4 ring-primary shadow-lg scale-100 z-10"
                    : isInCart(product.id)
                    ? "ring-2 ring-primary scale-100"
                    : "scale-100"
                }`}
              >
                <ProductCard
                  product={product}
                  isSelected={product.id === selectedProductId}
                  onSelect={() => handleProductSelect(product.id)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <CartSummary />
    </main>
  );
}
