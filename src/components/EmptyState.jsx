import { Link } from "react-router-dom";

export default function EmptyState({ title, message, action = "Browse the shop" }) {
  return (
    <section className="empty-state">
      <span>✦</span>
      <h2>{title}</h2>
      <p>{message}</p>
      <Link className="button" to="/products">{action}</Link>
    </section>
  );
}

