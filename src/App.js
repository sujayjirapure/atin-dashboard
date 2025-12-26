import React, { useEffect, useState } from "react";
import atinlogo from "./atinlogo.jpg";
import "./App.css";

const API = "https://atipn-backend.onrender.com/api/inquiry";

function App() {
  const [data, setData] = useState([]);
  const [view, setView] = useState("card");
  const [loading, setLoading] = useState(true);

  // Fetch inquiries
  const fetchData = async () => {
    try {
      const res = await fetch(API);
      const json = await res.json();
      setData(json);
      setLoading(false);
    } catch (err) {
      console.error("Fetch error", err);
    }
  };

  // Delete inquiry
  const deleteInquiry = async (id) => {
    if (!window.confirm("Are you sure you want to delete this inquiry?")) return;
    await fetch(`${API}/${id}`, { method: "DELETE" });
    fetchData();
  };

  // Auto refresh every 5 seconds
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date) =>
    new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  return (
    <div className="dashboard">
      {/* HEADER */}
      <div className="dashboard-header">
  <div className="header-row">
    <img
      src={atinlogo}
      alt="ATIN Logo"
      className="header-logo"
    />

    <div className="header-text">
      <h1>Admin Dashboard</h1>
      <p>Live connection inquiries & complaints</p>
    </div>
  </div>
</div>


      {/* VIEW TOGGLE */}
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

      {loading ? (
        <p className="loading">Loading inquiries...</p>
      ) : view === "card" ? (
        /* CARD VIEW */
        <div className="card-grid">
          {data.map((d) => (
            <div className="card" key={d._id}>
              <h3>{d.name}</h3>

              <span className={`badge ${d.type}`}>
                {d.type === "connection" ? "New Connection" : "Complaint"}
              </span>

              <p><b>Mobile:</b> {d.mobile}</p>
              <p><b>Email:</b> {d.email}</p>
              {d.address && <p><b>Address:</b> {d.address}</p>}
              {d.issue && <p><b>Issue:</b> {d.issue}</p>}

              <p className="time">🕒 {formatTime(d.createdAt)}</p>

              <button onClick={() => deleteInquiry(d._id)}>Delete</button>
            </div>
          ))}
        </div>
      ) : (
        /* TABLE VIEW */
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
            {data.map((d) => (
              <tr key={d._id}>
                <td>{d.name}</td>
                <td>
                  <span className={`badge ${d.type}`}>
                    {d.type}
                  </span>
                </td>
                <td>{d.mobile}</td>
                <td>{d.email}</td>
                <td>{d.address || d.issue}</td>
                <td>{formatTime(d.createdAt)}</td>
                <td>
                  <button onClick={() => deleteInquiry(d._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
