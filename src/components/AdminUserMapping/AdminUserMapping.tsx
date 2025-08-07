import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminUserMapping.css';

interface User {
  idxno: number;
  username: string;
  useridentificationnumber: string;
  roleid: string;
}

const AdminUserMapping: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [usersOnly, setUsersOnly] = useState<User[]>([]);
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  useEffect(() => {
    axios
      .get('http://localhost:8080/api/users/all')
      .then((res) => {
        setUsers(res.data);
        const admins = res.data.filter((u: User) => u.roleid === '01');
        const users = res.data.filter((u: User) => u.roleid === '02');
        setAdmins(admins);
        setUsersOnly(users);
      })
      .catch((err) => {
        console.error('Error fetching users', err);
      });
  }, []);

  const handleAssign = () => {
    console.log('Assigning users:', selectedUserIds, 'to Admin:', selectedAdminId);
    // You'll implement the API call here later
  };

  const toggleUserSelection = (userId: string) => {
    setSelectedUserIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div className="admin-user-mapping-container">
      <div className="dropdowns-section">
        <div className="dropdown">
          <h3>Select Admin</h3>
          <select value={selectedAdminId} onChange={(e) => setSelectedAdminId(e.target.value)}>
            <option value="">-- Select Admin --</option>
            {admins.map((admin) => (
              <option key={admin.idxno} value={admin.useridentificationnumber}>
                {admin.username} ({admin.useridentificationnumber})
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <h3>Select Users</h3>
          <div className="checkbox-list scrollable">
            {usersOnly.map((user) => (
              <label key={user.idxno}>
                <input
                  type="checkbox"
                  checked={selectedUserIds.includes(user.useridentificationnumber)}
                  onChange={() => toggleUserSelection(user.useridentificationnumber)}
                />
                {user.username} ({user.useridentificationnumber})
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="assign-btn" onClick={handleAssign} disabled={!selectedAdminId || selectedUserIds.length === 0}>
        Assign Users to Admin
      </button>

      <table className="mapping-table">
        <thead>
          <tr>
            <th>Admin</th>
            <th>Assigned Users</th>
          </tr>
        </thead>
        <tbody>
          {selectedAdminId && selectedUserIds.length > 0 ? (
            <tr>
              <td>{selectedAdminId}</td>
              <td>{selectedUserIds.join(', ')}</td>
            </tr>
          ) : (
            <tr>
              <td colSpan={2} className="empty">No mappings to display.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminUserMapping;
