import { useEffect, useState } from "react";
import api from "../services/api";

const blank = { name: "", description: "", price: "", category: "", stock: "", images: [], featured: false };

export default function Admin() {
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState(blank);
  const [editing, setEditing] = useState(null);
  const [error, setError] = useState("");

  const load = () => Promise.all([
    api.get("/products?limit=48"),
    api.get("/orders/admin/all"),
    api.get("/admin/users"),
  ]).then(([p, o, u]) => {
    setProducts(p.data.data.products); setOrders(o.data.data.orders); setUsers(u.data.data.users);
  }).catch((err) => setError(err.friendlyMessage));
  useEffect(() => { load(); }, []);

  const saveProduct = async (e) => {
    e.preventDefault(); setError("");
    const payload = { ...form, price: Number(form.price), stock: Number(form.stock), images: typeof form.images === "string" ? form.images.split(",").map((x) => x.trim()).filter(Boolean) : form.images };
    try {
      editing ? await api.put(`/products/${editing}`, payload) : await api.post("/products", payload);
      setForm(blank); setEditing(null); load();
    } catch (err) { setError(err.friendlyMessage); }
  };
  const edit = (product) => { setEditing(product._id); setForm({ ...product, images: product.images.join(", ") }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const remove = async (id) => { if (!window.confirm("Delete this product and its reviews?")) return; await api.delete(`/products/${id}`); load(); };
  const status = async (id, value) => { await api.patch(`/orders/admin/${id}/status`, { status: value }); load(); };
  const userUpdate = async (user, patch) => { await api.patch(`/admin/users/${user._id}`, { role: patch.role ?? user.role, isActive: patch.isActive ?? user.isActive }); load(); };

  return (
    <section className="page admin">
      <div className="page-heading"><p className="eyebrow">OPERATIONS</p><h1>Admin studio</h1></div>
      <div className="tabs">{["products", "orders", "users"].map((item) => <button className={tab === item ? "active" : ""} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>
      {error && <div className="alert">{error}</div>}
      {tab === "products" && <>
        <form className="admin-form" onSubmit={saveProduct}><h2>{editing ? "Edit product" : "Add product"}</h2>
          <div className="form-row"><label>Name<input required minLength="2" maxLength="120" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}/></label><label>Category<input required value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}/></label></div>
          <label>Description<textarea required minLength="3" maxLength="3000" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}/></label>
          <div className="form-row"><label>Price<input required type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}/></label><label>Stock<input required type="number" min="0" step="1" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}/></label></div>
          <label>Image URLs (comma separated)<input value={form.images} onChange={(e) => setForm({ ...form, images: e.target.value })}/></label>
          <label className="check"><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })}/> Featured product</label>
          <button>{editing ? "Save changes" : "Create product"}</button>{editing && <button type="button" className="secondary" onClick={() => { setEditing(null); setForm(blank); }}>Cancel</button>}
        </form>
        <div className="admin-table">{products.map((p) => <div key={p._id}><span><b>{p.name}</b><small>{p.category} · {p.stock} in stock</small></span><strong>${p.price.toFixed(2)}</strong><button onClick={() => edit(p)}>Edit</button><button className="danger" onClick={() => remove(p._id)}>Delete</button></div>)}</div>
      </>}
      {tab === "orders" && <div className="admin-table">{orders.map((o) => <div key={o._id}><span><b>#{o._id.slice(-8)}</b><small>{o.user?.email} · ${o.total.toFixed(2)}</small></span><select value={o.status} onChange={(e) => status(o._id, e.target.value)}>{["paid","processing","shipped","delivered","cancelled"].map((s) => <option key={s}>{s}</option>)}</select></div>)}</div>}
      {tab === "users" && <div className="admin-table">{users.map((u) => <div key={u._id}><span><b>{u.name}</b><small>{u.email}</small></span><select value={u.role} onChange={(e) => userUpdate(u, { role: e.target.value })}><option>customer</option><option>admin</option></select><label className="check"><input type="checkbox" checked={u.isActive} onChange={(e) => userUpdate(u, { isActive: e.target.checked })}/> Active</label></div>)}</div>}
    </section>
  );
}

