import { useEffect, useState } from "react";
import "./App.css";
import K53Test from "./components/K53Test";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";
import MistakePractice from "./components/MistakePractice";
import { supabase } from "./lib/supabase";

function App() {
  const [showTest, setShowTest] = useState(false);
  const [showMistakePractice, setShowMistakePractice] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [focusCategory, setFocusCategory] = useState(null);
  const [focusMistakes, setFocusMistakes] = useState([]);
  const [mistakePracticeTexts, setMistakePracticeTexts] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
  }, []);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

if (showDashboard && user) {
  return (
    <Dashboard
      user={user}
      onStartTest={() => {
        setFocusCategory(null);
        setFocusMistakes([]);
        setShowDashboard(false);
        setShowAuth(false);
        setShowTest(true);
      }}
      onPracticeWeakAreas={(weakestCategory) => {
        setFocusCategory(weakestCategory);
        setFocusMistakes([]);
        setShowDashboard(false);
        setShowAuth(false);
        setShowTest(true);
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
  {user ? "My Account" : "Sign Up / Log In"}
</button>
        <button
          className="navButton"
          onClick={() => setShowTest(true)}
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
              onClick={() => setShowTest(true)}
            >
              Start Free Test
            </button>

            <button className="secondaryButton">
              View Full Access — R79
            </button>
          </div>

          <p className="disclaimer">
            Independent learner-test preparation platform.
            Not an official government testing service.
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