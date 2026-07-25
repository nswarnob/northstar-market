import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { items, update, remove, subtotal } = useCart();
  if (!items.length) return <main className="page"><EmptyState title="Your bag is empty" message="Take your time. The right objects are worth finding." /></main>;
  const shipping = subtotal >= 75 ? 0 : 7.5;
  return (
    <section className="page">
      <div className="page-heading"><p className="eyebrow">YOUR SELECTION</p><h1>Shopping bag</h1></div>
      <div className="cart-layout">
        <div className="cart-list">
          {items.map(({ product, quantity }) => (
            <article className="cart-item" key={product._id}>
              <img src={product.images?.[0]} alt="" />
              <div><p className="eyebrow">{product.category}</p><h3>{product.name}</h3><button className="text-action" onClick={() => remove(product._id)}>Remove</button></div>
              <input aria-label={`Quantity for ${product.name}`} type="number" min="1" max={product.stock} value={quantity} onChange={(e) => update(product._id, Number(e.target.value))} />
              <strong>${(product.price * quantity).toFixed(2)}</strong>
            </article>
          ))}
        </div>
        <aside className="summary">
          <h2>Order summary</h2>
          <p><span>Subtotal</span><b>${subtotal.toFixed(2)}</b></p>
          <p><span>Shipping</span><b>{shipping ? `$${shipping.toFixed(2)}` : "Complimentary"}</b></p>
          <hr /><p className="total"><span>Total</span><b>${(subtotal + shipping).toFixed(2)}</b></p>
          <Link className="button wide" to="/checkout">Secure checkout</Link>
          <small>Taxes are calculated at checkout.</small>
        </aside>
      </div>
    </section>
  );
}

