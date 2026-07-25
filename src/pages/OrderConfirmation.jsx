import { Link, useLocation, useParams } from "react-router-dom";

export default function OrderConfirmation() {
  const { id } = useParams();
  const order = useLocation().state?.order;
  return (
    <section className="confirmation page">
      <span className="confirmation-mark">✓</span>
      <p className="eyebrow">ORDER CONFIRMED</p>
      <h1>Thank you.</h1>
      <p>Your order is paid and being prepared. We’ll keep its status current in your order history.</p>
      <div><span>Order reference</span><strong>{id.slice(-8).toUpperCase()}</strong>{order && <><span>Total</span><strong>${order.total.toFixed(2)}</strong></>}</div>
      <Link className="button" to="/orders">View order history</Link>
    </section>
  );
}

