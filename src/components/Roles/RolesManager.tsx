import React, { useState } from "react";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import "./Roles.css";

interface Role {
  idxno: number;
  roleId: string;
  roleDescription: string;
}

export default function RolesManager() {
  const [roles, setRoles] = useState<Role[]>([
    { idxno: 1, roleId: "ADMIN", roleDescription: "Administrator" },
    { idxno: 2, roleId: "USER", roleDescription: "Standard User" },
  ]);
  const [newRoleId, setNewRoleId] = useState("");
  const [newRoleDesc, setNewRoleDesc] = useState("");
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingDesc, setEditingDesc] = useState("");

  const addRole = () => {
    if (!newRoleId || !newRoleDesc) {
      alert("Please enter Role ID and Description");
      return;
    }
    const newRole: Role = {
      idxno: roles.length + 1,
      roleId: newRoleId,
      roleDescription: newRoleDesc,
    };
    setRoles([...roles, newRole]);
    setNewRoleId("");
    setNewRoleDesc("");
  };

  const startEdit = (role: Role) => {
    setEditingIdx(role.idxno);
    setEditingDesc(role.roleDescription);
  };

  const saveEdit = (idxno: number) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.idxno === idxno ? { ...r, roleDescription: editingDesc } : r
      )
    );
    setEditingIdx(null);
    setEditingDesc("");
  };

  const deleteRole = (idxno: number) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      setRoles(roles.filter((r) => r.idxno !== idxno));
    }
  };

  return (
    <div className="roles-container">
      <h2>Roles Management</h2>

      {/* Add Role Form */}
      <div className="add-role-form">
        <input
          type="text"
          placeholder="Role ID (e.g., ADMIN)"
          value={newRoleId}
          onChange={(e) => setNewRoleId(e.target.value)}
        />
        <input
          type="text"
          placeholder="Role Description"
          value={newRoleDesc}
          onChange={(e) => setNewRoleDesc(e.target.value)}
        />
        <button onClick={addRole}>
          <FaPlus /> Add Role
        </button>
      </div>

  
      <table className="roles-table">
        <thead>
          <tr>
            <th>Idxno</th>
            <th>Role ID</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.idxno}>
              <td>{role.idxno}</td>
              <td>{role.roleId}</td>
              <td>
                {editingIdx === role.idxno ? (
                  <input
                    type="text"
                    value={editingDesc}
                    onChange={(e) => setEditingDesc(e.target.value)}
                  />
                ) : (
                  role.roleDescription
                )}
              </td>
              <td>
                {editingIdx === role.idxno ? (
                  <button onClick={() => saveEdit(role.idxno)}>Save</button>
                ) : (
                  <button onClick={() => startEdit(role)}>
                    <FaEdit /> Edit
                  </button>
                )}
                <button className="delete-btn" onClick={() => deleteRole(role.idxno)}>
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan={4} className="empty">
                No roles available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
