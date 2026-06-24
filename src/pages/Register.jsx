import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUsers, createUser } from "../services/api";
import { generateId } from "../utils/helpers";
import toast from "react-hot-toast";

const ADMIN_INVITE_CODE = "P2PADMIN2026";

function PasswordInput({ placeholder, value, onChange }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: "relative" }}>
      <input
        className="form-control"
        type={show ? "text" : "password"}
        required
        placeholder={placeholder}
        style={{ paddingRight: "3rem" }}
        value={value}
        onChange={onChange}
      />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        style={{
          position: "absolute",
          right: ".75rem",
          top: "50%",
          transform: "translateY(-50%)",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "1.1rem",
          color: "var(--text-muted)",
          lineHeight: 1,
        }}
      >
        {show ? "🙈" : "👁️"}
      </button>
    </div>
  );
}

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [showCode, setShowCode] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleRoleChange = (selected) => {
    setRole(selected);
    setInviteCode("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    if (role === "admin" && inviteCode !== ADMIN_INVITE_CODE) {
      toast.error("Invalid admin invite code");
      return;
    }
    setLoading(true);
    try {
      const { data: accounts } = await getUsers();
      if (accounts.find((u) => u.email === email)) {
        toast.error("Email already registered");
        setLoading(false);
        return;
      }
      const newUser = {
        id: generateId(),
        name,
        email,
        password,
        role,
        avatar: "",
        joinedAt: new Date().toISOString().split("T")[0],
        bio: "",
      };
      await createUser(newUser);
      login(newUser);
      toast.success(
        `${role === "admin" ? "Admin" : "Student"} account created!`,
      );
      navigate(role === "admin" ? "/admin" : "/");
    } catch {
      toast.error("Server error. Run: npm run dev");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card auth-card">
        <h2>Create Account</h2>
        <p>Join P2P Arena and start learning</p>

        <form onSubmit={handleSubmit}>
          {/* Role Selector */}
          <div className="form-group">
            <label>I am a</label>
            <div style={{ display: "flex", gap: ".75rem" }}>
              {[
                { value: "student", icon: "🎓", label: "Student" },
                { value: "admin", icon: "⚡", label: "Admin" },
              ].map(({ value, icon, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleRoleChange(value)}
                  style={{
                    flex: 1,
                    padding: ".75rem",
                    borderRadius: "var(--radius)",
                    border: `2px solid ${role === value ? "var(--primary)" : "var(--border)"}`,
                    background: role === value ? "#eff6ff" : "transparent",
                    color:
                      role === value ? "var(--primary)" : "var(--text-muted)",
                    fontWeight: 700,
                    fontSize: ".95rem",
                    cursor: "pointer",
                    transition: "all .2s",
                  }}
                >
                  {icon} {label}
                </button>
              ))}
            </div>
            <p
              style={{
                fontSize: ".8rem",
                color: "var(--text-muted)",
                marginTop: ".5rem",
              }}
            >
              {role === "student"
                ? "🎓 Students can browse papers, take quizzes and track progress."
                : "⚡ Admins can upload papers, manage quizzes and view feedback."}
            </p>
          </div>

          {/* Admin Invite Code — only shown when Admin is selected */}
          {role === "admin" && (
            <div className="form-group">
              <label>Admin Invite Code</label>
              <div style={{ position: "relative" }}>
                <input
                  className="form-control"
                  type={showCode ? "text" : "password"}
                  required
                  placeholder="Enter invite code"
                  style={{ paddingRight: "3rem" }}
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowCode((s) => !s)}
                  style={{
                    position: "absolute",
                    right: ".75rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "1.1rem",
                    color: "var(--text-muted)",
                    lineHeight: 1,
                  }}
                >
                  {showCode ? "🙈" : "👁️"}
                </button>
              </div>
              <p
                style={{
                  fontSize: ".78rem",
                  color: "var(--accent)",
                  marginTop: ".35rem",
                }}
              >
                ⚠️ You need an invite code from an existing admin to create an
                admin account.
              </p>
            </div>
          )}

          <div className="form-group">
            <label>Full Name</label>
            <input
              className="form-control"
              type="text"
              required
              placeholder="Your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              type="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <PasswordInput
              placeholder="Min. 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <PasswordInput
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%" }}
            disabled={loading}
          >
            {loading
              ? "Creating..."
              : `Create ${role === "admin" ? "Admin" : "Student"} Account`}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
