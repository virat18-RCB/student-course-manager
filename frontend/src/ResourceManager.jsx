import { useEffect, useState } from "react";
import { api } from "./api.js";

// Reusable component: shows a form + table and performs CRUD for one resource.
export default function ResourceManager({ resource, label, fields }) {
  const emptyForm = Object.fromEntries(fields.map((f) => [f.name, ""]));
  const [items, setItems] = useState([]);
  const [lookups, setLookups] = useState({}); // data for dropdown fields
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [search, setSearch] = useState("");

  async function load() {
    try {
      setItems(await api.list(resource));
      const loaded = {};
      for (const f of fields.filter((f) => f.type === "select")) {
        loaded[f.source] = await api.list(f.source);
      }
      setLookups(loaded);
    } catch {
      setMessage({ type: "danger", text: "Cannot reach the API. Is the Spring Boot backend running on port 8080?" });
    }
  }

  useEffect(() => { load(); }, [resource]);

  function validate() {
    const e = {};
    for (const f of fields) {
      const value = String(form[f.name]).trim();
      if (f.required && !value) e[f.name] = `${f.label} is required.`;
      else if (f.type === "email" && value && !/^\S+@\S+\.\S+$/.test(value))
        e[f.name] = "Enter a valid email address.";
      else if (f.type === "number" && value && Number(value) <= 0)
        e[f.name] = `${f.label} must be greater than 0.`;
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function toPayload() {
    const data = {};
    for (const f of fields) {
      const v = form[f.name];
      data[f.name] = f.type === "number" || f.type === "select" ? Number(v) : String(v).trim();
    }
    return data;
  }

  async function handleSubmit(ev) {
    ev.preventDefault();
    if (!validate()) return;
    try {
      if (editingId) {
        await api.update(resource, editingId, toPayload());   // UPDATE
        setMessage({ type: "success", text: `${label} updated.` });
      } else {
        await api.create(resource, toPayload());              // CREATE
        setMessage({ type: "success", text: `${label} added.` });
      }
      cancelEdit();
      load();
    } catch (err) {
      setMessage({ type: "danger", text: err.message });
    }
  }

  function startEdit(item) {
    setEditingId(item.id);
    setForm(Object.fromEntries(fields.map((f) => [f.name, item[f.name]])));
    setErrors({});
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
  }

  async function handleDelete(item) {
    if (!window.confirm(`Delete this ${label.toLowerCase()}?`)) return;
    try {
      await api.remove(resource, item.id);                    // DELETE
      setMessage({ type: "success", text: `${label} deleted.` });
      load();
    } catch (err) {
      setMessage({ type: "danger", text: err.message });
    }
  }

  function display(item, f) {
    if (f.type === "select") {
      const match = (lookups[f.source] || []).find((o) => o.id === item[f.name]);
      return match ? match[f.labelKey] : "—";
    }
    return item[f.name];
  }

  // READ with search
  const visible = items.filter((item) =>
    fields.some((f) => String(display(item, f)).toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="row g-4">
      <div className="col-lg-4">
        <form className="panel" onSubmit={handleSubmit} noValidate>
          <h2 className="h5 mb-3">{editingId ? `Edit ${label}` : `Add ${label}`}</h2>
          {fields.map((f) => (
            <div className="mb-3" key={f.name}>
              <label className="form-label" htmlFor={f.name}>{f.label}</label>
              {f.type === "select" ? (
                <select
                  id={f.name}
                  className={`form-select ${errors[f.name] ? "is-invalid" : ""}`}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                >
                  <option value="">Select a course</option>
                  {(lookups[f.source] || []).map((o) => (
                    <option key={o.id} value={o.id}>{o[f.labelKey]}</option>
                  ))}
                </select>
              ) : (
                <input
                  id={f.name}
                  type={f.type === "email" ? "email" : f.type === "number" ? "number" : "text"}
                  className={`form-control ${errors[f.name] ? "is-invalid" : ""}`}
                  value={form[f.name]}
                  onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                />
              )}
              {errors[f.name] && <div className="invalid-feedback">{errors[f.name]}</div>}
            </div>
          ))}
          <button className="btn btn-primary me-2" type="submit">
            {editingId ? "Save changes" : `Add ${label.toLowerCase()}`}
          </button>
          {editingId && (
            <button className="btn btn-outline-secondary" type="button" onClick={cancelEdit}>Cancel</button>
          )}
        </form>
      </div>

      <div className="col-lg-8">
        <div className="panel">
          {message && (
            <div className={`alert alert-${message.type} py-2`} role="alert">{message.text}</div>
          )}
          <div className="d-flex justify-content-between align-items-center mb-3 gap-3">
            <h2 className="h5 mb-0">{label} list ({visible.length})</h2>
            <input
              className="form-control w-50"
              placeholder="Search"
              aria-label="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {visible.length === 0 ? (
            <p className="empty-state">No records yet. Use the form to add one.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    {fields.map((f) => <th key={f.name}>{f.label}</th>)}
                    <th className="text-end">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {visible.map((item) => (
                    <tr key={item.id}>
                      <td>{item.id}</td>
                      {fields.map((f) => <td key={f.name}>{display(item, f)}</td>)}
                      <td className="text-end">
                        <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(item)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
