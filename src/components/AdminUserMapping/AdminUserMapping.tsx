import React, { useState } from "react";
import "./AdminUserMapping.css";

interface Admin {
  id: string;
  name: string;
}

interface User {
  id: string;
  name: string;
}

interface Mapping {
  adminName: string;
  users: string[];
}

export default function AdminUserMapping() {
  const [admins] = useState<Admin[]>([
    { id: "ADM001", name: "Alice Admin" },
    { id: "ADM002", name: "Bob Admin" },
  ]);

  const [users] = useState<User[]>([
    { id: "USR001", name: "John Doe" },
    { id: "USR002", name: "Jane Smith" },
    { id: "USR003", name: "Michael Kim" },
    { id: "USR004", name: "Sarah Wang" },
    { id: "USR005", name: "David Otieno" },
    { id: "USR006", name: "Amina Yusuf" },
  ]);

  const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const toggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((u) => u !== userId)
        : [...prev, userId]
    );
  };

  const assignUsers = () => {
    if (!selectedAdmin || selectedUsers.length === 0) {
      alert("Please select an admin and at least one user.");
      return;
    }

    const adminName = admins.find((a) => a.id === selectedAdmin)?.name || "";

    const newMapping: Mapping = {
      adminName,
      users: selectedUsers.map(
        (userId) => users.find((u) => u.id === userId)?.name || ""
      ),
    };

    setMappings([...mappings, newMapping]);

    setSelectedAdmin(null);
    setSelectedUsers([]);
  };

  return (
    <div className="admin-user-mapping-container">
      <h2>Admin User Mapping</h2>

      <div className="dropdowns-section">
        <div className="dropdown">
          <h3>Select Admin</h3>
          <select
            value={selectedAdmin || ""}
            onChange={(e) => setSelectedAdmin(e.target.value || null)}
          >
            <option value="">-- Select Admin --</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name}
              </option>
            ))}
          </select>
        </div>

        <div className="dropdown">
          <h3>Select Users</h3>
          <div className="checkbox-list scrollable">
            {users.map((user) => (
              <label key={user.id}>
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={() => toggleUser(user.id)}
                />
                {user.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="assign-btn" onClick={assignUsers}>
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
          {mappings.map((mapping, index) => (
            <tr key={index}>
              <td>{mapping.adminName}</td>
              <td>{mapping.users.join(", ")}</td>
            </tr>
          ))}
          {mappings.length === 0 && (
            <tr>
              <td colSpan={2} className="empty">
                No mappings yet.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
