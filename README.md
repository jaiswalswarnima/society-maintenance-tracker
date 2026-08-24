# Society Maintenance Tracker

## Project Overview

Society Maintenance Tracker is a web-based society management application designed to manage:

* Society maintenance payments
* Resident complaints
* Residents
* Reports
* Admin operations
* Payment status and collection tracking

---

## Live Application

**Website:**
https://society-maintenance-tracker-1-3q69.onrender.com

**Backend API:**
https://society-maintenance-tracker-28xu.onrender.com

**API Documentation:**
https://society-maintenance-tracker-28xu.onrender.com/docs

---

## Current Login Credentials

### Admin Demo Account

| Field              | Details                         |
| ------------------ | ------------------------------- |
| Username / Email   | `admin@society.com`             |
| Password           | `admin123`                      |
| User ID / Login ID | `admin`                         |
| Role               | `Society Admin / Administrator` |

### Login Flow

```text
Open Website
      ↓
Login Page
      ↓
Enter Email + Password
      ↓
Backend Authentication
      ↓
Dashboard
```

The currently deployed website is successfully working with the **Admin Demo Account** mentioned above.

> **Important:** Random accounts such as `resident@test.com` cannot currently log in unless that account has already been created in the backend database.

---

## Main Features

### 1. Dashboard

The Dashboard provides:

* Total Flats
* Paid Payments
* Pending Payments
* Overdue Payments
* Total Expected Collection
* Total Collected Amount
* Outstanding Amount
* Maintenance Records
* Search by Flat or Owner
* Month Filter
* Payment Status Filter

---

### 2. Maintenance

The Maintenance section provides:

* Add Maintenance Payment
* Monthly Payment Tracking
* Paid Status
* Pending Status
* Overdue Status
* Total Collection
* Outstanding Amount

---

### 3. Complaints

The Complaints section provides:

* Create New Complaint
* Complaint Category
* Complaint Description
* Complaint Priority
* Complaint Status
* Admin Complaint List
* Resolve Complaint

---

### 4. Residents

The Residents section provides:

* Resident Name
* Flat Number
* Resident Overview

---

### 5. Reports

The Reports section provides:

* Total Expected
* Total Collected
* Outstanding Amount
* Collection Rate

---

## Backend API Endpoints

### Authentication

```text
POST /auth/register
POST /auth/login
GET  /auth/me
```

### Resident

```text
GET /resident/test
```

### Admin

```text
GET   /admin/test
GET   /admin/complaints
PATCH /admin/complaints/{complaint_id}
```

### Complaints

```text
POST /complaints
GET  /complaints/my
GET  /complaints/{complaint_id}
```

---

## Technology Stack

### Frontend

* React
* JavaScript
* CSS
* Fetch API
* Browser Local Storage

### Backend

* Python
* FastAPI
* REST API
* Authentication
* Database

### Deployment

* Render

---

## Project Structure

```text
society-maintenance-tracker/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── society.db
│   └── ...
│
└── README.md
```

---

## Run Frontend Locally

```powershell
cd "C:\Users\Swarnima Jaiswal\OneDrive\Desktop\society-maintenance-tracker\frontend"

npm install

npm run dev
```

---

## Git Commands

After making frontend changes:

```powershell
cd "C:\Users\Swarnima Jaiswal\OneDrive\Desktop\society-maintenance-tracker"

git add frontend/src/App.jsx

git commit -m "update frontend"

git push origin main
```

---

## Testing the Application

1. Open the live website.
2. Login using:

```text
Email:    admin@society.com
Password: admin123
User ID:  admin
Role:     Society Admin / Administrator
```

3. Click **Login**.
4. Verify the Dashboard.
5. Open **Maintenance**.
6. Open **Complaints**.
7. Create/resolve a complaint.
8. Open **Residents**.
9. Open **Reports**.
10. Test **Logout**.

---

## Current Project Status

* [x] Frontend deployed
* [x] Backend deployed
* [x] Admin login working
* [x] Dashboard working
* [x] Maintenance working
* [x] Complaints working
* [x] Complaint resolve action working
* [x] Residents working
* [x] Reports working
* [x] Logout working
* [x] Frontend Unicode/encoding issue fixed
* [ ] Public Sign Up UI
* [ ] Complete multi-user Sign Up → Login → Dashboard flow

---

## Current Limitation

The **currently working deployed login account is the Admin Demo Account**:

```text
Email:    admin@society.com
Password: admin123
User ID:  admin
Role:     Society Admin / Administrator
```

The backend contains a registration API:

```text
POST /auth/register
```

However, the deployed frontend currently does **not** provide a complete public Sign Up screen.

Therefore, a new/random user cannot directly create an account from the current login page.

The complete future flow would be:

```text
Sign Up
   ↓
Account Created
   ↓
Login
   ↓
Authentication
   ↓
User Dashboard
```

---

## Demo Account

For project evaluation, use:

**Website:**
https://society-maintenance-tracker-1-3q69.onrender.com

**Email:** `admin@society.com`

**Password:** `admin123`

**User ID:** `admin`

**Role:** `Society Admin / Administrator`

This account is currently configured and working for accessing the deployed dashboard.
