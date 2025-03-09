import { searchProducts } from "../actions";
import SearchPage from "../SearchPage";

export default async function SearchResults({
  params,
}: {
  params: { query: string };
}) {
  const query = params.query;
  const products = await searchProducts(query);

  return <SearchPage initialProducts={products} searchQuery={query} />;
}
