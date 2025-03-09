"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

interface OrderInfo {
  order_id: string;
  status: string;
  created_at: string;
  links_count: number;
  tracking_id: string | null;
  payment_status: string;
  payee_name: string;
  retry_count: number;
  expiration_time: string;
  _items: any[];
  _total: number;
}

export default function OrdersList() {
  const [orders, setOrders] = useState<OrderInfo[]>([]);

  useEffect(() => {
    const storedOrders = localStorage.getItem("orders");
    if (storedOrders) {
      const parsedOrders = JSON.parse(storedOrders);
      // Sort orders by created_at in descending order (newest first)
      const sortedOrders = parsedOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      setOrders(sortedOrders);
    }
  }, []);

  if (orders.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Tus Órdenes</h2>
      {orders.map((order) => (
        <Card key={order.order_id} className="mb-6">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  Orden #{order.order_id.slice(0, 8)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
              <div className="flex gap-2">
                <Badge
                  variant={
                    order.status === "In progress" ? "secondary" : "default"
                  }
                >
                  {order.status}
                </Badge>
              </div>
            </div>

            <div className="space-y-4">
              <div className="text-sm">
                <span className="font-medium">ID de Orden:</span>{" "}
                {order.order_id}
              </div>
              <div className="text-sm">
                <span className="font-medium">Nombre:</span> {order.payee_name}
              </div>
              <div className="text-sm">
                <span className="font-medium">Cantidad de Links:</span>{" "}
                {order.links_count}
              </div>
              <div>
                <h4 className="font-medium mb-2">Productos:</h4>
                <div className="space-y-2">
                  {order._items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 text-sm"
                    >
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-muted-foreground">
                          x{item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        ${(item.price * item.quantity).toLocaleString("es-AR")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t">
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>${order._total.toLocaleString("es-AR")}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
