'use server';

import { CartItem } from "@/app/types/cart";

export interface Order {
  order_id: string;
  status: string;
  created_at: string;
  links_count: number;
  tracking_id: string | null;
  payment_status: string;
  payee_name: string;
  retry_count: number;
  expiration_time: string;
}

export interface OrdersResponse {
  orders: Order[];
  count: number;
}

export async function getPendingPaymentOrders(): Promise<OrdersResponse> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/orders/pending-payment`,
    { cache: 'no-store' }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();
}

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