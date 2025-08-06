import React, { useState } from "react";
import "./MenuRoleMapping.css";

interface Menu {
  id: string;
  name: string;
}

interface Role {
  id: string;
  name: string;
}

interface Mapping {
  menuName: string;
  roles: string[];
}

export default function MenuRoleMapping() {
  const [menus] = useState<Menu[]>([
    { id: "MENU1", name: "Loan Applications" },
    { id: "MENU2", name: "Roles Management" },
    { id: "MENU3", name: "Menu Role Mappings" },
    { id: "MENU4", name: "Admin User Mappings" },
  ]);

  const [roles] = useState<Role[]>([
    { id: "ADMIN", name: "Administrator" },
    { id: "USER", name: "User" },
    { id: "CHECKER", name: "Checker" },
  ]);

  const [selectedMenu, setSelectedMenu] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Mapping[]>([]);

  const toggleRole = (roleId: string) => {
    setSelectedRoles((prev) =>
      prev.includes(roleId)
        ? prev.filter((r) => r !== roleId)
        : [...prev, roleId]
    );
  };

  const assignRoles = () => {
    if (!selectedMenu || selectedRoles.length === 0) {
      alert("Please select a menu and at least one role.");
      return;
    }

    const menuName = menus.find((m) => m.id === selectedMenu)?.name || "";

    const newMapping: Mapping = {
      menuName,
      roles: selectedRoles.map(
        (roleId) => roles.find((r) => r.id === roleId)?.name || ""
      ),
    };

    setMappings([...mappings, newMapping]);

    setSelectedMenu(null);
    setSelectedRoles([]);
  };

  return (
    <div className="menu-role-mapping-container">
      <h2>Menu Role Mapping</h2>

      <div className="dropdowns-section">
    
        <div className="dropdown">
          <h3>Select Menu</h3>
          <select
            value={selectedMenu || ""}
            onChange={(e) => setSelectedMenu(e.target.value || null)}
          >
            <option value="">-- Select Menu --</option>
            {menus.map((menu) => (
              <option key={menu.id} value={menu.id}>
                {menu.name}
              </option>
            ))}
          </select>
        </div>

   
        <div className="dropdown">
          <h3>Select Roles</h3>
          <div className="checkbox-list">
            {roles.map((role) => (
              <label key={role.id}>
                <input
                  type="checkbox"
                  checked={selectedRoles.includes(role.id)}
                  onChange={() => toggleRole(role.id)}
                />
                {role.name}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className="assign-btn" onClick={assignRoles}>
        Assign Roles to Menu
      </button>

      <table className="mapping-table">
        <thead>
          <tr>
            <th>Menu</th>
            <th>Roles Assigned</th>
          </tr>
        </thead>
        <tbody>
          {mappings.map((mapping, index) => (
            <tr key={index}>
              <td>{mapping.menuName}</td>
              <td>{mapping.roles.join(", ")}</td>
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
