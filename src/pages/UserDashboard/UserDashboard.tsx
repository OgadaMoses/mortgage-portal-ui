import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';
import { FaFileAlt, FaPlusCircle } from 'react-icons/fa';
import LoanApplicationForm from '../../components/LoanApplicationForm/LoanApplicationForm';
import axios from 'axios';

interface LoanApplication {
  loanappid: string;
  loanamount: number;
  loantenure: number;
  loanstatus: string;
  applicationdate: string;
}

export default function UserDashboard() {
  const [activePage, setActivePage] = useState<'myapps' | 'apply'>('myapps');
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const username = localStorage.getItem('username') ?? 'User';
  const userId = localStorage.getItem('useridentificationnumber') ?? 'Unknown';
  const lastLogin = localStorage.getItem('lastLogin') ?? 'First time login';

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get<LoanApplication[]>(
          `http://localhost:8080/api/loans/my-applications`,
          {
            params: {
              username,
              useridentificationnumber: userId,
            },
          }
        );
        setApplications(response.data);
      } catch (err) {
        console.error('Failed to fetch loan applications:', err);
        setError('Failed to load applications.');
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [username, userId]);

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
            {loading ? (
              <p>Loading applications...</p>
            ) : error ? (
              <p className="error">{error}</p>
            ) : applications.length === 0 ? (
              <p>No applications found.</p>
            ) : (
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
                    <tr key={app.loanappid}>
                      <td>{app.loanappid}</td>
                      <td>{app.loanamount.toLocaleString()}</td>
                      <td>{app.loantenure}</td>
                      <td className={`status ${app.loanstatus.toLowerCase()}`}>{app.loanstatus}</td>
                      <td>{new Date(app.applicationdate).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activePage === 'apply' && <LoanApplicationForm />}
      </main>
    </div>
  );
}
