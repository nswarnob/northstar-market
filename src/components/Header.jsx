import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Header() {
  const { user, logout } = useAuth();
  const { count } = useCart();
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <Link className="brand" to="/">NORTHSTAR<span>MARKET</span></Link>
        <nav aria-label="Main navigation">
          <NavLink to="/products">Shop</NavLink>
          {user && <NavLink to="/orders">Orders</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
        </nav>
        <div className="nav-actions">
          <NavLink to="/cart">Bag <b>{count}</b></NavLink>
          {user ? (
            <button className="link-button" onClick={logout}>Sign out</button>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}
        </div>
      </div>
    </header>
  );
}

