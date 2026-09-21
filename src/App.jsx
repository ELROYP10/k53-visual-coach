import { useEffect, useState } from "react";
import "./App.css";
import K53Test from "./components/K53Test";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import AccountGate from "./components/AccountGate";
import MistakePractice from "./components/MistakePractice";
import LegalCenter from "./components/LegalCenter";
import Pricing from "./components/Pricing";
import { supabase } from "./lib/supabase";
import { trackEvent } from "./lib/analytics";

const LEGAL_PAGES = ["privacy", "terms", "refunds", "contact"];

const LICENCE_CATEGORIES = [
  { code: "CODE_1", short: "Code 1", title: "Motorcycle", detail: "Motorcycle with or without a sidecar, motor tricycle or quadrucycle" },
  { code: "CODE_2", short: "Code 2", title: "Motor vehicle up to 3,500 kg", detail: "Motor vehicle, minibus, bus or goods vehicle with GVM not exceeding 3,500 kg" },
  { code: "CODE_3", short: "Code 3", title: "Motor vehicle over 3,500 kg", detail: "Motor vehicle with GVM exceeding 3,500 kg" },
];

const getLegalPage = () => {
  const page = window.location.hash.slice(1);
  return LEGAL_PAGES.includes(page) ? page : null;
};

function App() {
  const [showTest, setShowTest] = useState(false);
  const [showMistakePractice, setShowMistakePractice] = useState(false);
  const [showAuth, setShowAuth] = useState(() =>
    new URLSearchParams(window.location.hash.slice(1)).get("type") === "recovery"
  );
  const [showDashboard, setShowDashboard] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [focusCategory, setFocusCategory] = useState(null);
  const [focusMistakes, setFocusMistakes] = useState([]);
  const [mistakePracticeTexts, setMistakePracticeTexts] = useState([]);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentNotice, setPaymentNotice] = useState(null);
  const [legalPage, setLegalPage] = useState(getLegalPage);
  const [licenceCode, setLicenceCode] = useState(() =>
    window.localStorage.getItem("k53_licence_code") || "CODE_2"
  );
  const [showLicencePicker, setShowLicencePicker] = useState(false);

  useEffect(() => {
    const syncLegalPage = () => setLegalPage(getLegalPage());
    window.addEventListener("hashchange", syncLegalPage);
    return () => window.removeEventListener("hashchange", syncLegalPage);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);

        if (event === "PASSWORD_RECOVERY") {
          setShowAuth(true);
          setShowDashboard(false);
          setShowTest(false);
          setShowMistakePractice(false);
        }
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);


  useEffect(() => {
    let cancelled = false;

    const loadProfile = async () => {
      if (!user) {
        if (!cancelled) {
          setProfile(null);
          setProfileLoading(false);
        }
        return;
      }

      setProfileLoading(true);

      const { data: existing, error: readError } = await supabase
        .from("user_profiles")
        .select("user_id,plan,premium_until,payment_reference,created_at,updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      if (readError) {
        console.error("Could not load user profile:", readError);
        setProfile(null);
        setProfileLoading(false);
        return;
      }

      if (existing) {
        setProfile(existing);
        setProfileLoading(false);
        return;
      }

      const { data: created, error: createError } = await supabase
        .from("user_profiles")
        .insert({ user_id: user.id })
        .select("user_id,plan,premium_until,payment_reference,created_at,updated_at")
        .single();

      if (cancelled) return;

      if (createError) {
        console.error("Could not create user profile:", createError);
        setProfile(null);
      } else {
        setProfile(created);
      }

      setProfileLoading(false);
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [user]);

  useEffect(() => {
    if (!user) return undefined;

    const paymentResult = new URLSearchParams(window.location.search).get("payment");

    if (!paymentResult) return undefined;

    if (paymentResult === "cancelled") {
      setPaymentNotice({
        type: "info",
        text: "Payment cancelled. No charge was completed.",
      });
      window.history.replaceState({}, "", window.location.pathname);
      return undefined;
    }

    if (paymentResult === "failed") {
      setPaymentNotice({
        type: "error",
        text: "Payment was not completed. Please try again when ready.",
      });
      window.history.replaceState({}, "", window.location.pathname);
      return undefined;
    }

    if (paymentResult !== "success") return undefined;

    let cancelled = false;
    let attempts = 0;
    let timeoutId;

    setPaymentNotice({
      type: "info",
      text: "Payment received. Securely verifying your access…",
    });

    const verifyAccess = async () => {
      const { data: refreshedProfile, error } = await supabase
        .from("user_profiles")
        .select("user_id,plan,premium_until,payment_reference,created_at,updated_at")
        .eq("user_id", user.id)
        .maybeSingle();

      if (cancelled) return;

      const paid =
        ["standard", "premium"].includes(refreshedProfile?.plan) &&
        (!refreshedProfile?.premium_until ||
          new Date(refreshedProfile.premium_until).getTime() > Date.now());

      if (!error && paid) {
        setProfile(refreshedProfile);
        trackEvent("purchase", {
          value: refreshedProfile.plan === "premium" ? 129 : 79,
          currency: "ZAR",
          items: [
            {
              item_id: refreshedProfile.plan,
              item_name: "K53 Visual Coach Full Access",
            },
          ],
        });
        setPaymentNotice({
          type: "success",
          text: "Payment verified. Full Access is now unlocked.",
        });
        window.history.replaceState({}, "", window.location.pathname);
        return;
      }

      attempts += 1;

      if (attempts >= 15) {
        setPaymentNotice({
          type: "info",
          text: "Your payment is still being verified. Refresh this page shortly.",
        });
        return;
      }

      timeoutId = window.setTimeout(verifyAccess, 2000);
    };

    verifyAccess();

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [user]);

  const hasPremiumAccess =
    ["standard", "premium"].includes(profile?.plan) &&
    (!profile?.premium_until || new Date(profile.premium_until).getTime() > Date.now());

  const startCheckout = async (planId) => {
    if (paymentLoading) return;

    setPaymentLoading(true);

    try {
      const { data, error: sessionError } = await supabase.auth.getSession();
      const accessToken = data.session?.access_token;

      if (sessionError || !accessToken) {
        setShowAuth(true);
        setShowDashboard(false);
        throw new Error("Please sign in again before purchasing.");
      }

      const checkoutResponse = await fetch("/api/create-checkout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan: planId }),
      });

      const checkout = await checkoutResponse.json();

      if (!checkoutResponse.ok || !checkout.redirectUrl) {
        throw new Error(checkout.error || "Unable to start checkout.");
      }

      trackEvent("begin_checkout", {
        value: planId === "premium" ? 129 : 79,
        currency: "ZAR",
        items: [
          {
            item_id: planId,
            item_name: planId === "premium" ? "K53 Premium 90" : "K53 Premium 30",
          },
        ],
      });
      window.location.assign(checkout.redirectUrl);
    } catch (error) {
      console.error("Could not start Yoco checkout:", error);
      window.alert(error.message || "Unable to start checkout. Please try again.");
      setPaymentLoading(false);
    }
  };

  const openFullAccess = () => {
    setShowPricing(true);
    setShowDashboard(false);
    setShowAuth(false);
  };

  const openLegalPage = (page) => {
    window.location.hash = page;
  };

  const closeLegalPage = () => {
    window.history.pushState(null, "", window.location.pathname + window.location.search);
    setLegalPage(null);
  };

  const startTest = (source, category = null) => {
    trackEvent("start_test", {
      source,
      test_type: category ? "weak_area" : "full_practice",
      licence_code: licenceCode,
      ...(category ? { category } : {}),
    });
    setFocusCategory(category);
    setFocusMistakes([]);
    setShowDashboard(false);
    setShowAuth(false);
    setShowTest(true);
  };

if (legalPage) {
  return (
    <LegalCenter
      page={legalPage}
      onNavigate={openLegalPage}
      onHome={closeLegalPage}
    />
  );
}

if (showPricing) {
  return (
    <Pricing
      user={user}
      hasActiveAccess={hasPremiumAccess}
      premiumUntil={profile?.premium_until}
      paymentLoading={paymentLoading}
      onChoosePlan={startCheckout}
      onSignIn={() => {
        setShowPricing(false);
        setShowAuth(true);
      }}
      onBack={() => setShowPricing(false)}
    />
  );
}

if (showDashboard && user && !hasPremiumAccess) {
  return (
    <AccountGate
      user={user}
      onUpgrade={() => {
        openFullAccess();
      }}
      onBack={() => setShowDashboard(false)}
    />
  );
}

if (showDashboard && user && hasPremiumAccess) {
  return (
    <Dashboard
      user={user}
      onStartTest={() => {
        startTest("dashboard");
      }}
      onPracticeWeakAreas={(weakestCategory) => {
        startTest("dashboard", weakestCategory);
      }}
      onPracticeMistakes={(mistakeQuestions) => {
        setFocusCategory(null);
        setFocusMistakes([]);
        setMistakePracticeTexts(mistakeQuestions || []);
        setShowDashboard(false);
        setShowAuth(false);
        setShowTest(false);
        setShowMistakePractice(true);
      }}
    />
  );
}

if (showAuth) {
  return <Auth onClose={() => setShowAuth(false)} />;
} 
if (showMistakePractice) {
  return (
    <MistakePractice
      mistakeTexts={mistakePracticeTexts}
      onExit={() => {
        setMistakePracticeTexts([]);
        setShowMistakePractice(false);
        setShowDashboard(true);
      }}
    />
  );
}
if (showTest) {
    return (
      <K53Test
        focusCategory={focusCategory}
        focusMistakes={focusMistakes}
        licenceCode={licenceCode}
        onExit={() => {
          setFocusCategory(null);
          setFocusMistakes([]);
          setShowTest(false);
        }}
      />
    );
  }

  const homeOneScreenStyles = `
    .app.k53-home-one-screen {
      height: 100vh;
      min-height: 0;
      overflow: hidden;
      box-sizing: border-box;
    }

    .k53-home-one-screen .navbar {
      height: 74px;
      min-height: 74px;
      box-sizing: border-box;
      padding-top: 0;
      padding-bottom: 0;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
    }

    .k53-home-one-screen .brand {
      justify-self: start;
    }

    .k53-home-one-screen .nav-auth-btn {
      justify-self: center;
    }

    .k53-home-one-screen .navButton {
      justify-self: end;
    }

    .k53-home-one-screen .hero {
      height: calc(100vh - 74px);
      min-height: 0;
      box-sizing: border-box;
      overflow: hidden;
      align-items: center;
      padding-top: 18px;
      padding-bottom: 18px;
      gap: clamp(28px, 5vw, 76px);
    }

    .k53-home-one-screen .heroContent,
    .k53-home-one-screen .scoreCard {
      min-width: 0;
    }

    .k53-home-one-screen .heroContent h1 {
      font-size: clamp(48px, 5.6vw, 78px);
      line-height: .96;
      margin-top: 14px;
      margin-bottom: 20px;
    }

    .k53-home-one-screen .eyebrow {
      margin-bottom: 0;
    }

    .k53-home-one-screen .description {
      max-width: 650px;
      margin-bottom: 18px;
      line-height: 1.55;
    }

    .k53-home-one-screen .buttons {
      margin-top: 0;
      margin-bottom: 12px;
    }

    .k53-home-one-screen .paymentNotice {
      max-width: 650px;
      margin: 12px 0 0;
      padding: 10px 12px;
      border: 1px solid #334155;
      border-radius: 10px;
      color: #cbd5e1;
      background: #0f172a;
      font-size: 14px;
    }

    .k53-home-one-screen .paymentNotice.success {
      border-color: #22c55e;
      color: #bbf7d0;
    }

    .k53-home-one-screen .paymentNotice.error {
      border-color: #ef4444;
      color: #fecaca;
    }

    .k53-home-one-screen .disclaimer {
      margin-top: 10px;
      margin-bottom: 0;
    }

    .k53-home-one-screen .scoreCard {
      padding: clamp(22px, 2.2vw, 32px);
      align-self: center;
    }

    .k53-home-one-screen .score {
      font-size: clamp(50px, 5vw, 68px);
      margin: 14px 0 22px;
    }

    .k53-home-one-screen .metric {
      margin-bottom: 18px;
    }

    .k53-home-one-screen .recommendation {
      margin-top: 18px;
      padding: 16px;
    }

    @media (max-height: 720px) and (min-width: 850px) {
      .k53-home-one-screen .navbar {
        height: 62px;
        min-height: 62px;
      }

      .k53-home-one-screen .hero {
        height: calc(100vh - 62px);
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .k53-home-one-screen .heroContent h1 {
        font-size: clamp(42px, 5vw, 66px);
        margin: 9px 0 14px;
      }

      .k53-home-one-screen .description {
        margin-bottom: 12px;
      }

      .k53-home-one-screen .scoreCard {
        padding: 20px 24px;
      }

      .k53-home-one-screen .score {
        margin: 8px 0 14px;
      }

      .k53-home-one-screen .metric {
        margin-bottom: 12px;
      }

      .k53-home-one-screen .recommendation {
        margin-top: 12px;
        padding: 12px 14px;
      }
    }

    @media (max-width: 849px) {
      .app.k53-home-one-screen {
        height: auto;
        min-height: 100vh;
        overflow: auto;
      }

      .k53-home-one-screen .navbar {
        height: auto;
        min-height: 70px;
      }

      .k53-home-one-screen .hero {
        height: auto;
        min-height: calc(100vh - 70px);
        overflow: visible;
      }
    }
  `;

  return (
    <div className="app k53-home-one-screen">
      <style>{homeOneScreenStyles}</style>
      {showLicencePicker && (
        <div className="licence-picker-backdrop" role="presentation">
          <section className="licence-picker" role="dialog" aria-modal="true" aria-labelledby="licence-picker-title">
            <button className="licence-picker-close" onClick={() => setShowLicencePicker(false)} aria-label="Close licence selection">×</button>
            <p className="licence-picker-eyebrow">CHOOSE YOUR LEARNER'S LICENCE</p>
            <h2 id="licence-picker-title">Which vehicle category are you preparing for?</h2>
            <p className="licence-picker-copy">Your selection is saved on this device and shown throughout your practice session.</p>
            <div className="licence-picker-options">
              {LICENCE_CATEGORIES.map((item) => (
                <button
                  key={item.code}
                  className={`licence-option${licenceCode === item.code ? " selected" : ""}`}
                  onClick={() => {
                    setLicenceCode(item.code);
                    window.localStorage.setItem("k53_licence_code", item.code);
                    trackEvent("select_licence_code", { licence_code: item.code });
                    setShowLicencePicker(false);
                  }}
                >
                  <span className="licence-option-code">{item.short}</span>
                  <strong>{item.title}</strong>
                  <span>{item.detail}</span>
                </button>
              ))}
            </div>
            <p className="licence-picker-note">Rules of the Road and road signs are shared. Category-specific vehicle-control banks are being verified before release.</p>
          </section>
        </div>
      )}
      <nav className="navbar">
        <div className="brand">
          🚦 <span>K53 Visual Coach</span>
        </div>
<button
  className="nav-auth-btn"
  onClick={() => {
    if (user) {
      setShowDashboard(true);
      setShowAuth(false);
      return;
    }

    setShowAuth(true);
    setShowDashboard(false);
  }}
>
  {user ? (profileLoading ? "My Account" : `My Account · ${hasPremiumAccess ? "Premium" : "Free"}`) : "Sign Up / Log In"}
</button>
        <button
          className="navButton"
          onClick={() => startTest("navigation")}
        >
          Start Free Test
        </button>
      </nav>

      <main className="hero">
        <div className="heroContent">
          <p className="eyebrow">
            SOUTH AFRICAN LEARNER TEST PREPARATION
          </p>

          <h1>
            See it.
            <br />
            Learn it.
            <br />
            Practise it.
            <br />
            <span>Pass it.</span>
          </h1>

          <p className="description">
            Prepare for your learner's licence with visual road-sign
            training, Rules of the Road, Vehicle Controls and realistic
            K53-style mock tests.
          </p>

          <div className="buttons">
            <button
              className="primaryButton"
              onClick={() => startTest("hero")}
            >
              Start Free Test
            </button>

            <button
              className="secondaryButton"
              onClick={openFullAccess}
              disabled={paymentLoading}
            >
              {hasPremiumAccess
                ? "Full Access Unlocked"
                : paymentLoading
                  ? "Opening secure checkout..."
                  : "View Full Access — R79"}
            </button>
          </div>

          <button className="licence-choice" onClick={() => setShowLicencePicker(true)}>
            Licence: {LICENCE_CATEGORIES.find((item) => item.code === licenceCode)?.short} · {LICENCE_CATEGORIES.find((item) => item.code === licenceCode)?.title} — Change
          </button>

          {paymentNotice && (
            <p
              className={`paymentNotice ${paymentNotice.type}`}
              role="status"
              aria-live="polite"
            >
              {paymentNotice.text}
            </p>
          )}

          <p className="disclaimer">
            Independent learner-test preparation platform.
            Not an official government testing service.
            <span className="legal-home-links">
              <button onClick={() => openLegalPage("privacy")}>Privacy</button>
              <button onClick={() => openLegalPage("terms")}>Terms</button>
              <button onClick={() => openLegalPage("refunds")}>Refunds</button>
              <button onClick={() => openLegalPage("contact")}>Contact</button>
            </span>
          </p>
        </div>

        <div className="scoreCard">
          <p>EXAM READINESS</p>

          <div className="score">87%</div>

          <div className="metric">
            <div>
              <span>Rules of the Road</span>
              <strong>91%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "91%" }} />
            </div>
          </div>

          <div className="metric">
            <div>
              <span>Road Traffic Signs</span>
              <strong>83%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "83%" }} />
            </div>
          </div>

          <div className="metric">
            <div>
              <span>Vehicle Controls</span>
              <strong>94%</strong>
            </div>

            <div className="bar">
              <div style={{ width: "94%" }} />
            </div>
          </div>

          <div className="recommendation">
            <small>YOUR WEAKEST AREA</small>
            <strong>Regulatory Signs</strong>
            <p>
              Complete another visual signs session.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
