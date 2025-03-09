'use server';

import { CartItem } from "@/app/types/cart";

export async function createOrder(
  orderId: string,
  name: string,
  cartItems: CartItem[]
) {
  const links = cartItems.flatMap((item) =>
    Array(item.quantity).fill(item.url)
  );

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        order_id: orderId,
        links: links,
        payee_name: name,
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Error al procesar la orden");
  }

  return { success: true };
} 