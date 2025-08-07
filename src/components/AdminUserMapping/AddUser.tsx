import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AddUser.css";

interface RawUser {
  idxno: number;
  fullName: string;
  email: string;
  username: string;
  roleid: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  username: string;
  role: string;
}

export default function AddUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get<RawUser[]>("http://localhost:8080/api/users/all");

      const formattedUsers: User[] = res.data.map((u) => ({
        id: u.idxno,
        fullName: u.fullName,
        email: u.email,
        username: u.username,
        role: u.roleid === "01" ? "Admin" : u.roleid === "02" ? "User" : "Unknown",
      }));

      setUsers(formattedUsers);
    } catch (err) {
      console.error("❌ Failed to fetch users:", err);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const roleid = newUser.role === "Admin" ? "01" : "02";

      await axios.post("http://localhost:8080/api/users/register", {
        fullName: newUser.fullName,
        email: newUser.email,
        username: newUser.username,
        password: newUser.password,
        roleid: roleid,
      });

      alert("✅ User added successfully!");
      setNewUser({
        fullName: "",
        email: "",
        username: "",
        password: "",
        role: "",
      });
      setShowPassword(false);
      fetchUsers();
    } catch (err) {
      console.error("❌ Failed to add user:", err);
      alert("⚠️ Failed to add user.");
    }
  };

  return (
    <div className="add-user-container">
      <h1>Add New User</h1>
      <form className="add-user-form" onSubmit={handleAddUser}>
        <input
          name="fullName"
          type="text"
          placeholder="Full Name"
          value={newUser.fullName}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={handleChange}
          required
        />
        <input
          name="username"
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={newUser.password}
            onChange={handleChange}
            required
          />
          <span
            className="toggle-password"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <select
          name="role"
          value={newUser.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>

        <button type="submit">Add User</button>
      </form>

      <h2>Existing Users</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.fullName}</td>
              <td>{u.email}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
