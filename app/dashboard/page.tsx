"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface Order {
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

const updateOrderStatus = (orderId: string, newStatus: string) => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const updatedOrders = orders.map((order: Order) =>
    order.order_id === orderId ? { ...order, status: newStatus } : order
  );
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
};

const saveOrderToLocalStorage = (order: Order) => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  const existingOrderIndex = orders.findIndex(
    (o: Order) => o.order_id === order.order_id
  );

  if (existingOrderIndex >= 0) {
    orders[existingOrderIndex] = order;
  } else {
    orders.push(order);
  }

  localStorage.setItem("orders", JSON.stringify(orders));
};

const getOrderFromLocalStorage = (orderId: string): Order | null => {
  const orders = JSON.parse(localStorage.getItem("orders") || "[]");
  return orders.find((order: Order) => order.order_id === orderId) || null;
};

const getAllOrdersFromLocalStorage = (): Order[] => {
  return JSON.parse(localStorage.getItem("orders") || "[]");
};

interface OrdersResponse {
  orders: Order[];
  count: number;
}

interface PaymentConfirmation {
  amount: number;
  status: string;
  payer_name: string;
}

export default function Dashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<PaymentConfirmation>({
    amount: 0,
    status: "Completed",
    payer_name: "",
  });

  const fetchOrders = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/pending-payment`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      const data: OrdersResponse = await response.json();

      const localOrders = getAllOrdersFromLocalStorage();

      const mergedOrders = [...data.orders];

      localOrders.forEach((localOrder) => {
        const apiOrderIndex = mergedOrders.findIndex(
          (apiOrder) => apiOrder.order_id === localOrder.order_id
        );

        if (apiOrderIndex >= 0) {
          mergedOrders[apiOrderIndex] = localOrder;
        } else {
          mergedOrders.push(localOrder);
        }
      });

      mergedOrders.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      setOrders(mergedOrders);
    } catch (err) {
      const localOrders = getAllOrdersFromLocalStorage();
      setOrders(localOrders);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleConfirmPayment = async () => {
    if (!selectedOrderId) return;

    const currentOrder = orders.find(
      (order) => order.order_id === selectedOrderId
    );

    if (!currentOrder) return;

    if (currentOrder.payment_status === "paid") {
      const updatedOrder = {
        ...currentOrder,
        status: "Completed",
      };

      saveOrderToLocalStorage(updatedOrder);
      updateOrderStatus(selectedOrderId, "Completed");
      toast.success("Order status updated successfully");
      setIsModalOpen(false);
      fetchOrders(); // Refresh the orders list
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${selectedOrderId}/confirm-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": "sk_admin_key987654",
          },
          body: JSON.stringify(paymentDetails),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to confirm payment");
      }

      const updatedOrder = {
        ...currentOrder,
        status: "In progress",
        payment_status: "paid",
      };
      saveOrderToLocalStorage(updatedOrder);
      updateOrderStatus(selectedOrderId, "In progress");

      toast.success("Payment confirmed successfully");
      setIsModalOpen(false);
      fetchOrders(); // Refresh the orders list
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Failed to confirm payment"
      );
    }
  };

  const openConfirmModal = (orderId: string) => {
    setSelectedOrderId(orderId);
    setPaymentDetails({
      amount: 0,
      status: "completed",
      payer_name: "",
    });
    setIsModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Pending Payment Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Links Count</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Payee Name</TableHead>
                <TableHead>Expiration Time</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id}>
                  <TableCell className="font-mono">{order.order_id}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>
                    {new Date(order.created_at).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.links_count}</TableCell>
                  <TableCell>{order.payment_status}</TableCell>
                  <TableCell>{order.payee_name}</TableCell>
                  <TableCell>
                    {new Date(order.expiration_time).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      onClick={() => openConfirmModal(order.order_id)}
                    >
                      Confirm Payment
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Payment</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Amount
              </Label>
              <Input
                id="amount"
                type="number"
                className="col-span-3"
                value={paymentDetails.amount}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    amount: Number(e.target.value),
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">
                Status
              </Label>
              <Input
                id="status"
                className="col-span-3"
                value={paymentDetails.status}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    status: e.target.value,
                  })
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="payer_name" className="text-right">
                Payer Name
              </Label>
              <Input
                id="payer_name"
                className="col-span-3"
                value={paymentDetails.payer_name}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    payer_name: e.target.value,
                  })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
