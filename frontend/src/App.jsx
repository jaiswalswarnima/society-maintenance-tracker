import { useEffect, useMemo, useState } from "react";
import "./index.css";

const API = "https://society-maintenance-tracker-28xu.onrender.com";

const initialRecords = [
  {
    id: 1,
    flat: "A-101",
    owner: "Rahul Sharma",
    month: "August 2026",
    amount: 2500,
    status: "Paid",
    paidOn: "05 Aug 2026",
  },
  {
    id: 2,
    flat: "A-102",
    owner: "Priya Verma",
    month: "August 2026",
    amount: 2500,
    status: "Pending",
    paidOn: "-",
  },
  {
    id: 3,
    flat: "A-103",
    owner: "Amit Kumar",
    month: "August 2026",
    amount: 2500,
    status: "Overdue",
    paidOn: "-",
  },
  {
    id: 4,
    flat: "A-104",
    owner: "Neha Singh",
    month: "August 2026",
    amount: 2500,
    status: "Paid",
    paidOn: "03 Aug 2026",
  },
  {
    id: 5,
    flat: "A-105",
    owner: "Rohit Gupta",
    month: "August 2026",
    amount: 2500,
    status: "Pending",
    paidOn: "-",
  },
];

function App() {
  const [token, setToken] = useState(
    localStorage.getItem("access_token")
  );

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const [email, setEmail] = useState("admin@society.com");
  const [password, setPassword] = useState("admin123");
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [page, setPage] = useState("Dashboard");

  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [month, setMonth] = useState("August 2026");

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [flat, setFlat] = useState("");
  const [owner, setOwner] = useState("");
  const [amount, setAmount] = useState("2500");
  const [paymentMonth, setPaymentMonth] =
    useState("August 2026");

  const [complaints, setComplaints] = useState([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);

  const [showComplaintForm, setShowComplaintForm] =
    useState(false);

  const [complaintFlat, setComplaintFlat] = useState("");
  const [complaintCategory, setComplaintCategory] =
    useState("Plumbing");
  const [complaintDescription, setComplaintDescription] =
    useState("");
  const [complaintPriority, setComplaintPriority] =
    useState("Medium");

  const [toast, setToast] = useState("");

  const notify = (message) => {
    setToast(message);

    setTimeout(() => {
      setToast("");
    }, 2500);
  };

  const login = async (event) => {
    event.preventDefault();

    setLoginError("");
    setLoginLoading(true);

    try {
      const response = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Invalid email or password"
        );
      }

      localStorage.setItem(
        "access_token",
        data.access_token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(data.user || {})
      );

      setToken(data.access_token);
      setUser(data.user || {});

      notify("Login successful");
    } catch (error) {
      setLoginError(
        error.message === "Failed to fetch"
          ? "Backend is not running. Start the backend first."
          : error.message
      );
    } finally {
      setLoginLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);
    setPage("Dashboard");
  };

  const apiRequest = async (endpoint, options = {}) => {
    const currentToken =
      localStorage.getItem("access_token");

    const headers = {
      ...(options.headers || {}),
    };

    if (currentToken) {
      headers.Authorization = `Bearer ${currentToken}`;
    }

    const response = await fetch(
      `${API}${endpoint}`,
      {
        ...options,
        headers,
      }
    );

    const contentType =
      response.headers.get("content-type") || "";

    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw new Error(
        typeof data === "object"
          ? data.detail || "Request failed"
          : "Request failed"
      );
    }

    return data;
  };

  const loadComplaints = async () => {
    if (!token) return;

    setComplaintsLoading(true);

    try {
      const data = await apiRequest(
        "/admin/complaints"
      );

      setComplaints(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
    } finally {
      setComplaintsLoading(false);
    }
  };

  useEffect(() => {
    if (token && page === "Complaints") {
      loadComplaints();
    }
  }, [token, page]);

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const text = search.toLowerCase();

      const matchesSearch =
        record.flat.toLowerCase().includes(text) ||
        record.owner.toLowerCase().includes(text);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesMonth =
        record.month === month;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMonth
      );
    });
  }, [
    records,
    search,
    statusFilter,
    month,
  ]);

  const total = records.length;

  const paid = records.filter(
    (r) => r.status === "Paid"
  ).length;

  const pending = records.filter(
    (r) => r.status === "Pending"
  ).length;

  const overdue = records.filter(
    (r) => r.status === "Overdue"
  ).length;

  const totalExpected =
    total * 2500;

  const totalCollected =
    records
      .filter((r) => r.status === "Paid")
      .reduce(
        (sum, r) => sum + Number(r.amount),
        0
      );

  const outstanding =
    records
      .filter((r) => r.status !== "Paid")
      .reduce(
        (sum, r) => sum + Number(r.amount),
        0
      );

  const markAsPaid = (id) => {
    setRecords((current) =>
      current.map((record) =>
        record.id === id
          ? {
              ...record,
              status: "Paid",
              paidOn: "Today",
            }
          : record
      )
    );

    notify("Payment marked as Paid");
  };

  const savePayment = () => {
    if (
      !flat.trim() ||
      !owner.trim() ||
      !amount
    ) {
      notify("Please fill all payment details");
      return;
    }

    const newRecord = {
      id: Date.now(),
      flat: flat.trim(),
      owner: owner.trim(),
      month: paymentMonth,
      amount: Number(amount),
      status: "Pending",
      paidOn: "-",
    };

    setRecords((current) => [
      ...current,
      newRecord,
    ]);

    setFlat("");
    setOwner("");
    setAmount("2500");
    setPaymentMonth("August 2026");

    setShowPaymentForm(false);

    setMonth(paymentMonth);
    setStatusFilter("All");

    notify("Payment added as Pending");
  };

  const saveComplaint = async () => {
    if (
      !complaintCategory ||
      !complaintDescription.trim()
    ) {
      notify("Please fill complaint details");
      return;
    }

    try {
      const formData = new FormData();

      formData.append(
        "category",
        complaintCategory
      );

      formData.append(
        "description",
        complaintDescription.trim()
      );

      await apiRequest("/complaints", {
        method: "POST",
        body: formData,
      });

      setComplaintFlat("");
      setComplaintCategory("Plumbing");
      setComplaintDescription("");
      setComplaintPriority("Medium");

      setShowComplaintForm(false);

      notify("Complaint created successfully");

      await loadComplaints();
    } catch (error) {
      notify(error.message);
    }
  };

  const resolveComplaint = async (id) => {
    try {
      await apiRequest(
        `/admin/complaints/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: "Resolved",
            priority: "Medium",
            note: "Complaint resolved by society admin.",
          }),
        }
      );

      notify("Complaint resolved");
      await loadComplaints();
    } catch (error) {
      notify(error.message);
    }
  };

  if (!token) {
    return (
      <div className="login-page">
        <div className="login-card">
          <div className="login-logo">
            ðŸ¢
          </div>

          <h1>SocietyTrack</h1>

          <p className="login-subtitle">
            Society Maintenance Manager
          </p>

          <form onSubmit={login}>
            <label>Email</label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="admin@society.com"
            />

            <label>Password</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Enter password"
            />

            {loginError && (
              <div className="error-box">
                {loginError}
              </div>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={loginLoading}
            >
              {loginLoading
                ? "Logging in..."
                : "Login"}
            </button>
          </form>

          <div className="demo-box">
            <strong>Admin Demo</strong>
            <span>
              admin@society.com
            </span>
            <span>admin123</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            ðŸ¢
          </div>

          <div>
            <h2>SocietyTrack</h2>
            <span>
              Maintenance Manager
            </span>
          </div>
        </div>

        <nav className="nav">
          {[
            ["Dashboard", "âŒ‚"],
            ["Maintenance", "â‚¹"],
            ["Complaints", "âš "],
            ["Residents", "ðŸ‘¥"],
            ["Reports", "â–¥"],
          ].map(([name, icon]) => (
            <button
              key={name}
              className={`nav-item ${
                page === name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setPage(name)
              }
            >
              <span>{icon}</span>
              {name}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="society-card">
            <strong>
              Green Valley Society
            </strong>
            <span>
              120 Apartments
            </span>
          </div>

          <button
            className="logout"
            onClick={logout}
          >
            â†ª Logout
          </button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">
              SOCIETY MANAGEMENT
            </p>

            <h1>{page}</h1>

            <p className="subtitle">
              Manage society maintenance,
              complaints and residents.
            </p>
          </div>

          <div className="profile">
            <div className="avatar">
              {(user?.name || "A")
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {user?.name ||
                  "Society Admin"}
              </strong>

              <span>
                {user?.role ||
                  "Administrator"}
              </span>
            </div>
          </div>
        </header>

        {page === "Dashboard" && (
          <>
            <section className="summary-grid">
              <div className="summary-card">
                <div className="card-icon blue">
                  ðŸ¢
                </div>

                <div>
                  <span>Total Flats</span>
                  <strong>{total}</strong>
                  <small>
                    Registered apartments
                  </small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon green">
                  âœ“
                </div>

                <div>
                  <span>Paid</span>
                  <strong>{paid}</strong>
                  <small>
                    Payments received
                  </small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon orange">
                  â—·
                </div>

                <div>
                  <span>Pending</span>
                  <strong>{pending}</strong>
                  <small>
                    Awaiting payment
                  </small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon red">
                  !
                </div>

                <div>
                  <span>Overdue</span>
                  <strong>{overdue}</strong>
                  <small>
                    Require attention
                  </small>
                </div>
              </div>
            </section>

            <section className="content-card">
              <div className="section-header">
                <div>
                  <h2>
                    Maintenance Records
                  </h2>

                  <p>
                    Monthly maintenance
                    payment status
                  </p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() =>
                    setShowPaymentForm(true)
                  }
                >
                  + Add Payment
                </button>
              </div>

              <div className="filters">
                <div className="search-box">
                  ðŸ”

                  <input
                    placeholder="Search flat or owner..."
                    value={search}
                    onChange={(e) =>
                      setSearch(
                        e.target.value
                      )
                    }
                  />
                </div>

                <select
                  value={month}
                  onChange={(e) =>
                    setMonth(
                      e.target.value
                    )
                  }
                >
                  <option>
                    August 2026
                  </option>
                  <option>
                    July 2026
                  </option>
                  <option>
                    June 2026
                  </option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <option>All</option>
                  <option>Paid</option>
                  <option>Pending</option>
                  <option>Overdue</option>
                </select>
              </div>

              <div className="table-wrapper">
                <table>
                  <thead>
                    <tr>
                      <th>FLAT</th>
                      <th>OWNER</th>
                      <th>MONTH</th>
                      <th>AMOUNT</th>
                      <th>STATUS</th>
                      <th>PAID ON</th>
                      <th>ACTION</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredRecords.map(
                      (record) => (
                        <tr
                          key={record.id}
                        >
                          <td>
                            <strong>
                              {record.flat}
                            </strong>
                          </td>

                          <td>
                            {record.owner}
                          </td>

                          <td>
                            {record.month}
                          </td>

                          <td>
                            â‚¹
                            {record.amount.toLocaleString(
                              "en-IN"
                            )}
                          </td>

                          <td>
                            <span
                              className={`status ${record.status.toLowerCase()}`}
                            >
                              {record.status}
                            </span>
                          </td>

                          <td>
                            {record.paidOn}
                          </td>

                          <td>
                            {record.status !==
                            "Paid" ? (
                              <button
                                className="pay-btn"
                                onClick={() =>
                                  markAsPaid(
                                    record.id
                                  )
                                }
                              >
                                Mark Paid
                              </button>
                            ) : (
                              <span className="completed">
                                âœ“ Completed
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="bottom-grid">
              <div className="info-card">
                <span>
                  Total Expected
                </span>
                <strong>
                  â‚¹
                  {totalExpected.toLocaleString(
                    "en-IN"
                  )}
                </strong>
                <small>
                  Current month
                </small>
              </div>

              <div className="info-card">
                <span>
                  Total Collected
                </span>
                <strong>
                  â‚¹
                  {totalCollected.toLocaleString(
                    "en-IN"
                  )}
                </strong>
                <small>
                  {paid} payments received
                </small>
              </div>

              <div className="info-card">
                <span>
                  Outstanding
                </span>
                <strong>
                  â‚¹
                  {outstanding.toLocaleString(
                    "en-IN"
                  )}
                </strong>
                <small>
                  Pending + overdue
                </small>
              </div>
            </section>
          </>
        )}

        {page === "Maintenance" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>
                  Maintenance Management
                </h2>
                <p>
                  Track monthly society
                  maintenance payments.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowPaymentForm(true)
                }
              >
                + Add Payment
              </button>
            </div>

            <div className="feature-grid">
              <div>
                <strong>
                  â‚¹
                  {totalCollected.toLocaleString(
                    "en-IN"
                  )}
                </strong>
                <span>
                  Total Collected
                </span>
              </div>

              <div>
                <strong>
                  â‚¹
                  {outstanding.toLocaleString(
                    "en-IN"
                  )}
                </strong>
                <span>
                  Outstanding
                </span>
              </div>

              <div>
                <strong>{pending}</strong>
                <span>
                  Pending Payments
                </span>
              </div>

              <div>
                <strong>{overdue}</strong>
                <span>
                  Overdue Payments
                </span>
              </div>
            </div>

            <button
              className="secondary-big-btn"
              onClick={() =>
                setPage("Dashboard")
              }
            >
              View Maintenance Records
            </button>
          </section>
        )}

        {page === "Complaints" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">
                  SERVICE REQUESTS
                </p>

                <h2>Complaints</h2>

                <p>
                  Manage resident complaints
                  and requests.
                </p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  setShowComplaintForm(true)
                }
              >
                + New Complaint
              </button>
            </div>

            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>FLAT</th>
                    <th>RESIDENT</th>
                    <th>CATEGORY</th>
                    <th>DESCRIPTION</th>
                    <th>PRIORITY</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>
                  {complaintsLoading ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="empty"
                      >
                        Loading complaints...
                      </td>
                    </tr>
                  ) : complaints.length ===
                    0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="empty"
                      >
                        No complaints found.
                      </td>
                    </tr>
                  ) : (
                    complaints.map(
                      (complaint) => {
                        const status =
                          complaint.status ||
                          "Open";

                        return (
                          <tr
                            key={
                              complaint.id
                            }
                          >
                            <td>
                              <strong>
                                {complaint.flat ||
                                  complaint.flat_number ||
                                  "-"}
                              </strong>
                            </td>

                            <td>
                              {complaint.resident ||
                                complaint.user_name ||
                                user?.name ||
                                "-"}
                            </td>

                            <td>
                              {complaint.category ||
                                "-"}
                            </td>

                            <td>
                              {complaint.description ||
                                "-"}
                            </td>

                            <td>
                              <span className="priority">
                                {complaint.priority ||
                                  "Medium"}
                              </span>
                            </td>

                            <td>
                              <span
                                className={`status ${String(
                                  status
                                ).toLowerCase()}`}
                              >
                                {status}
                              </span>
                            </td>

                            <td>
                              {String(
                                status
                              ).toLowerCase() ===
                              "resolved" ? (
                                <span className="completed">
                                  âœ“ Resolved
                                </span>
                              ) : (
                                <button
                                  className="pay-btn"
                                  onClick={() =>
                                    resolveComplaint(
                                      complaint.id
                                    )
                                  }
                                >
                                  Resolve
                                </button>
                              )}
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {page === "Residents" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>
                  Residents
                </h2>

                <p>
                  Society resident overview.
                </p>
              </div>
            </div>

            <div className="resident-grid">
              {[
                ["A-101", "Rahul Sharma"],
                ["A-102", "Priya Verma"],
                ["A-103", "Amit Kumar"],
                ["A-104", "Neha Singh"],
                ["A-105", "Rohit Gupta"],
              ].map(
                ([flatNumber, name]) => (
                  <div
                    className="resident-card"
                    key={flatNumber}
                  >
                    <div className="resident-avatar">
                      {name.charAt(0)}
                    </div>

                    <div>
                      <strong>
                        {name}
                      </strong>

                      <span>
                        Flat {flatNumber}
                      </span>
                    </div>
                  </div>
                )
              )}
            </div>
          </section>
        )}

        {page === "Reports" && (
          <section className="content-card">
            <div className="section-header">
              <div>
                <p className="eyebrow">
                  ANALYTICS
                </p>

                <h2>
                  Society Reports
                </h2>

                <p>
                  Current maintenance
                  collection summary.
                </p>
              </div>
            </div>

            <div className="report-list">
              <div>
                <span>
                  Total Expected
                </span>
                <strong>
                  â‚¹
                  {totalExpected.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Total Collected
                </span>
                <strong>
                  â‚¹
                  {totalCollected.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Outstanding
                </span>
                <strong>
                  â‚¹
                  {outstanding.toLocaleString(
                    "en-IN"
                  )}
                </strong>
              </div>

              <div>
                <span>
                  Collection Rate
                </span>

                <strong>
                  {total
                    ? Math.round(
                        (paid / total) *
                          100
                      )
                    : 0}
                  %
                </strong>
              </div>
            </div>
          </section>
        )}
      </main>

      {showPaymentForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowPaymentForm(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  Add Maintenance Payment
                </h2>

                <p>
                  Record a new maintenance
                  payment.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowPaymentForm(false)
                }
              >
                Ã—
              </button>
            </div>

            <label>Flat Number</label>

            <input
              value={flat}
              onChange={(e) =>
                setFlat(e.target.value)
              }
              placeholder="Example: A-106"
            />

            <label>Owner Name</label>

            <input
              value={owner}
              onChange={(e) =>
                setOwner(e.target.value)
              }
              placeholder="Enter owner name"
            />

            <label>Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(e) =>
                setAmount(e.target.value)
              }
            />

            <label>Month</label>

            <select
              value={paymentMonth}
              onChange={(e) =>
                setPaymentMonth(
                  e.target.value
                )
              }
            >
              <option>
                August 2026
              </option>
              <option>
                July 2026
              </option>
              <option>
                June 2026
              </option>
            </select>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setShowPaymentForm(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={savePayment}
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {showComplaintForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowComplaintForm(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  New Complaint
                </h2>

                <p>
                  Create a resident complaint.
                </p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowComplaintForm(false)
                }
              >
                Ã—
              </button>
            </div>

            <label>Flat Number</label>

            <input
              value={complaintFlat}
              onChange={(e) =>
                setComplaintFlat(
                  e.target.value
                )
              }
              placeholder="Example: A-106"
            />

            <label>
              Resident Name
            </label>

            <input
              value={user?.name || ""}
              readOnly
              placeholder="Resident name"
            />

            <label>Category</label>

            <select
              value={complaintCategory}
              onChange={(e) =>
                setComplaintCategory(
                  e.target.value
                )
              }
            >
              <option>Plumbing</option>
              <option>
                Electricity
              </option>
              <option>Cleaning</option>
              <option>Security</option>
              <option>Other</option>
            </select>

            <label>Description</label>

            <textarea
              value={complaintDescription}
              onChange={(e) =>
                setComplaintDescription(
                  e.target.value
                )
              }
              placeholder="Describe the complaint"
              rows="4"
            />

            <label>Priority</label>

            <select
              value={complaintPriority}
              onChange={(e) =>
                setComplaintPriority(
                  e.target.value
                )
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setShowComplaintForm(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={saveComplaint}
              >
                Save Complaint
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="toast">
          {toast}
        </div>
      )}
    </div>
  );
}

export default App;
