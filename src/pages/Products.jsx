import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";

export default function Products() {
  const [params, setParams] = useSearchParams();
  const [result, setResult] = useState({ products: [], meta: {} });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const query = params.toString();

  useEffect(() => {
    setLoading(true);
    api.get(`/products?${query}`)
      .then(({ data }) => setResult({ products: data.data.products, meta: data.meta }))
      .catch((err) => setError(err.friendlyMessage))
      .finally(() => setLoading(false));
  }, [query]);

  const update = (key, value) => {
    const next = new URLSearchParams(params);
    value ? next.set(key, value) : next.delete(key);
    if (key !== "page") next.delete("page");
    setParams(next);
  };

  return (
    <section className="catalog page">
      <div className="page-heading">
        <p className="eyebrow">THE COLLECTION</p>
        <h1>Shop all</h1>
        <p>Considered pieces for daily rituals.</p>
      </div>
      <div className="filters">
        <input aria-label="Search products" placeholder="Search the collection…" defaultValue={params.get("search") || ""} onKeyDown={(e) => e.key === "Enter" && update("search", e.currentTarget.value)} />
        <select aria-label="Category" value={params.get("category") || ""} onChange={(e) => update("category", e.target.value)}>
          <option value="">All categories</option><option>home</option><option>apparel</option><option>accessories</option><option>wellness</option>
        </select>
        <select aria-label="Sort products" value={params.get("sort") || "newest"} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option><option value="price-asc">Price: low to high</option><option value="price-desc">Price: high to low</option><option value="rating">Top rated</option>
        </select>
      </div>
      {error && <div className="alert">{error}</div>}
      {loading ? <div className="status">Loading the collection…</div> : (
        <>
          <div className="product-grid">{result.products.map((product) => <ProductCard key={product._id} product={product} />)}</div>
          <div className="pagination">
            <button disabled={result.meta.page <= 1} onClick={() => update("page", result.meta.page - 1)}>Previous</button>
            <span>Page {result.meta.page || 1} of {result.meta.pages || 1}</span>
            <button disabled={result.meta.page >= result.meta.pages} onClick={() => update("page", result.meta.page + 1)}>Next</button>
          </div>
        </>
      )}
    </section>
  );
}
