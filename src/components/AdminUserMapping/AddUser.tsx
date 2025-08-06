import React, { useState, useEffect } from "react";
import "./AddUser.css";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  role: string;
}

export default function AddUser() {
  const [users, setUsers] = useState<User[]>([]);
  const [newUser, setNewUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    username: "",
    password: "",
    role: "",
  });


  useEffect(() => {
    const mockUsers: User[] = [
      { id: 1, fullName: "John Admin", email: "john@portal.com", phone: "+254700000001", username: "johnA", role: "Admin" },
      { id: 2, fullName: "Jane User", email: "jane@portal.com", phone: "+254700000002", username: "janeU", role: "User" },
    ];
    setUsers(mockUsers);
  }, []);

 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewUser((prev) => ({ ...prev, [name]: value }));
  };


  const handleAddUser = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const newEntry: User = {
      id: users.length + 1,
      fullName: newUser.fullName,
      email: newUser.email,
      phone: newUser.phone,
      username: newUser.username,
      role: newUser.role === "01" ? "Admin" : "User",
    };

    setUsers((prev) => [...prev, newEntry]);

    setNewUser({
      fullName: "",
      email: "",
      phone: "",
      username: "",
      password: "",
      role: "",
    });

    alert("✅ User added successfully!");
  };

  return (
    <div className="add-user-container">
      <h1>Add New User</h1>
      <form className="add-user-form" onSubmit={handleAddUser}>
        <input name="fullName" type="text" placeholder="Full Name" value={newUser.fullName} onChange={handleChange} required />
        <input name="email" type="email" placeholder="Email" value={newUser.email} onChange={handleChange} required />
        <input name="phone" type="text" placeholder="Phone Number" value={newUser.phone} onChange={handleChange} required />
        <input name="username" type="text" placeholder="Username" value={newUser.username} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={newUser.password} onChange={handleChange} required />
        <select name="role" value={newUser.role} onChange={handleChange} required>
          <option value="">Select Role</option>
          <option value="01">Admin</option>
          <option value="02">User</option>
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
            <th>Phone</th>
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
              <td>{u.phone}</td>
              <td>{u.username}</td>
              <td>{u.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
