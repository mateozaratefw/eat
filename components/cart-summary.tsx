"use client"

import { useCart } from "@/context/cart-context"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"

export function CartSummary() {
  const { cartItems } = useCart()
  const router = useRouter()

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleCheckout = () => {
    router.push("/cart")
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-muted-foreground">
            {totalItems} {totalItems === 1 ? "producto" : "productos"} seleccionados
          </span>
          <span className="font-bold text-lg">${totalPrice.toLocaleString("es-AR")}</span>
        </div>
        <Button onClick={handleCheckout} disabled={totalItems === 0} size="lg" className="min-w-[150px]">
          <ShoppingCart className="mr-2 h-4 w-4" />
          Comprar
        </Button>
      </div>
    </div>
  )
}

