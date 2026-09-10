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

  return (
    <div className="app">
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