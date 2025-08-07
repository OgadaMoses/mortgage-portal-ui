import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import { FaFileAlt, FaPlusCircle } from 'react-icons/fa';
import LoanApplicationForm from '../../components/LoanApplicationForm/LoanApplicationForm';

interface LoanApplication {
  id: string;
  amount: number;
  tenure: number;
  status: string;
  submittedAt: string;
}

export default function UserDashboard() {
  const [activePage, setActivePage] = useState<'myapps' | 'apply'>('myapps');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const navigate = useNavigate();

  const username = localStorage.getItem('username') ?? 'User';
  const userId = localStorage.getItem('useridentificationnumber') ?? 'Unknown';
  const lastLogin = localStorage.getItem('lastLogin') ?? 'First time login';

  useEffect(() => {
    const mockData: LoanApplication[] = [
      { id: 'APP001', amount: 5000000, tenure: 15, status: 'Pending', submittedAt: '2025-08-01' },
      { id: 'APP002', amount: 3500000, tenure: 10, status: 'Approved', submittedAt: '2025-08-02' },
      { id: 'APP003', amount: 7500000, tenure: 20, status: 'Rejected', submittedAt: '2025-08-03' },
    ];
    setApplications(mockData);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="sidebar-title">Mortgage Portal</h2>
        <nav>
          <ul>
            <li
              className={activePage === 'myapps' ? 'active' : ''}
              onClick={() => setActivePage('myapps')}
            >
              <FaFileAlt className="menu-icon" /> My Applications
            </li>
            <li
              className={activePage === 'apply' ? 'active' : ''}
              onClick={() => setActivePage('apply')}
            >
              <FaPlusCircle className="menu-icon" /> Apply for Loan
            </li>
          </ul>
        </nav>
      </aside>

      <main className="dashboard-content">
        <div className="top-bar">
          <div className="user-info">
            <div><strong>{username}</strong> ({userId})</div>
            <div>Last login: {lastLogin}</div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            🔓 Logout
          </button>
        </div>

        {activePage === 'myapps' && (
          <>
            <h1>My Applications</h1>
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Loan Amount (KES)</th>
                  <th>Tenure (Years)</th>
                  <th>Status</th>
                  <th>Submitted On</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td>{app.id}</td>
                    <td>{app.amount.toLocaleString()}</td>
                    <td>{app.tenure}</td>
                    <td className={`status ${app.status.toLowerCase()}`}>{app.status}</td>
                    <td>{app.submittedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {activePage === 'apply' && <LoanApplicationForm />}
      </main>
    </div>
  );
}
