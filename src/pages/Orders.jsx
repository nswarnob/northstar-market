import { useEffect, useState } from "react";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get(`/orders/user/${user._id}`).then(({ data }) => setOrders(data.data.orders)).catch((err) => setError(err.friendlyMessage));
  }, [user._id]);
  if (error) return <div className="alert page">{error}</div>;
  if (!orders) return <div className="status">Loading order history…</div>;
  if (!orders.length) return <main className="page"><EmptyState title="No orders yet" message="Your considered finds will appear here." /></main>;
  return (
    <section className="page">
      <div className="page-heading"><p className="eyebrow">YOUR ACCOUNT</p><h1>Order history</h1></div>
      <div className="order-list">{orders.map((order) => (
        <article className="order-card" key={order._id}>
          <div><span>Placed {new Date(order.createdAt).toLocaleDateString()}</span><strong>#{order._id.slice(-8).toUpperCase()}</strong></div>
          <div className="order-items">{order.items.map((item) => <p key={item.product}><span>{item.name} × {item.quantity}</span><b>${(item.price * item.quantity).toFixed(2)}</b></p>)}</div>
          <div><span className={`status-pill ${order.status}`}>{order.status}</span><strong>${order.total.toFixed(2)}</strong></div>
        </article>
      ))}</div>
    </section>
  );
}

