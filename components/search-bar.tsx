"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type FormEvent, useState } from "react";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("query") || "");

  const exampleQueries = [
    "quiero almorzar algo liviano por menos de 10.000",
    "quiero fideos con salsa de hongos",
    "ensalada con carne",
    "me quiero reventar con bajon dulce",
    "algo con carne pero sin gluten",
  ];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/busqueda/${encodeURIComponent(query.trim())}`);
    }
  };

  const handleExampleClick = (example: string) => {
    router.push(`/busqueda/${encodeURIComponent(example)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="relative w-full">
        <Input
          type="text"
          placeholder="Buscar productos..."
          className="pr-10"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button
          type="submit"
          variant="ghost"
          size="icon"
          className="absolute right-0 top-0 h-full"
        >
          <Search className="h-4 w-4" />
          <span className="sr-only">Buscar</span>
        </Button>
      </form>
      <div className="mt-4 flex flex-wrap gap-4 items-center justify-center">
        {exampleQueries.map((example) => (
          <button
            key={example}
            onClick={() => handleExampleClick(example)}
            className="text-sm px-3 py-1 rounded-full bg-purple-100 hover:bg-purple-200 text-purple-700 transition-colors"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
