"use client";

import type { Product } from "@/types/product";
import { useCart } from "@/context/cart-context";
import { Check, Plus, Minus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  isSelected?: boolean;
  onSelect?: () => void;
  isStoreProduct?: boolean;
}

export function ProductCard({
  product,
  isSelected = false,
  onSelect,
  isStoreProduct = false,
}: ProductCardProps) {
  const {
    addToCart,
    removeFromCart,
    isInCart,
    getCartItemQuantity,
    updateQuantity,
  } = useCart();
  const inCart = isInCart(product.id);
  const [quantity, setQuantity] = useState(
    getCartItemQuantity(product.id) || 1
  );

  const handleAddToCart = () => {
    if (inCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product, quantity);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
      if (inCart) {
        updateQuantity(product.id, newQuantity);
      }
    }
  };

  const handleSelect = () => {
    if (onSelect) {
      onSelect();
    }
  };

  return (
    <Card
      className={`overflow-hidden transition-all ${
        isSelected
          ? "ring-2 ring-primary bg-primary/5"
          : inCart
          ? "ring-2 ring-primary"
          : ""
      }`}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square">
          <Image
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover"
          />
          {!product.isAvailable && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
              <span className="text-sm font-medium">No disponible</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold">{product.name}</h3>
            {product.healthScore && (
              <div className="flex items-center gap-1 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{product.healthScore}</span>
              </div>
            )}
          </div>
          {product.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 h-10 mb-2">
              {product.description}
            </p>
          )}
          <div className="flex flex-wrap gap-1 mb-2">
            {product.category && (
              <Badge variant="secondary">{product.category}</Badge>
            )}
            {product.priceCategory && (
              <Badge variant="outline">{product.priceCategory}</Badge>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-lg">
                ${product.price.toLocaleString("es-AR")}
              </span>
              {product.deliveryInfo && (
                <span className="text-xs text-muted-foreground">
                  {product.deliveryInfo.estimatedTime} min •
                  {product.deliveryInfo.deliveryFee
                    ? ` $${product.deliveryInfo.deliveryFee.toLocaleString(
                        "es-AR"
                      )} envío`
                    : " Envío gratis"}
                </span>
              )}
            </div>
            {product.restaurant && (
              <div className="text-right">
                <span className="text-sm font-medium">
                  {product.restaurant.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex-col">
        <div className="flex items-center justify-between w-full mb-2">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || !product.isAvailable}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={!product.isAvailable}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {isStoreProduct && (
            <Button
              variant={inCart ? "secondary" : "default"}
              size="sm"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
            >
              {inCart ? (
                <>
                  <Check className="mr-1 h-3 w-3" /> En carrito
                </>
              ) : (
                "Agregar"
              )}
            </Button>
          )}
        </div>

        {/* Only show the selection button if not a store product */}
        {!isStoreProduct &&
          (onSelect ? (
            <Button
              variant={isSelected ? "secondary" : "default"}
              className="w-full"
              onClick={handleSelect}
              disabled={!product.isAvailable}
            >
              {isSelected ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Seleccionado
                </>
              ) : (
                "Seleccionar"
              )}
            </Button>
          ) : (
            <Button
              variant={inCart ? "secondary" : "default"}
              className="w-full"
              onClick={handleAddToCart}
              disabled={!product.isAvailable}
            >
              {inCart ? (
                <>
                  <Check className="mr-2 h-4 w-4" /> Seleccionado
                </>
              ) : (
                "Seleccionar"
              )}
            </Button>
          ))}
      </CardFooter>
    </Card>
  );
}
