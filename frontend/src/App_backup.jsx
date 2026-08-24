import { useMemo, useState } from "react";

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

const complaints = [
  {
    id: 1,
    flat: "A-102",
    title: "Water leakage",
    status: "Open",
    date: "20 Aug 2026",
  },
  {
    id: 2,
    flat: "A-104",
    title: "Lift issue",
    status: "In Progress",
    date: "18 Aug 2026",
  },
  {
    id: 3,
    flat: "A-105",
    title: "Parking issue",
    status: "Resolved",
    date: "15 Aug 2026",
  },
];

const residents = [
  { flat: "A-101", owner: "Rahul Sharma", phone: "9876543210" },
  { flat: "A-102", owner: "Priya Verma", phone: "9876543211" },
  { flat: "A-103", owner: "Amit Kumar", phone: "9876543212" },
  { flat: "A-104", owner: "Neha Singh", phone: "9876543213" },
  { flat: "A-105", owner: "Rohit Gupta", phone: "9876543214" },
];

function App() {
  const [records, setRecords] = useState(initialRecords);
  const [activePage, setActivePage] = useState("Dashboard");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [month, setMonth] = useState("August 2026");

  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const [paymentForm, setPaymentForm] = useState({
    flat: "",
    owner: "",
    amount: "2500",
    month: "August 2026",
  });

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        record.flat.toLowerCase().includes(searchText) ||
        record.owner.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || record.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        record.month === month
      );
    });
  }, [records, search, statusFilter, month]);

  const total = records.length;
  const paid = records.filter((r) => r.status === "Paid").length;
  const pending = records.filter((r) => r.status === "Pending").length;
  const overdue = records.filter((r) => r.status === "Overdue").length;

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
  };

  const savePayment = () => {
    if (!paymentForm.flat || !paymentForm.owner || !paymentForm.amount) {
      alert("Please fill Flat Number, Owner Name and Amount.");
      return;
    }

    const newRecord = {
      id: Date.now(),
      flat: paymentForm.flat,
      owner: paymentForm.owner,
      month: paymentForm.month,
      amount: Number(paymentForm.amount),
      status: "Paid",
      paidOn: "Today",
    };

    setRecords((current) => [...current, newRecord]);

    setPaymentForm({
      flat: "",
      owner: "",
      amount: "2500",
      month: "August 2026",
    });

    setShowPaymentForm(false);
  };

  const openPage = (page) => {
    setActivePage(page);
  };

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">🏢</div>

          <div>
            <h2>SocietyTrack</h2>
            <span>Maintenance Manager</span>
          </div>
        </div>

        <nav>

          <button
            className={`nav-item ${
              activePage === "Dashboard" ? "active" : ""
            }`}
            onClick={() => openPage("Dashboard")}
          >
            <span>▦</span>
            Dashboard
          </button>

          <button
            className={`nav-item ${
              activePage === "Maintenance" ? "active" : ""
            }`}
            onClick={() => openPage("Maintenance")}
          >
            <span>₹</span>
            Maintenance
          </button>

          <button
            className={`nav-item ${
              activePage === "Complaints" ? "active" : ""
            }`}
            onClick={() => openPage("Complaints")}
          >
            <span>⚠</span>
            Complaints
          </button>

          <button
            className={`nav-item ${
              activePage === "Residents" ? "active" : ""
            }`}
            onClick={() => openPage("Residents")}
          >
            <span>👥</span>
            Residents
          </button>

          <button
            className={`nav-item ${
              activePage === "Reports" ? "active" : ""
            }`}
            onClick={() => openPage("Reports")}
          >
            <span>📊</span>
            Reports
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="society-card">
            <strong>Green Valley Society</strong>
            <span>120 Apartments</span>
          </div>

          <button
            className="logout"
            onClick={() => alert("Logout functionality will be connected to the backend next.")}
          >
            ↪ Logout
          </button>

        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div>
            <p className="eyebrow">
              {activePage.toUpperCase()}
            </p>

            <h1>
              {activePage === "Dashboard"
                ? "Maintenance Dashboard"
                : activePage}
            </h1>

            <p className="subtitle">
              {activePage === "Dashboard"
                ? "Track society maintenance payments and pending dues."
                : `Manage ${activePage.toLowerCase()} of your society.`}
            </p>
          </div>

          <div className="profile">

            <button
              className="notification"
              onClick={() =>
                alert(
                  `Notifications:\n${pending} pending payments\n${overdue} overdue payments`
                )
              }
            >
              🔔
            </button>

            <div className="avatar">A</div>

            <div>
              <strong>Admin</strong>
              <span>Society Manager</span>
            </div>

          </div>

        </header>

        {activePage === "Dashboard" && (
          <>
            <section className="summary-grid">

              <div className="summary-card">
                <div className="card-icon blue">🏢</div>

                <div>
                  <span>Total Flats</span>
                  <strong>{total}</strong>
                  <small>Registered apartments</small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon green">✓</div>

                <div>
                  <span>Paid</span>
                  <strong>{paid}</strong>
                  <small>Payments received</small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon orange">◷</div>

                <div>
                  <span>Pending</span>
                  <strong>{pending}</strong>
                  <small>Awaiting payment</small>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon red">!</div>

                <div>
                  <span>Overdue</span>
                  <strong>{overdue}</strong>
                  <small>Require attention</small>
                </div>
              </div>

            </section>

            <section className="content-card">

              <div className="section-header">

                <div>
                  <h2>Maintenance Records</h2>
                  <p>Monthly maintenance payment status</p>
                </div>

                <button
                  className="primary-btn"
                  onClick={() => setShowPaymentForm(true)}
                >
                  + Add Payment
                </button>

              </div>

              <div className="filters">

                <div className="search-box">
                  🔎

                  <input
                    type="text"
                    placeholder="Search flat or owner..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                >
                  <option>August 2026</option>
                  <option>July 2026</option>
                  <option>June 2026</option>
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value)
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

                    {filteredRecords.map((record) => (
                      <tr key={record.id}>

                        <td>
                          <strong>{record.flat}</strong>
                        </td>

                        <td>{record.owner}</td>

                        <td>{record.month}</td>

                        <td>
                          ₹{record.amount.toLocaleString("en-IN")}
                        </td>

                        <td>
                          <span
                            className={`status ${record.status.toLowerCase()}`}
                          >
                            {record.status}
                          </span>
                        </td>

                        <td>{record.paidOn}</td>

                        <td>
                          {record.status !== "Paid" ? (
                            <button
                              className="pay-btn"
                              onClick={() =>
                                markAsPaid(record.id)
                              }
                            >
                              Mark Paid
                            </button>
                          ) : (
                            <span className="completed">
                              ✓ Completed
                            </span>
                          )}
                        </td>

                      </tr>
                    ))}

                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan="7" className="empty">
                          No maintenance records found.
                        </td>
                      </tr>
                    )}

                  </tbody>

                </table>

              </div>

            </section>

            <section className="bottom-grid">

              <div className="info-card">
                <div className="info-icon">💰</div>

                <div>
                  <span>Total Expected</span>
                  <strong>
                    ₹{(total * 2500).toLocaleString("en-IN")}
                  </strong>
                  <small>For current month</small>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">✓</div>

                <div>
                  <span>Total Collected</span>

                  <strong>
                    ₹{(paid * 2500).toLocaleString("en-IN")}
                  </strong>

                  <small>{paid} payments received</small>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">⚠</div>

                <div>
                  <span>Outstanding</span>

                  <strong>
                    ₹{((total - paid) * 2500).toLocaleString("en-IN")}
                  </strong>

                  <small>Pending + overdue</small>
                </div>
              </div>

            </section>
          </>
        )}

        {activePage === "Maintenance" && (
          <section className="content-card page-card">

            <div className="section-header">

              <div>
                <h2>Maintenance Management</h2>
                <p>Manage monthly maintenance payments.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() => setShowPaymentForm(true)}
              >
                + Add Payment
              </button>

            </div>

            <div className="summary-grid mini-grid">

              <div className="summary-card">
                <div className="card-icon green">✓</div>
                <div>
                  <span>Paid</span>
                  <strong>{paid}</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon orange">◷</div>
                <div>
                  <span>Pending</span>
                  <strong>{pending}</strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon red">!</div>
                <div>
                  <span>Overdue</span>
                  <strong>{overdue}</strong>
                </div>
              </div>

            </div>

          </section>
        )}

        {activePage === "Complaints" && (
          <section className="content-card page-card">

            <div className="section-header">
              <div>
                <h2>Complaints</h2>
                <p>Society complaints and their current status.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  alert("Complaint form will be connected next.")
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
                    <th>COMPLAINT</th>
                    <th>DATE</th>
                    <th>STATUS</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {complaints.map((complaint) => (
                    <tr key={complaint.id}>

                      <td>
                        <strong>{complaint.flat}</strong>
                      </td>

                      <td>{complaint.title}</td>

                      <td>{complaint.date}</td>

                      <td>
                        <span className="status pending">
                          {complaint.status}
                        </span>
                      </td>

                      <td>
                        <button
                          className="pay-btn"
                          onClick={() =>
                            alert(
                              `Complaint #${complaint.id}\n${complaint.title}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {activePage === "Residents" && (
          <section className="content-card page-card">

            <div className="section-header">
              <div>
                <h2>Residents</h2>
                <p>Registered residents and apartment details.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  alert("Add resident form will be connected next.")
                }
              >
                + Add Resident
              </button>
            </div>

            <div className="table-wrapper">

              <table>

                <thead>
                  <tr>
                    <th>FLAT</th>
                    <th>OWNER</th>
                    <th>PHONE</th>
                    <th>ACTION</th>
                  </tr>
                </thead>

                <tbody>

                  {residents.map((resident) => (
                    <tr key={resident.flat}>

                      <td>
                        <strong>{resident.flat}</strong>
                      </td>

                      <td>{resident.owner}</td>

                      <td>{resident.phone}</td>

                      <td>
                        <button
                          className="pay-btn"
                          onClick={() =>
                            alert(
                              `${resident.owner}\nFlat: ${resident.flat}\nPhone: ${resident.phone}`
                            )
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>

          </section>
        )}

        {activePage === "Reports" && (
          <section className="content-card page-card">

            <div className="section-header">
              <div>
                <h2>Reports</h2>
                <p>Monthly society maintenance summary.</p>
              </div>

              <button
                className="primary-btn"
                onClick={() =>
                  alert(
                    `August 2026 Report\n\nTotal Flats: ${total}\nPaid: ${paid}\nPending: ${pending}\nOverdue: ${overdue}\nCollected: ₹${(
                      paid * 2500
                    ).toLocaleString("en-IN")}`
                  )
                }
              >
                Generate Report
              </button>
            </div>

            <div className="summary-grid">

              <div className="summary-card">
                <div className="card-icon blue">₹</div>
                <div>
                  <span>Total Expected</span>
                  <strong>
                    ₹{(total * 2500).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon green">✓</div>
                <div>
                  <span>Collected</span>
                  <strong>
                    ₹{(paid * 2500).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

              <div className="summary-card">
                <div className="card-icon red">!</div>
                <div>
                  <span>Outstanding</span>
                  <strong>
                    ₹{((total - paid) * 2500).toLocaleString("en-IN")}
                  </strong>
                </div>
              </div>

            </div>

          </section>
        )}

      </main>

      {showPaymentForm && (
        <div
          className="modal-overlay"
          onClick={() => setShowPaymentForm(false)}
        >

          <div
            className="modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>Add Maintenance Payment</h2>
                <p>Record a new maintenance payment.</p>
              </div>

              <button
                className="close-btn"
                onClick={() => setShowPaymentForm(false)}
              >
                ×
              </button>

            </div>

            <label>Flat Number</label>

            <input
              placeholder="Example: A-106"
              value={paymentForm.flat}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  flat: e.target.value,
                })
              }
            />

            <label>Owner Name</label>

            <input
              placeholder="Enter owner name"
              value={paymentForm.owner}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  owner: e.target.value,
                })
              }
            />

            <label>Amount</label>

            <input
              type="number"
              placeholder="2500"
              value={paymentForm.amount}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  amount: e.target.value,
                })
              }
            />

            <label>Month</label>

            <select
              value={paymentForm.month}
              onChange={(e) =>
                setPaymentForm({
                  ...paymentForm,
                  month: e.target.value,
                })
              }
            >
              <option>August 2026</option>
              <option>July 2026</option>
              <option>June 2026</option>
            </select>

            <div className="modal-actions">

              <button
                className="secondary-btn"
                onClick={() => setShowPaymentForm(false)}
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

    </div>
  );
}

export default App;
