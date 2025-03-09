"use client";

import { useCart } from "@/context/cart-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, ArrowLeft, Plus, Minus, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
  const router = useRouter();

  const totalAmount = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalDeliveryFee = cartItems.reduce((total, item) => {
    if (item.deliveryInfo?.deliveryFee) {
      return total + item.deliveryInfo.deliveryFee;
    }
    return total;
  }, 0);

  const handleCheckout = () => {
    // Simulate checkout process
    alert("¡Gracias por tu compra! Tu pedido ha sido procesado.");
    clearCart();
    router.push("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="container max-w-4xl mx-auto px-4 py-16 text-center">
        <ShoppingBag className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-4">Tu carrito está vacío</h1>
        <p className="text-muted-foreground mb-8">
          Parece que no has agregado ningún producto a tu carrito.
        </p>
        <Link href="/">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Link href="/">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Button>
        </Link>
        <h1 className="text-2xl font-bold ml-4">Tu carrito</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md">
                    <Image
                      src={item.image || "/placeholder.svg?height=96&width=96"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <div>
                        <h3 className="font-semibold">{item.name}</h3>
                        {item.restaurant && (
                          <p className="text-sm text-muted-foreground">
                            {item.restaurant.name}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </div>
                    {item.description && (
                      <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                        {item.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.category && (
                        <Badge variant="secondary">{item.category}</Badge>
                      )}
                      {item.priceCategory && (
                        <Badge variant="outline">{item.priceCategory}</Badge>
                      )}
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1 || !item.isAvailable}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={!item.isAvailable}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          $
                          {(item.price * item.quantity).toLocaleString("es-AR")}
                        </div>
                        {item.deliveryInfo?.deliveryFee && (
                          <div className="text-sm text-muted-foreground">
                            +$
                            {item.deliveryInfo.deliveryFee.toLocaleString(
                              "es-AR"
                            )}{" "}
                            envío
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Resumen de compra</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${totalAmount.toLocaleString("es-AR")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Envío</span>
                  <span>
                    {totalDeliveryFee > 0
                      ? `$${totalDeliveryFee.toLocaleString("es-AR")}`
                      : "Gratis"}
                  </span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Total</span>
                  <span>
                    ${(totalAmount + totalDeliveryFee).toLocaleString("es-AR")}
                  </span>
                </div>
              </div>
              <Button
                className="w-full mt-6"
                size="lg"
                onClick={handleCheckout}
              >
                Finalizar compra
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
