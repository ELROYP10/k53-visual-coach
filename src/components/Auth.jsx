import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Auth({ onClose }) {
  const [mode, setMode] = useState(() =>
    new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"
      ? "recovery"
      : "signup"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (isMounted) {
        setUser(session?.user ?? null);

        if (event === "PASSWORD_RECOVERY") {
          setMode("recovery");
          setMessage("");
        }
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
      if (mode === "forgot") {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/`,
        });

        if (error) throw error;

        setMessage(
          "If an account exists for this email, a secure password-reset link has been sent."
        );
      } else if (mode === "recovery") {
        if (password !== confirmPassword) {
          throw new Error("The passwords do not match.");
        }

        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;

        await supabase.auth.signOut();
        window.history.replaceState({}, "", window.location.pathname);
        setUser(null);
        setPassword("");
        setConfirmPassword("");
        setMode("signin");
        setMessage("Password updated securely. Sign in with your new password.");
      } else if (mode === "signup") {
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


  const oneScreenStyles = (
    <style>{`
      .auth-overlay {
        position: fixed;
        inset: 0;
        z-index: 100;
        display: grid;
        place-items: center;
        padding: 18px;
        box-sizing: border-box;
        overflow: hidden;
        background:
          radial-gradient(circle at 20% 20%, rgba(41, 199, 126, .12), transparent 34%),
          linear-gradient(135deg, rgba(3, 18, 25, .98), rgba(5, 42, 31, .98));
        font-family: Inter, "Segoe UI", sans-serif;
      }

      .auth-card {
        position: relative;
        width: min(460px, calc(100vw - 36px));
        max-height: calc(100vh - 36px);
        overflow: hidden;
        box-sizing: border-box;
        padding: 28px 30px 24px;
        border: 1px solid rgba(110, 231, 183, .24);
        border-radius: 22px;
        background: rgba(7, 28, 28, .94);
        box-shadow: 0 28px 70px rgba(0, 0, 0, .38);
        color: #f4fff9;
      }

      .auth-card::before {
        content: "";
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        height: 4px;
        background: linear-gradient(90deg, #22c55e, #6ee7b7);
      }

      .auth-close {
        position: absolute;
        top: 14px;
        right: 14px;
        width: 34px;
        height: 34px;
        border-radius: 10px;
        border: 1px solid rgba(148, 216, 185, .2);
        background: rgba(255,255,255,.04);
        color: #dff7eb;
        font-size: 1.3rem;
        cursor: pointer;
      }

      .auth-card .eyebrow {
        margin: 0 44px 8px 0;
        color: #6ee7b7;
        font-size: .7rem;
        font-weight: 800;
        letter-spacing: .13em;
      }

      .auth-card h2 {
        margin: 0 0 8px;
        font-size: clamp(1.8rem, 4vw, 2.35rem);
        letter-spacing: -.04em;
        color: #f8fffb;
      }

      .auth-subtitle {
        margin: 0 0 18px;
        color: #b9d9cd;
        line-height: 1.45;
        font-size: .92rem;
      }

      .auth-email {
        margin: 0 0 20px;
        padding: 12px 14px;
        border: 1px solid rgba(110, 231, 183, .18);
        border-radius: 12px;
        background: rgba(255,255,255,.035);
        color: #eafff4;
        word-break: break-word;
      }

      .auth-form {
        display: grid;
        gap: 13px;
      }

      .auth-form label {
        display: grid;
        gap: 6px;
        color: #d8eee5;
        font-size: .78rem;
        font-weight: 800;
        letter-spacing: .03em;
      }

      .auth-form input {
        width: 100%;
        box-sizing: border-box;
        border: 1px solid rgba(148, 216, 185, .24);
        border-radius: 12px;
        padding: 12px 13px;
        background: rgba(2, 15, 23, .58);
        color: #f4fff9;
        outline: none;
        font: inherit;
      }

      .auth-form input:focus {
        border-color: #6ee7b7;
        box-shadow: 0 0 0 3px rgba(110, 231, 183, .09);
      }

      .auth-card .primary-btn {
        width: 100%;
        border: 0;
        border-radius: 12px;
        padding: 12px 16px;
        margin-top: 2px;
        background: linear-gradient(135deg, #32c98b, #18885e);
        color: white;
        font-weight: 800;
        cursor: pointer;
        box-shadow: 0 12px 24px rgba(34, 197, 94, .16);
      }

      .auth-card .primary-btn:disabled,
      .auth-switch:disabled {
        opacity: .6;
        cursor: wait;
      }

      .auth-switch {
        width: 100%;
        margin-top: 12px;
        border: 0;
        background: transparent;
        color: #8ee8bd;
        font-weight: 750;
        cursor: pointer;
        padding: 7px;
      }

      .auth-message {
        margin-top: 12px;
        padding: 9px 11px;
        border-radius: 10px;
        border: 1px solid rgba(110, 231, 183, .18);
        background: rgba(110, 231, 183, .07);
        color: #dff7eb;
        font-size: .8rem;
        line-height: 1.35;
      }

      @media (max-height: 600px) and (min-width: 600px) {
        .auth-card { padding: 20px 24px 18px; }
        .auth-card h2 { font-size: 1.65rem; }
        .auth-subtitle { margin-bottom: 11px; }
        .auth-form { gap: 9px; }
        .auth-form input { padding: 9px 11px; }
        .auth-card .primary-btn { padding: 10px 14px; }
        .auth-switch { margin-top: 7px; padding: 5px; }
      }
    `}</style>
  );

  if (user && mode !== "recovery") {
    return (
      <>
        {oneScreenStyles}
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
      </>
    );
  }

  return (
    <>
      {oneScreenStyles}
      <div className="auth-overlay">
      <div className="auth-card">
        <button className="auth-close" onClick={onClose}>
          ×
        </button>

        <p className="eyebrow">K53 VISUAL COACH ACCOUNT</p>

        <h2>
          {mode === "signup"
            ? "Create your account"
            : mode === "forgot"
              ? "Reset your password"
              : mode === "recovery"
                ? "Create new password"
                : "Welcome back"}
        </h2>

        <p className="auth-subtitle">
          {mode === "signup"
            ? "Save your results, track weak areas and build your exam readiness score."
            : mode === "forgot"
              ? "Enter your account email and we will send you a secure reset link."
              : mode === "recovery"
                ? "Choose a strong new password for your K53 Visual Coach account."
                : "Sign in to continue your K53 training."}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode !== "recovery" && (
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
            </label>
          )}

          {mode !== "forgot" && (
            <label>
              {mode === "recovery" ? "New password" : "Password"}
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 8 characters"
                minLength={8}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
                required
              />
            </label>
          )}

          {mode === "recovery" && (
            <label>
              Confirm new password
              <input
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter the new password again"
                minLength={8}
                autoComplete="new-password"
                required
              />
            </label>
          )}

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading
              ? "Please wait..."
              : mode === "signup"
                ? "Create Account"
                : mode === "forgot"
                  ? "Send Reset Link"
                  : mode === "recovery"
                    ? "Update Password"
                    : "Sign In"}
          </button>
        </form>

        {message && <div className="auth-message">{message}</div>}

        {mode === "signin" && (
          <button
            className="auth-switch"
            type="button"
            onClick={() => {
              setMode("forgot");
              setPassword("");
              setMessage("");
            }}
          >
            Forgot password?
          </button>
        )}

        {mode !== "recovery" && (
          <button
            className="auth-switch"
            type="button"
            onClick={() => {
              setMode(mode === "signup" ? "signin" : "signup");
              setPassword("");
              setMessage("");
            }}
          >
            {mode === "signup"
              ? "Already have an account? Sign in"
              : mode === "forgot"
                ? "Back to sign in"
                : "Need an account? Create one"}
          </button>
        )}
      </div>
    </div>
    </>
  );
}
