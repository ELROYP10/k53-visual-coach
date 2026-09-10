import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth({ onClose }) {
  const [mode, setMode] = useState("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const getCurrentUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (isMounted) {
        setUser(session?.user ?? null);
      }
    };

    getCurrentUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });

        if (error) throw error;

        setMessage(
          "Account created. Check your email and confirm your address before signing in."
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        setMessage("Signed in successfully.");
      }
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    setMessage("");

    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <div className="auth-overlay">
        <div className="auth-card">
          <button className="auth-close" onClick={onClose}>
            ×
          </button>

          <p className="eyebrow">K53 VISUAL COACH ACCOUNT</p>
          <h2>Account</h2>
          <p className="auth-subtitle">Signed in as:</p>
          <p className="auth-email">{user.email}</p>

          <button type="button" className="primary-btn" onClick={onClose}>
            Continue to K53 Visual Coach
          </button>

          <button
            type="button"
            className="auth-switch"
            onClick={handleSignOut}
            disabled={loading}
          >
            {loading ? "Please wait..." : "Sign Out"}
          </button>

          {message && <div className="auth-message">{message}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <p className="eyebrow">K53 VISUAL COACH ACCOUNT</p>

        <h2>{mode === "signup" ? "Create your account" : "Welcome back"}</h2>

        <p className="auth-subtitle">
          {mode === "signup"
            ? "Save your results, track weak areas and build your exam readiness score."
            : "Sign in to continue your K53 training."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Minimum 6 characters"
              minLength={6}
              required
            />
          </label>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : "Sign In"}
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        <button
          className="auth-switch"
          type="button"
          onClick={() => {
            setMode(mode === "signup" ? "signin" : "signup");
            setMessage("");
          }}
        >
          {mode === "signup"
            ? "Already have an account? Sign in"
            : "Need an account? Create one"}
        </button>
      </div>
    </div>
  );
}