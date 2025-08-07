import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPanel.css";

import RolesManager from "../../components/Roles/RolesManager";
import MenuRoleMapping from "../../components/Modal/RolesMenuMappings/MenuRoleMapping";
import AdminUserMapping from "../../components/AdminUserMapping/AdminUserMapping";
import AddUser from "../../components/AdminUserMapping/AddUser";

import {
  FaClock,
  FaCheckCircle,
  FaUserShield,
  FaSitemap,
  FaUsersCog,
  FaUserPlus,
} from "react-icons/fa";

interface LoanApplication {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  nationalId: string;
  nationality: string;
  countryOfResidence: string;
  county: string;
  income: number;
  amount: number;
  tenure: number;
  status: string;
  submittedAt: string;
  documents: string[];
}

export default function AdminPanel() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [activePage, setActivePage] = useState<
    "pending" | "approved" | "roles" | "menuRoles" | "adminMappings" | "addUser"
  >("pending");

  const username = localStorage.getItem("username") || "Admin";

  useEffect(() => {
    const mockData: LoanApplication[] = [
      {
        id: "APP001",
        fullName: "John Doe",
        email: "john@example.com",
        phone: "+254712345678",
        nationalId: "12345678",
        nationality: "Kenyan",
        countryOfResidence: "Kenya",
        county: "Nairobi",
        income: 150000,
        amount: 5000000,
        tenure: 15,
        status: "Pending",
        submittedAt: "2025-08-01",
        documents: ["id.pdf", "payslip.pdf"],
      },
      {
        id: "APP002",
        fullName: "Jane Smith",
        email: "jane@example.com",
        phone: "+254711111111",
        nationalId: "23456789",
        nationality: "Kenyan",
        countryOfResidence: "Kenya",
        county: "Mombasa",
        income: 200000,
        amount: 3500000,
        tenure: 10,
        status: "Approved",
        submittedAt: "2025-08-02",
        documents: ["passport.pdf", "bankstatement.pdf"],
      },
    ];
    setApplications(mockData);
  }, []);

 
  const handleDecision = (status: "Approved" | "Rejected") => {
    if (!selectedApp) return;
    if (!decisionReason && status === "Rejected") {
      alert("Please provide a reason for rejection.");
      return;
    }

    setApplications((prev) =>
      prev.map((app) =>
        app.id === selectedApp.id ? { ...app, status } : app
      )
    );

    setSelectedApp(null);
    setDecisionReason("");
    alert(`Application ${status}`);
  };


  const filteredApplications =
    activePage === "pending"
      ? applications.filter((app) => app.status === "Pending")
      : applications.filter((app) => app.status === "Approved");


  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Admin Portal</h2>
        <nav>
          <ul>
            <li
              className={activePage === "pending" ? "active" : ""}
              onClick={() => setActivePage("pending")}
            >
              <FaClock className="menu-icon" /> Pending Approvals
            </li>
            <li
              className={activePage === "approved" ? "active" : ""}
              onClick={() => setActivePage("approved")}
            >
              <FaCheckCircle className="menu-icon" /> Approved Items
            </li>        
            <li
              className={activePage === "addUser" ? "active" : ""}
              onClick={() => setActivePage("addUser")}
            >
              <FaUserPlus className="menu-icon" /> Add User
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        {/* Top Bar */}
        <div className="top-bar">
          <div className="user-info">
            Logged in as <strong>{username}</strong> • Last login:{" "}
            {new Date().toLocaleString()}
          </div>
          <button className="logout-icon" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>

        {activePage === "pending" || activePage === "approved" ? (
          <>
            <h1>
              {activePage === "pending"
                ? "Pending Approvals"
                : "Approved Applications"}
            </h1>

            <table className="applications-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Full Name</th>
                  <th>Loan Amount</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                  {activePage === "pending" && <th>Action</th>}
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.fullName}</td>
                    <td>{app.amount.toLocaleString()}</td>
                    <td className={`status ${app.status.toLowerCase()}`}>
                      {app.status}
                    </td>
                    <td>{app.submittedAt}</td>
                    {activePage === "pending" && (
                      <td>
                        <button onClick={() => setSelectedApp(app)}>View</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : activePage === "roles" ? (
          <RolesManager />
        ) : activePage === "menuRoles" ? (
          <MenuRoleMapping />
        ) : activePage === "adminMappings" ? (
          <AdminUserMapping />
        ) : activePage === "addUser" ? (
          <AddUser />
        ) : null}

        {/* Application Modal */}
        {selectedApp && (
          <div className="modal">
            <div className="modal-content">
              <h2>Application Details ({selectedApp.id})</h2>
              <p><strong>Full Name:</strong> {selectedApp.fullName}</p>
              <p><strong>Email:</strong> {selectedApp.email}</p>
              <p><strong>Phone:</strong> {selectedApp.phone}</p>
              <p><strong>National ID / Passport:</strong> {selectedApp.nationalId}</p>
              <p><strong>Nationality:</strong> {selectedApp.nationality}</p>
              <p><strong>Country of Residence:</strong> {selectedApp.countryOfResidence}</p>
              <p><strong>County:</strong> {selectedApp.county}</p>
              <p><strong>Income:</strong> {selectedApp.income.toLocaleString()} KES</p>
              <p><strong>Loan Amount:</strong> {selectedApp.amount.toLocaleString()} KES</p>
              <p><strong>Tenure:</strong> {selectedApp.tenure} years</p>
              <p><strong>Documents:</strong> {selectedApp.documents.join(", ")}</p>

              <textarea
                placeholder="Reason (required if rejecting)"
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
              />

              <div className="modal-actions">
                <button className="approve" onClick={() => handleDecision("Approved")}>
                  Approve
                </button>
                <button className="reject" onClick={() => handleDecision("Rejected")}>
                  Reject
                </button>
                <button className="close" onClick={() => setSelectedApp(null)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
