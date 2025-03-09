import { SearchBar } from "@/components/search-bar";
import { CartSummary } from "@/components/cart-summary";
import ActiveOrders from "@/components/cart-orders";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center py-8 px-4 pb-24 gap-8">
      <h1 className="text-4xl font-bold">Sirvana <span className="text-green-500">Eats</span></h1>
      <div className="max-w-7xl flex items-center justify-center w-full">
        <SearchBar />
      </div>
      <CartSummary />
      <ActiveOrders />
    </main>
  );
}
