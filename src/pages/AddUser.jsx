import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AddUser() {
  // 🔐 Logged-in user role (from backend)
  const [currentRole, setCurrentRole] = useState(
    (localStorage.getItem("role") || "master").toLowerCase()
  );

  // 🔧 FIX: read username ONCE
  const username = localStorage.getItem("username");

  // 🔧 FIX: session guard (prevents silent forbidden)
  if (!username) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Session expired. Please login again.
      </div>
    );
  }

  // ================= ADD USER STATE =================
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    role: "",
    is_active: true,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const roleOptions =
    currentRole === "master"
      ? ["master", "admin", "viewer"]
      : ["admin", "viewer"];

  useEffect(() => {
    setForm((f) => ({ ...f, role: roleOptions[0] }));
  }, [currentRole]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // ================= CREATE USER =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!form.username || !form.password) {
      setError("All fields are required");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://localhost:8000/users/create", {
        username: form.username,
        password: form.password,
        role: form.role.toLowerCase(),
        is_active: form.is_active,
        created_by: username, // 🔧 FIX
      });

      setSuccess("User created successfully");
      fetchUsers();

      setForm({
        username: "",
        password: "",
        confirmPassword: "",
        role: roleOptions[0],
        is_active: true,
      });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // ================= USER LIST STATE =================
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editRole, setEditRole] = useState("");
  const [editActive, setEditActive] = useState(true);

  // 🔍 FILTER STATE
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/users");
    setUsers(res.data);
  };

  useEffect(() => {
    if (showUsers) fetchUsers();
  }, [showUsers]);

  // ================= DELETE USER =================
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;

    try {
      await axios.delete(`http://localhost:8000/users/${id}`, {
        params: {
          editor_username: username, // 🔧 FIX: ensure master is allowed by backend
        },
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to delete user");
    }
  };

  // ================= SAVE EDIT =================
  const saveEdit = async (id) => {
    try {
      await axios.put(
        `http://localhost:8000/users/${id}`,
        {
          role: editRole.toLowerCase(),
          is_active: editActive,
        },
        {
          params: {
            editor_username: username, // 🔧 FIX
          },
        }
      );

      setEditingUserId(null);
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.detail || "Failed to save changes");
    }
  };

  // 🔍 APPLY FILTERS
  const filteredUsers = users.filter((u) => {
    if (roleFilter !== "ALL" && u.role !== roleFilter.toLowerCase()) return false;
    if (
      statusFilter !== "ALL" &&
      (statusFilter === "ACTIVE") !== Boolean(u.is_active)
    )
      return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      {/* ================= ADD USER FORM ================= */}
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-semibold text-gray-800">Add New User</h2>
          <p className="text-sm text-gray-500 mt-1">
            Create Master, Admin, or Viewer accounts
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 rounded-lg bg-green-100 text-green-700 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            placeholder="Username / Email"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          >
            {roleOptions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
            />
            Active user
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>

        <button
          onClick={() => setShowUsers(!showUsers)}
          className="mt-6 w-full py-2 rounded-lg border border-blue-600 text-blue-600 font-semibold hover:bg-blue-50"
        >
          {showUsers ? "Hide Users List" : "Show Users List"}
        </button>
      </div>

      {/* ================= USER TABLE ================= */}
      {showUsers && (
        <div className="max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow p-6 overflow-x-auto">
          <h3 className="text-xl font-semibold mb-4">Users List</h3>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="p-2 border"></th>
                <th className="p-2 border">
                  <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="ALL">All Roles</option>
                    {roleOptions.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </th>
                <th className="p-2 border">
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="ALL">All Status</option>
                    <option value="ACTIVE">Active</option>
                    <option value="INACTIVE">Inactive</option>
                  </select>
                </th>
                <th className="p-2 border"></th>
              </tr>

              <tr className="bg-gray-100 text-sm text-gray-600">
                <th className="p-3 border text-left">Username</th>
                <th className="p-3 border text-left">Role</th>
                <th className="p-3 border text-left">Status</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3 border font-medium">{u.username}</td>

                  <td className="p-3 border">
                    {editingUserId === u.id ? (
                      <select
                        value={editRole}
                        onChange={(e) => setEditRole(e.target.value)}
                        className="border px-2 py-1 rounded"
                      >
                        {roleOptions.map((r) => (
                          <option key={r} value={r}>
                            {r}
                          </option>
                        ))}
                      </select>
                    ) : (
                      u.role
                    )}
                  </td>

                  <td className="p-3 border">
                    {editingUserId === u.id ? (
                      <input
                        type="checkbox"
                        checked={editActive}
                        onChange={(e) => setEditActive(e.target.checked)}
                      />
                    ) : (
                      <span
                        className={`px-2 py-1 rounded text-xs font-semibold ${
                          u.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {u.is_active ? "Active" : "Inactive"}
                      </span>
                    )}
                  </td>

                  <td className="p-3 border text-center">
                    {editingUserId === u.id ? (
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => saveEdit(u.id)}
                          className="text-blue-600 font-semibold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingUserId(null)}
                          className="text-gray-500"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : currentRole === "master" ? (
                      <div className="flex justify-center gap-4">
                        <button
                          onClick={() => {
                            setEditingUserId(u.id);
                            setEditRole(u.role);
                            setEditActive(u.is_active);
                          }}
                          className="text-blue-600 font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteUser(u.id)}
                          className="text-red-600 font-semibold"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-400">No Actions</span>
                    )}
                  </td>
                </tr>
              ))}

              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center p-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
