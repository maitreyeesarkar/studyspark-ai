
import { useState } from "react";
import { supabase } from "./lib/supabase";
import "./Auth.css";

export default function Auth() {
  const [mode, setMode] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name.trim() },
            emailRedirectTo: window.location.origin,
          },
        });

        if (error) throw error;

        if (data.session) {
          setMessage("Account created! You can now access StudySpark.");
        } else {
          setMessage(
            "Account created! Please check your email and click the verification link before signing in."
          );
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        // App.jsx will detect the successful login.
      }
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <div className="auth-brand">
          <div className="auth-logo">S✦</div>
          <h1>StudySpark AI</h1>
          <p>Your personal AI learning companion</p>
        </div>

        <div className="auth-heading">
          <h2>
            {mode === "login" ? "Welcome back! ✨" : "Create your account"}
          </h2>
          <p>
            {mode === "login"
              ? "Continue your learning journey."
              : "Start learning smarter, one step at a time."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === "signup" && (
            <label className="auth-field">
              Full name
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                autoComplete="name"
                required
              />
            </label>
          )}

          <label className="auth-field">
            Email address
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </label>

          <label className="auth-field">
            Password
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
              minLength={8}
              required
            />
          </label>

          {error && <p className="auth-error">{error}</p>}
          {message && <p className="auth-message">{message}</p>}

          <button className="auth-submit" type="submit" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "login"
                ? "Sign In →"
                : "Create Account →"}
          </button>
        </form>

        <p className="auth-switch">
          {mode === "login"
            ? "New to StudySpark? "
            : "Already have an account? "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "signup" : "login");
              setMessage("");
              setError("");
            }}
          >
            {mode === "login" ? "Sign Up" : "Sign In"}
          </button>
        </p>

        <p className="auth-footer">Made for curious minds ♡</p>
      </section>
    </main>
  );
}
