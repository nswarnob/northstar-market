import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const fallback = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

export default function ProductCard({ product }) {
  const { add } = useCart();
  return (
    <article className="product-card">
      <Link to={`/products/${product._id}`} className="product-image">
        <img src={product.images?.[0] || fallback} alt={product.name} />
        {product.featured && <span className="pill">Editor’s pick</span>}
      </Link>
      <div className="product-info">
        <div>
          <p className="eyebrow">{product.category}</p>
          <Link to={`/products/${product._id}`}><h3>{product.name}</h3></Link>
          <p className="muted">★ {product.averageRating || "New"} · {product.stock ? "In stock" : "Sold out"}</p>
        </div>
        <div className="card-bottom">
          <strong>${product.price.toFixed(2)}</strong>
          <button disabled={!product.stock} onClick={() => add(product)}>Add</button>
        </div>
      </div>
    </article>
  );
}

