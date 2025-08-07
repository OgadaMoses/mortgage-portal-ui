import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
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
  loanappid: string;
  fullnames: string;
  email: string;
  phonenumber: string;
  idpassportnumber: string;
  nationality: string;
  countryresidence: string;
  countyresidence: string;
  netmonthlyincome: number;
  loanamount: number;
  loantenure: number;
  documenturls: string[];
  loanstatus: string;
  applicationdate: string;
  [key: string]: any; // optional if there are extra fields
}


export default function AdminPanel() {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [selectedApp, setSelectedApp] = useState<LoanApplication | null>(null);
  const [decisionReason, setDecisionReason] = useState("");
  const [activePage, setActivePage] = useState<
    "pending" | "approved" | "roles" | "menuRoles" | "adminMappings" | "addUser"
  >("pending");

  const username = localStorage.getItem("username") || "Admin";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const status = activePage === "pending" ? "PENDING" : "APPROVED";
        const res = await fetch(`http://localhost:8080/api/loans/status?status=${status}`);
        if (!res.ok) throw new Error("Failed to fetch applications");

        const data = await res.json();

        const transformed: LoanApplication[] = data.map((app: any) => ({
          id: app.loanappid,
          fullName: app.fullnames,
          email: app.email,
          phone: app.phonenumber,
          nationalId: app.useridentificationnumber,
          nationality: app.nationality,
          countryOfResidence: app.countryresidence,
          county: app.countyresidence,
          income: app.netmonthlyincome,
          amount: app.loanamount,
          tenure: app.loantenure,
          status: app.loanstatus,
          submittedAt: app.applicationdate,
          documents: app.documents || [],
        }));

        setApplications(transformed);
      } catch (error) {
        console.error("Error loading applications:", error);
      }
    };

    if (activePage === "pending" || activePage === "approved") {
      fetchApplications();
    }
  }, [activePage]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

    const handleDecision = async (status: "Approved" | "Rejected") => {
      if (!selectedApp) {
        toast.error("No loan application selected.");
        return;
      }

      if (status === "Rejected" && !decisionReason.trim()) {
        toast.warning("Please provide a reason for rejection.");
        return;
      }

      const checkerId = localStorage.getItem("useridentificationnumber");

      if (!checkerId) {
        toast.error("Checker ID not found. Please log in again.");
        return;
      }

      try {
        const response = await fetch(
          `http://localhost:8080/api/loans/${selectedApp.id}/decision?status=${status.toUpperCase()}&checkerId=${checkerId}`,
          {
            method: "PUT",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update loan status.");
        }

        setApplications((prevApps) =>
          prevApps.map((app) =>
            app.id === selectedApp.id ? { ...app, status: status.toUpperCase() } : app
          )
        );

        setSelectedApp(null);
        setDecisionReason(""); // reset

        toast.success(`✅ Loan ${status} successfully!`);

      } catch (error) {
        console.error("Error updating loan status:", error);
        toast.error("Something went wrong while updating loan status.");
      }
    };


  const filteredApplications = applications;

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
        <div className="top-bar">
          <div className="user-info">
            Logged in as <strong>{username}</strong> • Last login: {new Date().toLocaleString()}
          </div>
          <button className="logout-icon" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>

        {activePage === "pending" || activePage === "approved" ? (
          <>
            <h1>
              {activePage === "pending" ? "Pending Approvals" : "Approved Applications"}
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
                    <td className={`status ${app.status.toLowerCase()}`}>{app.status}</td>
                    <td>{new Date(app.submittedAt).toLocaleDateString()}</td>
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

        {/* Modal */}
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
      <p><strong>Income:</strong> KES {selectedApp.income?.toLocaleString?.() || "N/A"}</p>
      <p><strong>Loan Amount:</strong> KES {selectedApp.amount?.toLocaleString?.() || "N/A"}</p>
      <p><strong>Tenure:</strong> {selectedApp.tenure || "N/A"} years</p>
      <p><strong>Documents:</strong> {selectedApp.documents?.join(", ") || "None"}</p>

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
