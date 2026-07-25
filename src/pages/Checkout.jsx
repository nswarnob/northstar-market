import { useEffect, useState } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Navigate, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../services/api";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || "");

function PaymentForm({ address, paymentIntentId }) {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { items, clear } = useCart();
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault(); setBusy(true); setError("");
    const result = await stripe.confirmPayment({ elements, redirect: "if_required" });
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    try {
      const { data } = await api.post("/orders", {
        items: items.map((item) => ({ product: item.product._id, quantity: item.quantity })),
        shippingAddress: address,
        paymentIntentId,
      });
      clear();
      navigate(`/order-confirmation/${data.data.order._id}`, { state: { order: data.data.order } });
    } catch (err) { setError(err.friendlyMessage); setBusy(false); }
  };
  return <form className="payment-form" onSubmit={submit}><PaymentElement /><button className="wide" disabled={!stripe || busy}>{busy ? "Completing order…" : "Pay securely"}</button>{error && <div className="alert">{error}</div>}</form>;
}

export default function Checkout() {
  const { items, subtotal } = useCart();
  const [address, setAddress] = useState({ fullName: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "United States" });
  const [readyAddress, setReadyAddress] = useState(null);
  const [intent, setIntent] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!readyAddress) return;
    api.post("/orders/payment-intent", { items: items.map((item) => ({ product: item.product._id, quantity: item.quantity })) })
      .then(({ data }) => setIntent(data.data))
      .catch((err) => setError(err.friendlyMessage));
  }, [readyAddress, items]);

  if (!items.length) return <Navigate to="/cart" replace />;
  const field = (name, label, required = true) => <label>{label}<input required={required} maxLength="120" value={address[name]} onChange={(e) => setAddress({ ...address, [name]: e.target.value })} /></label>;
  return (
    <section className="page checkout">
      <div><p className="eyebrow">SECURE CHECKOUT</p><h1>Delivery & payment</h1></div>
      <div className="checkout-grid">
        <div>
          {!readyAddress ? (
            <form className="address-form" onSubmit={(e) => { e.preventDefault(); setReadyAddress({ ...address }); }}>
              <h2>Shipping address</h2>
              {field("fullName", "Full name")}{field("line1", "Address")}{field("line2", "Apartment, suite, etc.", false)}
              <div className="form-row">{field("city", "City")}{field("state", "State / region", false)}</div>
              <div className="form-row">{field("postalCode", "Postal code")}{field("country", "Country")}</div>
              <button className="wide">Continue to payment</button>
            </form>
          ) : intent ? (
            <Elements stripe={stripePromise} options={{ clientSecret: intent.clientSecret, appearance: { theme: "stripe" } }}>
              <PaymentForm address={readyAddress} paymentIntentId={intent.paymentIntentId} />
            </Elements>
          ) : <div className="status">Preparing secure payment…</div>}
          {error && <div className="alert">{error}</div>}
        </div>
        <aside className="summary"><h2>Your order</h2>{items.map((item) => <p key={item.product._id}><span>{item.product.name} × {item.quantity}</span><b>${(item.product.price * item.quantity).toFixed(2)}</b></p>)}<hr/><p className="total"><span>Estimated total</span><b>${(subtotal + (subtotal >= 75 ? 0 : 7.5)).toFixed(2)}</b></p></aside>
      </div>
    </section>
  );
}
