import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth({ register = false }) {
  const { login, register: createAccount } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [values, setValues] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true); setError("");
    try {
      await (register ? createAccount(values) : login(values));
      navigate(location.state?.from?.pathname || "/");
    } catch (err) {
      setError(err.friendlyMessage);
    } finally { setBusy(false); }
  };
  return (
    <section className="auth-page">
      <div className="auth-art"><div><p className="eyebrow">NORTHSTAR MEMBERS</p><h2>Good things,<br />kept close.</h2></div></div>
      <form className="auth-form" onSubmit={submit}>
        <p className="eyebrow">{register ? "CREATE AN ACCOUNT" : "WELCOME BACK"}</p>
        <h1>{register ? "Join Northstar" : "Sign in"}</h1>
        <p>{register ? "Save favorites, track orders, and review your finds." : "Continue where you left off."}</p>
        {register && <label>Full name<input required minLength="2" maxLength="60" autoComplete="name" value={values.name} onChange={(e) => setValues({ ...values, name: e.target.value })} /></label>}
        <label>Email address<input required type="email" autoComplete="email" value={values.email} onChange={(e) => setValues({ ...values, email: e.target.value })} /></label>
        <label>Password<input required type="password" minLength="8" maxLength="72" autoComplete={register ? "new-password" : "current-password"} value={values.password} onChange={(e) => setValues({ ...values, password: e.target.value })} /></label>
        {register && <small>Use 8+ characters with upper/lowercase and a number.</small>}
        {error && <div className="alert">{error}</div>}
        <button className="wide" disabled={busy}>{busy ? "Please wait…" : register ? "Create account" : "Sign in"}</button>
        <p className="switch">{register ? "Already a member?" : "New to Northstar?"} <Link to={register ? "/login" : "/register"}>{register ? "Sign in" : "Create an account"}</Link></p>
      </form>
    </section>
  );
}

