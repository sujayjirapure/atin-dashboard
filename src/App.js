import React, { useEffect, useState } from "react";
import atinlogo from "./atinlogo.jpg";
import "./App.css";

const API = "https://atipn-backend.onrender.com/api/inquiry";

export default function App() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("table");
  const [search, setSearch] = useState("");
  const [date, setDate] = useState("");

  /* FETCH DATA */
  const fetchData = async () => {
    const res = await fetch(API);
    const json = await res.json();

    // latest on top (frontend-only fix)
    const sorted = [...json].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setData(sorted);
  };

  /* INITIAL LOAD */
  useEffect(() => {
    fetchData();
  }, []);

  /* DELETE */
  const deleteInquiry = async (id) => {
    if (!window.confirm("Delete this inquiry?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    setData((prev) => prev.filter((i) => i._id !== id));
  };

  /* FILTER */
  const filtered = data.filter((d) => {
    const text =
      `${d.name} ${d.mobile} ${d.email} ${d.type}`.toLowerCase();
    const matchesSearch = text.includes(search.toLowerCase());

    const matchesDate = date
      ? new Date(d.createdAt).toISOString().slice(0, 10) === date
      : true;

    return matchesSearch && matchesDate;
  });

  /* KPI */
  const today = new Date().toISOString().slice(0, 10);
  const todayTotal = data.filter(
    (d) => d.createdAt.slice(0, 10) === today
  ).length;
  const connections = data.filter((d) => d.type === "connection").length;
  const complaints = data.filter((d) => d.type === "complaint").length;

  return (
    <div className="admin-dashboard">
      {/* HEADER */}
      <div className="header">
        <img src={atinlogo} alt="ATIN" />
        <div>
          <h1>Admin Dashboard</h1>
          <p className="subtitle">
            Live connection inquiries & complaints
          </p>
        </div>
      </div>

      {/* KPI ROW */}
      <div className="kpi-row">
        <div className="kpi-card">
          <h2>{todayTotal}</h2>
          <span>Today</span>
        </div>
        <div className="kpi-card">
          <h2>{connections}</h2>
          <span>Connections</span>
        </div>
        <div className="kpi-card">
          <h2>{complaints}</h2>
          <span>Complaints</span>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="controls">
        <input
          placeholder="Search name, mobile, email, type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <button className="export">Export Excel</button>

        <div className="view-toggle">
          <button
            className={view === "card" ? "active" : ""}
            onClick={() => setView("card")}
          >
            Card View
          </button>
          <button
            className={view === "table" ? "active" : ""}
            onClick={() => setView("table")}
          >
            Table View
          </button>
        </div>
      </div>

      {/* TABLE VIEW */}
      {view === "table" && (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Mobile</th>
              <th>Email</th>
              <th>Details</th>
              <th>Time</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>
                  <span className={`badge ${d.type}`}>{d.type}</span>
                </td>
                <td>{d.mobile}</td>
                <td>{d.email}</td>
                <td>{d.address || d.issue}</td>
                <td>{new Date(d.createdAt).toLocaleString()}</td>
                <td>
                  <button className="del" onClick={() => deleteInquiry(d._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CARD VIEW */}
      {view === "card" && (
        <div className="card-grid">
          {filtered.map((d) => (
            <div className="card" key={d._id}>
              <h3>{d.name}</h3>
              <span className={`badge ${d.type}`}>{d.type}</span>
              <p><b>Mobile:</b> {d.mobile}</p>
              <p><b>Email:</b> {d.email}</p>
              <p>{d.address || d.issue}</p>
              <small>{new Date(d.createdAt).toLocaleString()}</small>
              <br />
              <button className="del" onClick={() => deleteInquiry(d._id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
