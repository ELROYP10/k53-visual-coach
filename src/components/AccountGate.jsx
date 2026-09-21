import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function AccountGate({
  user,
  onUpgrade = () => {},
  onBack = () => {},
}) {
  const [signingOut, setSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      setSignOutError("");
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      window.location.href = "/";
    } catch (error) {
      setSignOutError(error.message || "Unable to log out. Please try again.");
      setSigningOut(false);
    }
  };

  return (
    <main className="account-gate">
      <style>{`
        .account-gate {
          min-height: 100vh;
          box-sizing: border-box;
          display: grid;
          place-items: center;
          padding: 24px;
          background:
            radial-gradient(circle at top right, rgba(34,197,94,.14), transparent 34%),
            linear-gradient(180deg, #07131f 0%, #081c18 100%);
          color: #f8fafc;
          font-family: Inter, "Segoe UI", sans-serif;
        }

        .account-gate-card {
          width: min(520px, 100%);
          padding: clamp(26px, 5vw, 42px);
          border: 1px solid rgba(134,239,172,.24);
          border-radius: 24px;
          background: rgba(8, 28, 24, .92);
          box-shadow: 0 24px 70px rgba(0,0,0,.34);
        }

        .account-gate-badge {
          display: inline-block;
          margin-bottom: 18px;
          padding: 7px 11px;
          border: 1px solid rgba(148,163,184,.24);
          border-radius: 999px;
          color: #cbd5e1;
          font-size: .76rem;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .account-gate h1 {
          margin: 0 0 12px;
          font-size: clamp(2rem, 6vw, 3rem);
          line-height: 1.05;
        }

        .account-gate p {
          margin: 0;
          color: #cbd5e1;
          line-height: 1.65;
        }

        .account-gate-email {
          margin-top: 16px !important;
          padding: 12px 14px;
          border-radius: 12px;
          background: rgba(15,23,42,.55);
          word-break: break-word;
        }

        .account-gate-actions {
          display: grid;
          gap: 12px;
          margin-top: 26px;
        }

        .account-gate button {
          min-height: 48px;
          border-radius: 12px;
          padding: 12px 18px;
          font-weight: 800;
          cursor: pointer;
        }

        .account-upgrade {
          border: 0;
          background: #22c55e;
          color: #052e16;
        }

        .account-back {
          border: 1px solid rgba(148,163,184,.28);
          background: transparent;
          color: #e2e8f0;
        }

        .account-signout {
          border: 0;
          background: transparent;
          color: #fca5a5;
        }

        .account-gate button:disabled {
          cursor: wait;
          opacity: .6;
        }

        .account-gate-error {
          margin-top: 14px !important;
          color: #fecaca !important;
        }
      `}</style>

      <section className="account-gate-card" aria-labelledby="account-gate-title">
        <span className="account-gate-badge">Free account</span>
        <h1 id="account-gate-title">Unlock your full learning dashboard</h1>
        <p>
          Premium includes saved test history, readiness analytics,
          weak-area practice and smart mistake practice. Choose 30 or 90 days.
        </p>
        <p className="account-gate-email">{user?.email}</p>

        <div className="account-gate-actions">
          <button type="button" className="account-upgrade" onClick={onUpgrade}>
            View Premium plans — from R79
          </button>
          <button type="button" className="account-back" onClick={onBack}>
            Return to home
          </button>
          <button
            type="button"
            className="account-signout"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? "Signing out…" : "Sign out"}
          </button>
        </div>

        {signOutError && (
          <p className="account-gate-error" role="alert">
            {signOutError}
          </p>
        )}
      </section>
    </main>
  );
}
