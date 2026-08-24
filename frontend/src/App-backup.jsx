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

const initialComplaints = [
  {
    id: 1,
    flat: "A-102",
    resident: "Priya Verma",
    category: "Plumbing",
    description: "Water leakage in bathroom.",
    priority: "High",
    status: "Open",
  },
  {
    id: 2,
    flat: "A-105",
    resident: "Rohit Gupta",
    category: "Electricity",
    description: "Corridor light not working.",
    priority: "Medium",
    status: "Open",
  },
];

const initialResidents = [
  {
    id: 1,
    flat: "A-101",
    name: "Rahul Sharma",
    phone: "9876543210",
    type: "Owner",
  },
  {
    id: 2,
    flat: "A-102",
    name: "Priya Verma",
    phone: "9876543211",
    type: "Owner",
  },
  {
    id: 3,
    flat: "A-103",
    name: "Amit Kumar",
    phone: "9876543212",
    type: "Owner",
  },
  {
    id: 4,
    flat: "A-104",
    name: "Neha Singh",
    phone: "9876543213",
    type: "Owner",
  },
  {
    id: 5,
    flat: "A-105",
    name: "Rohit Gupta",
    phone: "9876543214",
    type: "Owner",
  },
];

function App() {
  const [activePage, setActivePage] = useState("Dashboard");

  const [records, setRecords] = useState(initialRecords);
  const [complaints, setComplaints] = useState(initialComplaints);
  const [residents, setResidents] = useState(initialResidents);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [month, setMonth] = useState("August 2026");

  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [showResidentForm, setShowResidentForm] = useState(false);

  const [flat, setFlat] = useState("");
  const [owner, setOwner] = useState("");
  const [amount, setAmount] = useState("");
  const [paymentMonth, setPaymentMonth] = useState("August 2026");

  const [complaintFlat, setComplaintFlat] = useState("");
  const [complaintResident, setComplaintResident] = useState("");
  const [complaintCategory, setComplaintCategory] =
    useState("Plumbing");
  const [complaintDescription, setComplaintDescription] =
    useState("");
  const [complaintPriority, setComplaintPriority] =
    useState("Medium");

  const [residentFlat, setResidentFlat] = useState("");
  const [residentName, setResidentName] = useState("");
  const [residentPhone, setResidentPhone] = useState("");
  const [residentType, setResidentType] = useState("Owner");

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        record.flat.toLowerCase().includes(searchText) ||
        record.owner.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" ||
        record.status === statusFilter;

      const matchesMonth = record.month === month;

      return matchesSearch && matchesStatus && matchesMonth;
    });
  }, [records, search, statusFilter, month]);

  const total = records.length;

  const paid = records.filter(
    (record) => record.status === "Paid"
  ).length;

  const pending = records.filter(
    (record) => record.status === "Pending"
  ).length;

  const overdue = records.filter(
    (record) => record.status === "Overdue"
  ).length;

  const totalExpected = total * 2500;
  const totalCollected = records.reduce(
    (sum, record) =>
      record.status === "Paid"
        ? sum + record.amount
        : sum,
    0
  );

  const outstanding = records.reduce(
    (sum, record) =>
      record.status !== "Paid"
        ? sum + record.amount
        : sum,
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
  };

  const resetPaymentForm = () => {
    setFlat("");
    setOwner("");
    setAmount("");
    setPaymentMonth("August 2026");
  };

  const savePayment = () => {
    if (!flat.trim() || !owner.trim() || !amount) {
      alert("Please fill all payment details.");
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

    setRecords((current) => [...current, newRecord]);

    resetPaymentForm();
    setShowPaymentForm(false);
    setMonth(paymentMonth);
    setStatusFilter("All");
  };

  const closePaymentForm = () => {
    resetPaymentForm();
    setShowPaymentForm(false);
  };

  const resetComplaintForm = () => {
    setComplaintFlat("");
    setComplaintResident("");
    setComplaintCategory("Plumbing");
    setComplaintDescription("");
    setComplaintPriority("Medium");
  };

  const saveComplaint = () => {
    if (
      !complaintFlat.trim() ||
      !complaintResident.trim() ||
      !complaintDescription.trim()
    ) {
      alert("Please fill all complaint details.");
      return;
    }

    const newComplaint = {
      id: Date.now(),
      flat: complaintFlat.trim(),
      resident: complaintResident.trim(),
      category: complaintCategory,
      description: complaintDescription.trim(),
      priority: complaintPriority,
      status: "Open",
    };

    setComplaints((current) => [
      ...current,
      newComplaint,
    ]);

    resetComplaintForm();
    setShowComplaintForm(false);
  };

  const resolveComplaint = (id) => {
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === id
          ? { ...complaint, status: "Resolved" }
          : complaint
      )
    );
  };

  const resetResidentForm = () => {
    setResidentFlat("");
    setResidentName("");
    setResidentPhone("");
    setResidentType("Owner");
  };

  const saveResident = () => {
    if (
      !residentFlat.trim() ||
      !residentName.trim() ||
      !residentPhone.trim()
    ) {
      alert("Please fill all resident details.");
      return;
    }

    const newResident = {
      id: Date.now(),
      flat: residentFlat.trim(),
      name: residentName.trim(),
      phone: residentPhone.trim(),
      type: residentType,
    };

    setResidents((current) => [
      ...current,
      newResident,
    ]);

    resetResidentForm();
    setShowResidentForm(false);
  };

  const renderDashboard = () => (
    <>
      <header className="topbar">
        <div>
          <p className="eyebrow">OVERVIEW</p>

          <h1>Maintenance Dashboard</h1>

          <p className="subtitle">
            Track society maintenance payments and pending dues.
          </p>
        </div>

        <div className="profile">
          <button
            className="notification"
            onClick={() =>
              alert("No new notifications.")
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
            🔍

            <input
              type="text"
              placeholder="Search flat or owner..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <select
            value={month}
            onChange={(event) =>
              setMonth(event.target.value)
            }
          >
            <option>August 2026</option>
            <option>July 2026</option>
            <option>June 2026</option>
          </select>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value)
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
              ₹{totalExpected.toLocaleString("en-IN")}
            </strong>

            <small>For current month</small>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">✓</div>

          <div>
            <span>Total Collected</span>

            <strong>
              ₹{totalCollected.toLocaleString("en-IN")}
            </strong>

            <small>{paid} payments received</small>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">⚠</div>

          <div>
            <span>Outstanding</span>

            <strong>
              ₹{outstanding.toLocaleString("en-IN")}
            </strong>

            <small>Pending + overdue</small>
          </div>
        </div>
      </section>
    </>
  );

  const renderMaintenance = () => (
    <section className="content-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">MAINTENANCE</p>
          <h2>Maintenance Payments</h2>
          <p>Manage society maintenance payments.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowPaymentForm(true)}
        >
          + Add Payment
        </button>
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
              <th>ACTION</th>
            </tr>
          </thead>

          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td><strong>{record.flat}</strong></td>
                <td>{record.owner}</td>
                <td>{record.month}</td>
                <td>₹{record.amount.toLocaleString("en-IN")}</td>
                <td>
                  <span
                    className={`status ${record.status.toLowerCase()}`}
                  >
                    {record.status}
                  </span>
                </td>
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
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderComplaints = () => (
    <section className="content-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">SERVICE REQUESTS</p>
          <h2>Complaints</h2>
          <p>Manage resident complaints and requests.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowComplaintForm(true)}
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
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td><strong>{complaint.flat}</strong></td>
                <td>{complaint.resident}</td>
                <td>{complaint.category}</td>
                <td>{complaint.description}</td>
                <td>{complaint.priority}</td>
                <td>
                  <span
                    className={`status ${
                      complaint.status === "Resolved"
                        ? "paid"
                        : "pending"
                    }`}
                  >
                    {complaint.status}
                  </span>
                </td>
                <td>
                  {complaint.status === "Open" ? (
                    <button
                      className="pay-btn"
                      onClick={() =>
                        resolveComplaint(complaint.id)
                      }
                    >
                      Resolve
                    </button>
                  ) : (
                    <span className="completed">
                      ✓ Resolved
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderResidents = () => (
    <section className="content-card">
      <div className="section-header">
        <div>
          <p className="eyebrow">SOCIETY DIRECTORY</p>
          <h2>Residents</h2>
          <p>View and manage society residents.</p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setShowResidentForm(true)}
        >
          + Add Resident
        </button>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>FLAT</th>
              <th>NAME</th>
              <th>PHONE</th>
              <th>TYPE</th>
            </tr>
          </thead>

          <tbody>
            {residents.map((resident) => (
              <tr key={resident.id}>
                <td><strong>{resident.flat}</strong></td>
                <td>{resident.name}</td>
                <td>{resident.phone}</td>
                <td>{resident.type}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );

  const renderReports = () => (
    <>
      <section className="content-card">
        <div>
          <p className="eyebrow">ANALYTICS</p>
          <h2>Reports</h2>
          <p>Society maintenance collection overview.</p>
        </div>

        <div className="summary-grid" style={{ marginTop: "24px" }}>
          <div className="summary-card">
            <div className="card-icon blue">₹</div>
            <div>
              <span>Total Expected</span>
              <strong>
                ₹{totalExpected.toLocaleString("en-IN")}
              </strong>
              <small>Current records</small>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon green">✓</div>
            <div>
              <span>Collected</span>
              <strong>
                ₹{totalCollected.toLocaleString("en-IN")}
              </strong>
              <small>Paid payments</small>
            </div>
          </div>

          <div className="summary-card">
            <div className="card-icon red">!</div>
            <div>
              <span>Outstanding</span>
              <strong>
                ₹{outstanding.toLocaleString("en-IN")}
              </strong>
              <small>Pending + overdue</small>
            </div>
          </div>
        </div>
      </section>

      <section className="content-card" style={{ marginTop: "20px" }}>
        <h2>Payment Summary</h2>
        <p className="subtitle">
          Paid: {paid} &nbsp; | &nbsp; Pending: {pending}
          &nbsp; | &nbsp; Overdue: {overdue}
        </p>
      </section>
    </>
  );

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
          {[
            ["Dashboard", "⌂"],
            ["Maintenance", "₹"],
            ["Complaints", "⚠"],
            ["Residents", "👥"],
            ["Reports", "📊"],
          ].map(([page, icon]) => (
            <button
              key={page}
              className={`nav-item ${
                activePage === page ? "active" : ""
              }`}
              onClick={() => setActivePage(page)}
            >
              <span>{icon}</span>
              {page}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="society-card">
            <strong>Green Valley Society</strong>
            <span>120 Apartments</span>
          </div>

          <button
            className="logout"
            onClick={() =>
              alert("Logout functionality will be added later.")
            }
          >
            ↪ Logout
          </button>
        </div>
      </aside>

      <main className="main">

        {activePage === "Dashboard" && renderDashboard()}

        {activePage === "Maintenance" &&
          renderMaintenance()}

        {activePage === "Complaints" &&
          renderComplaints()}

        {activePage === "Residents" &&
          renderResidents()}

        {activePage === "Reports" &&
          renderReports()}

      </main>

      {/* PAYMENT MODAL */}

      {showPaymentForm && (
        <div
          className="modal-overlay"
          onClick={closePaymentForm}
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Add Maintenance Payment</h2>
                <p>Record a new maintenance payment.</p>
              </div>

              <button
                className="close-btn"
                onClick={closePaymentForm}
              >
                ×
              </button>
            </div>

            <label>Flat Number</label>

            <input
              value={flat}
              onChange={(event) =>
                setFlat(event.target.value)
              }
              placeholder="Example: A-106"
            />

            <label>Owner Name</label>

            <input
              value={owner}
              onChange={(event) =>
                setOwner(event.target.value)
              }
              placeholder="Enter owner name"
            />

            <label>Amount</label>

            <input
              type="number"
              value={amount}
              onChange={(event) =>
                setAmount(event.target.value)
              }
              placeholder="2500"
            />

            <label>Month</label>

            <select
              value={paymentMonth}
              onChange={(event) =>
                setPaymentMonth(event.target.value)
              }
            >
              <option>August 2026</option>
              <option>July 2026</option>
              <option>June 2026</option>
            </select>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={closePaymentForm}
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

      {/* COMPLAINT MODAL */}

      {showComplaintForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowComplaintForm(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>New Complaint</h2>
                <p>Create a resident complaint.</p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowComplaintForm(false)
                }
              >
                ×
              </button>
            </div>

            <label>Flat Number</label>

            <input
              value={complaintFlat}
              onChange={(event) =>
                setComplaintFlat(event.target.value)
              }
              placeholder="Example: A-106"
            />

            <label>Resident Name</label>

            <input
              value={complaintResident}
              onChange={(event) =>
                setComplaintResident(
                  event.target.value
                )
              }
              placeholder="Enter resident name"
            />

            <label>Category</label>

            <select
              value={complaintCategory}
              onChange={(event) =>
                setComplaintCategory(
                  event.target.value
                )
              }
            >
              <option>Plumbing</option>
              <option>Electricity</option>
              <option>Cleaning</option>
              <option>Security</option>
              <option>Other</option>
            </select>

            <label>Description</label>

            <input
              value={complaintDescription}
              onChange={(event) =>
                setComplaintDescription(
                  event.target.value
                )
              }
              placeholder="Describe the complaint"
            />

            <label>Priority</label>

            <select
              value={complaintPriority}
              onChange={(event) =>
                setComplaintPriority(
                  event.target.value
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

      {/* RESIDENT MODAL */}

      {showResidentForm && (
        <div
          className="modal-overlay"
          onClick={() =>
            setShowResidentForm(false)
          }
        >
          <div
            className="modal"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>Add Resident</h2>
                <p>Add a resident to the society directory.</p>
              </div>

              <button
                className="close-btn"
                onClick={() =>
                  setShowResidentForm(false)
                }
              >
                ×
              </button>
            </div>

            <label>Flat Number</label>

            <input
              value={residentFlat}
              onChange={(event) =>
                setResidentFlat(event.target.value)
              }
              placeholder="Example: A-106"
            />

            <label>Resident Name</label>

            <input
              value={residentName}
              onChange={(event) =>
                setResidentName(event.target.value)
              }
              placeholder="Enter resident name"
            />

            <label>Phone Number</label>

            <input
              value={residentPhone}
              onChange={(event) =>
                setResidentPhone(event.target.value)
              }
              placeholder="9876543210"
            />

            <label>Resident Type</label>

            <select
              value={residentType}
              onChange={(event) =>
                setResidentType(event.target.value)
              }
            >
              <option>Owner</option>
              <option>Tenant</option>
            </select>

            <div className="modal-actions">
              <button
                className="secondary-btn"
                onClick={() =>
                  setShowResidentForm(false)
                }
              >
                Cancel
              </button>

              <button
                className="primary-btn"
                onClick={saveResident}
              >
                Save Resident
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default App;