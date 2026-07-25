import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import api from "../services/api";

export default function ProductDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { add } = useCart();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [review, setReview] = useState({ rating: 5, title: "", comment: "" });

  const load = () => api.get(`/products/${id}`)
    .then(({ data: response }) => setData(response.data))
    .catch((err) => setError(err.friendlyMessage));
  useEffect(() => {
    api.get(`/products/${id}`)
      .then(({ data: response }) => setData(response.data))
      .catch((err) => setError(err.friendlyMessage));
  }, [id]);

  const saveReview = async (event) => {
    event.preventDefault();
    setError("");
    try {
      await api.post(`/reviews/${id}`, review);
      setReview({ rating: 5, title: "", comment: "" });
      load();
    } catch (err) { setError(err.friendlyMessage); }
  };

  if (!data && !error) return <div className="status">Loading product…</div>;
  if (!data) return <div className="alert page">{error}</div>;
  const { product, reviews } = data;
  const image = product.images?.[0] || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=1200&q=80";

  return (
    <section className="page">
      <div className="details">
        <div className="detail-image"><img src={image} alt={product.name} /></div>
        <div className="detail-copy">
          <p className="eyebrow">{product.category}</p>
          <h1>{product.name}</h1>
          <p className="rating">★ {product.averageRating || "Not yet rated"} <span>({product.reviewCount} reviews)</span></p>
          <p className="detail-price">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <button className="wide" disabled={!product.stock} onClick={() => add(product)}>
            {product.stock ? `Add to bag · ${product.price.toFixed(2)}` : "Out of stock"}
          </button>
          <ul className="detail-notes"><li>Free shipping over $75</li><li>30-day considered returns</li><li>{product.stock} available</li></ul>
        </div>
      </div>
      <div className="reviews">
        <div><p className="eyebrow">COMMUNITY NOTES</p><h2>What people say</h2></div>
        <div>
          {reviews.length ? reviews.map((item) => (
            <article className="review" key={item._id}><p>{"★".repeat(item.rating)}</p><h3>{item.title || "A verified review"}</h3><p>{item.comment}</p><small>{item.user?.name} · Verified purchase</small></article>
          )) : <p className="muted">No reviews yet.</p>}
          {user && (
            <form className="review-form" onSubmit={saveReview}>
              <h3>Write a review</h3>
              <select value={review.rating} onChange={(e) => setReview({ ...review, rating: Number(e.target.value) })}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} stars</option>)}</select>
              <input maxLength="100" placeholder="Review title (optional)" value={review.title} onChange={(e) => setReview({ ...review, title: e.target.value })} />
              <textarea required minLength="3" maxLength="1000" placeholder="Share your experience" value={review.comment} onChange={(e) => setReview({ ...review, comment: e.target.value })} />
              <button>Submit review</button>
              {error && <p className="form-error">{error}</p>}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
