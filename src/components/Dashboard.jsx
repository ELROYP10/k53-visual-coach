import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Dashboard({
  user,
  onStartTest = () => {},
  onPracticeWeakAreas = () => {},
  onPracticeMistakes = () => {},
}) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedResult, setSelectedResult] = useState(null);
  const [selectedResultDetails, setSelectedResultDetails] = useState([]);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [mistakeProgress, setMistakeProgress] = useState([]);
  const [mistakeProgressLoading, setMistakeProgressLoading] = useState(true);
  const [mistakeProgressError, setMistakeProgressError] = useState("");

  useEffect(() => {
    const loadResults = async () => {
      if (!user?.id) {
        setLoading(false);
        setResults([]);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data, error: queryError } = await supabase
          .from("test_results")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

        if (queryError) {
          throw queryError;
        }

        setResults(data || []);
      } catch (loadError) {
        setError(loadError.message || "Unable to load your test results.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [user?.id]);

  useEffect(() => {
    const loadMistakeProgress = async () => {
      if (!user?.id) {
        setMistakeProgress([]);
        setMistakeProgressLoading(false);
        setMistakeProgressError("");
        return;
      }

      try {
        setMistakeProgressLoading(true);
        setMistakeProgressError("");

        const { data, error: queryError } = await supabase
          .from("mistake_practice_sessions")
          .select("completed_at, question_count, correct_answers, percentage, improved")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

        if (queryError) {
          throw queryError;
        }

        setMistakeProgress(data || []);
      } catch (loadError) {
        setMistakeProgressError(
          loadError.message || "Unable to load your mistake practice progress."
        );
        setMistakeProgress([]);
      } finally {
        setMistakeProgressLoading(false);
      }
    };

    loadMistakeProgress();
  }, [user?.id]);

  useEffect(() => {
    if (!selectedResult?.id) {
      setSelectedResultDetails([]);
      setDetailsError("");
      setDetailsLoading(false);
      return;
    }

    const loadSelectedResultDetails = async () => {
      if (!user?.id) {
        setSelectedResultDetails([]);
        setDetailsLoading(false);
        return;
      }

      try {
        setDetailsLoading(true);
        setDetailsError("");

        const { data, error: detailsError } = await supabase
          .from("test_result_details")
          .select("*")
          .eq("result_id", selectedResult.id)
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (detailsError) {
          throw detailsError;
        }

        setSelectedResultDetails(data || []);
      } catch (loadError) {
        setDetailsError(loadError.message || "Unable to load this attempt’s mistakes.");
        setSelectedResultDetails([]);
      } finally {
        setDetailsLoading(false);
      }
    };

    loadSelectedResultDetails();
  }, [selectedResult?.id, user?.id]);

  const latest = results[0] || null;

  const rules = latest ? Math.round((latest.rules_score / 28) * 100) : 0;
  const signs = latest ? Math.round((latest.signs_score / 28) * 100) : 0;
  const controls = latest ? Math.round((latest.controls_score / 8) * 100) : 0;
  const readiness = latest ? Math.round((latest.total_score / 64) * 100) : 0;
  const testsCompleted = results.length;
  const latestMistakeProgress = mistakeProgress[0] || null;
  const previousMistakeProgress = mistakeProgress[1] || null;
  const latestMistakePercentage = latestMistakeProgress?.percentage ?? null;
  const bestMistakePercentage =
    mistakeProgress.length > 0
      ? Math.max(...mistakeProgress.map((session) => Number(session.percentage ?? 0)))
      : null;
  const previousMistakePercentage = previousMistakeProgress?.percentage ?? null;
  const mistakeProgressStatus =
    mistakeProgress.length <= 1
      ? "First session"
      : latestMistakeProgress?.improved
        ? "Improved"
        : "Not improved yet";

  const weakestArea = useMemo(() => {
    if (!latest) return "No completed tests yet";

    const scores = [
      { label: "Rules of the Road", value: rules },
      { label: "Road Traffic Signs", value: signs },
      { label: "Vehicle Controls", value: controls },
    ];

    const lowestValue = Math.min(...scores.map((item) => item.value));
    const tied = scores.filter((item) => item.value === lowestValue);

    if (tied.length === 1) {
      return tied[0].label;
    }

    return tied.map((item) => item.label).join(" & ");
  }, [latest, rules, signs, controls]);

  const practiceWeakestArea = useMemo(() => {
    if (!latest) return null;

    const scores = [
      { label: "Rules of the Road", value: rules },
      { label: "Road Traffic Signs", value: signs },
      { label: "Vehicle Controls", value: controls },
    ];

    const lowestValue = Math.min(...scores.map((item) => item.value));
    const tied = scores.filter((item) => item.value === lowestValue);

    return tied[0]?.label ?? null;
  }, [latest, rules, signs, controls]);

  const formatCompletedAt = (value) => {
    if (!value) return "Unknown date";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-ZA", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const email = user?.email || "learner@k53coach.co.za";

  return (
    <>
      <style>{`
        .dashboard-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #081c18 0%, #0b261f 100%);
          color: #edf7f3;
          font-family: Inter, "Segoe UI", sans-serif;
          padding: 40px 24px;
        }

        .dashboard-shell {
          max-width: 1200px;
          margin: 0 auto;
        }

        .dashboard-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 28px;
          flex-wrap: wrap;
        }

        .dashboard-header h1 {
          margin: 0;
          font-size: clamp(2rem, 3vw, 2.8rem);
          letter-spacing: -0.04em;
          color: #f5fff9;
        }

        .dashboard-badge {
          background: rgba(36, 144, 105, 0.18);
          border: 1px solid rgba(110, 216, 172, 0.35);
          color: #d2f6e3;
          border-radius: 999px;
          padding: 10px 16px;
          font-size: 0.8rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 700;
        }

        .dashboard-grid {
          display: grid;
          grid-template-columns: 350px minmax(0, 1fr);
          gap: 24px;
        }

        .panel {
          background: rgba(10, 34, 28, 0.82);
          border: 1px solid rgba(120, 203, 167, 0.22);
          border-radius: 20px;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.22);
        }

        .profile-card {
          padding: 28px;
          display: flex;
          flex-direction: column;
          gap: 22px;
        }

        .profile-avatar {
          width: 76px;
          height: 76px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          background: linear-gradient(135deg, #36a76f, #1a5f49);
          border: 2px solid rgba(177, 240, 201, 0.7);
          font-size: 1.9rem;
          font-weight: 700;
          color: white;
        }

        .profile-name {
          margin: 0;
          font-size: 1.15rem;
          color: #edf7f3;
          font-weight: 600;
        }

        .profile-email {
          font-size: 0.92rem;
          color: #bedbcf;
          word-break: break-word;
          margin: 0;
        }

        .profile-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
        }

        .meta-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 216, 185, 0.16);
          border-radius: 14px;
          padding: 14px 12px;
        }

        .meta-label {
          display: block;
          color: #9ed9be;
          font-size: 0.74rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .meta-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: #f4fff9;
        }

        .content-column {
          display: grid;
          gap: 24px;
        }

        .readiness-card {
          padding: 28px;
        }

        .section-label {
          color: #9ed9be;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-size: 0.74rem;
          font-weight: 700;
          margin: 0 0 18px;
        }

        .readiness-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .readiness-score {
          font-size: clamp(2.6rem, 4vw, 4rem);
          font-weight: 800;
          line-height: 1;
          color: #f8fff9;
        }

        .readiness-score small {
          font-size: 1.2rem;
          color: #b9e6ce;
          font-weight: 700;
        }

        .progress-bar {
          width: 100%;
          height: 12px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.08);
          overflow: hidden;
          border: 1px solid rgba(143, 216, 185, 0.18);
        }

        .progress-fill {
          display: block;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #45d493 0%, #85efb2 100%);
        }

        .subject-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-top: 18px;
        }

        .subject-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 216, 185, 0.15);
          border-radius: 16px;
          padding: 18px 16px;
        }

        .subject-title {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          font-size: 0.82rem;
          color: #dfeee7;
          margin-bottom: 12px;
        }

        .subject-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: #f2fff8;
          margin-bottom: 10px;
        }

        .subject-card .progress-bar {
          height: 8px;
        }

        .actions-card {
          padding: 28px;
        }

        .actions-grid {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
        }

        .primary-action,
        .secondary-action {
          border: none;
          border-radius: 12px;
          padding: 16px 22px;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }

        .primary-action {
          background: linear-gradient(135deg, #3ac18b 0%, #1d8d63 100%);
          color: #f6fff9;
          box-shadow: 0 12px 22px rgba(47, 153, 106, 0.28);
        }

        .secondary-action {
          background: rgba(146, 222, 183, 0.08);
          color: #eafcef;
          border: 1px solid rgba(136, 217, 176, 0.25);
        }

        .primary-action:hover,
        .secondary-action:hover {
          transform: translateY(-1px);
        }

        .weakest-area {
          margin-top: 20px;
          background: rgba(18, 54, 44, 0.85);
          border: 1px solid rgba(127, 219, 177, 0.18);
          border-radius: 16px;
          padding: 18px 20px;
        }

        .weakest-area strong {
          display: block;
          font-size: 1.3rem;
          margin-top: 6px;
          color: #f5fff9;
        }

        .history-card {
          padding: 28px;
        }

        .history-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 14px;
          color: #edf7f3;
          font-size: 0.95rem;
        }

        .history-table th,
        .history-table td {
          text-align: left;
          padding: 12px 10px;
          border-bottom: 1px solid rgba(143, 216, 185, 0.14);
          vertical-align: top;
        }

        .history-table th {
          color: #9ed9be;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .history-status {
          display: inline-block;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .history-status.pass {
          background: rgba(34, 197, 94, 0.12);
          color: #86efac;
          border: 1px solid rgba(34, 197, 94, 0.25);
        }

        .history-status.fail {
          background: rgba(248, 113, 113, 0.1);
          color: #fca5a5;
          border: 1px solid rgba(248, 113, 113, 0.22);
        }

        .history-row {
          cursor: pointer;
          transition: background 0.2s ease;
        }

        .history-row:hover {
          background: rgba(148, 163, 184, 0.06);
        }

        .history-detail-overlay {
          position: fixed;
          inset: 0;
          background: rgba(2, 6, 23, 0.72);
          display: grid;
          place-items: center;
          padding: 20px;
          z-index: 20;
        }

        .history-detail-panel {
          width: min(440px, 100%);
          max-height: min(82vh, 760px);
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background: rgba(10, 34, 28, 0.96);
          border: 1px solid rgba(120, 203, 167, 0.22);
          border-radius: 18px;
          padding: 22px;
          box-shadow: 0 18px 44px rgba(0, 0, 0, 0.3);
        }

        .history-detail-header {
          position: sticky;
          top: 0;
          z-index: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          background: rgba(10, 34, 28, 0.96);
          padding-bottom: 8px;
        }

        .history-detail-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px 16px;
        }

        .history-detail-item {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 216, 185, 0.15);
          border-radius: 12px;
          padding: 12px;
        }

        .history-detail-label {
          display: block;
          color: #9ed9be;
          font-size: 0.68rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
        }

        .history-detail-value {
          font-size: 1.1rem;
          font-weight: 700;
          color: #f5fff9;
        }

        .history-detail-close {
          background: rgba(146, 222, 183, 0.08);
          color: #eafcef;
          border: 1px solid rgba(136, 217, 176, 0.25);
          border-radius: 10px;
          padding: 8px 12px;
          cursor: pointer;
          font-weight: 700;
        }

        .history-detail-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 16px;
          margin-bottom: 8px;
        }

        .history-detail-practice {
          background: linear-gradient(135deg, #3ac18b 0%, #1d8d63 100%);
          color: #f6fff9;
          border: none;
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
        }

        .history-detail-list {
          display: grid;
          gap: 12px;
          margin-top: 18px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .history-detail-body {
          flex: 1 1 auto;
          overflow-y: auto;
          padding-right: 4px;
          min-height: 0;
          margin-top: 0;
        }

        .history-detail-mistake {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(143, 216, 185, 0.15);
          border-radius: 12px;
          padding: 12px;
          display: grid;
          gap: 10px;
        }

        .history-detail-mistake h4 {
          margin: 0;
          font-size: 1rem;
          color: #f5fff9;
        }

        .history-detail-mistake .mistake-field {
          border-radius: 10px;
          padding: 10px 12px;
          border: 1px solid rgba(143, 216, 185, 0.14);
          background: rgba(255, 255, 255, 0.02);
        }

        .history-detail-mistake .mistake-field-label {
          display: block;
          color: #9ed9be;
          font-size: 0.66rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 6px;
          font-weight: 700;
        }

        .history-detail-mistake .mistake-field-value {
          color: #edf7f3;
          line-height: 1.5;
        }

        .history-detail-mistake .mistake-answer-error {
          background: rgba(127, 29, 29, 0.18);
          border-color: rgba(248, 113, 113, 0.28);
        }

        .history-detail-mistake .mistake-answer-success {
          background: rgba(22, 101, 52, 0.18);
          border-color: rgba(74, 222, 128, 0.25);
        }

        .history-detail-mistake .mistake-tip {
          background: rgba(12, 74, 110, 0.16);
          border-color: rgba(96, 165, 250, 0.24);
        }

        @media (max-width: 860px) {
          .dashboard-grid {
            grid-template-columns: 1fr;
          }

          .subject-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="dashboard-page">
        <div className="dashboard-shell">
          <header className="dashboard-header">
            <h1>K53 Visual Coach</h1>
            <div className="dashboard-badge">Learner Dashboard</div>
          </header>

          <div className="dashboard-grid">
            <aside className="panel profile-card">
              <div className="profile-avatar">K</div>

              <div>
                <p className="section-label">Account</p>
                <h2 className="profile-name">Learner Profile</h2>
              </div>

              <p className="profile-email">{email}</p>

              <div className="profile-meta">
                <div className="meta-box">
                  <span className="meta-label">Tests</span>
                  <span className="meta-value">
                    {loading ? "..." : testsCompleted}
                  </span>
                </div>

                <div className="meta-box">
                  <span className="meta-label">Weakest</span>
                  <span className="meta-value">
                    {loading ? "..." : weakestArea}
                  </span>
                </div>
              </div>
            </aside>

            <div className="content-column">
              <section className="panel readiness-card">
                <p className="section-label">Exam Readiness</p>

                {loading ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>Loading your results…</div>
                ) : error ? (
                  <div style={{ color: "#fecaca", padding: "12px 0" }}>{error}</div>
                ) : !latest ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>No tests completed yet.</div>
                ) : (
                  <>
                    <div className="readiness-row">
                      <div className="readiness-score">
                        {readiness}
                        <small>%</small>
                      </div>
                    </div>

                    <div className="progress-bar" aria-label="Exam readiness progress">
                      <span className="progress-fill" style={{ width: `${readiness}%` }} />
                    </div>

                    <div className="subject-grid">
                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Rules of the Road</span>
                          <strong>{rules}%</strong>
                        </div>
                        <div className="subject-value">{rules}%</div>
                        <div className="progress-bar">
                          <span className="progress-fill" style={{ width: `${rules}%` }} />
                        </div>
                      </div>

                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Road Traffic Signs</span>
                          <strong>{signs}%</strong>
                        </div>
                        <div className="subject-value">{signs}%</div>
                        <div className="progress-bar">
                          <span className="progress-fill" style={{ width: `${signs}%` }} />
                        </div>
                      </div>

                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Vehicle Controls</span>
                          <strong>{controls}%</strong>
                        </div>
                        <div className="subject-value">{controls}%</div>
                        <div className="progress-bar">
                          <span className="progress-fill" style={{ width: `${controls}%` }} />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </section>

              <section className="panel actions-card">
                <p className="section-label">Quick Actions</p>

                <div className="actions-grid">
                  <button type="button" className="primary-action" onClick={onStartTest}>
                    Start Mock Test
                  </button>

                  <button
                    type="button"
                    className="secondary-action"
                    onClick={() => onPracticeWeakAreas(practiceWeakestArea)}
                  >
                    Practice Weak Areas
                  </button>
                </div>

                <div className="weakest-area">
                  <span className="section-label" style={{ marginBottom: 0 }}>
                    Weakest Area
                  </span>
                  <strong>
                    {loading ? "Loading..." : error ? "Unavailable" : latest ? weakestArea : "No tests yet"}
                  </strong>
                </div>
              </section>

              <section className="panel history-card">
                <p className="section-label">Mistake Practice Progress</p>

                {mistakeProgressLoading ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>
                    Loading your mistake practice progress…
                  </div>
                ) : mistakeProgressError ? (
                  <div style={{ color: "#fecaca", padding: "12px 0" }}>
                    {mistakeProgressError}
                  </div>
                ) : mistakeProgress.length === 0 ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>
                    Complete a Practice My Mistakes session to start tracking progress.
                  </div>
                ) : (
                  <div style={{ display: "grid", gap: 12 }}>
                    <div className="subject-grid" style={{ marginTop: 0 }}>
                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Last Score</span>
                          <strong>{latestMistakePercentage ?? 0}%</strong>
                        </div>
                        <div className="subject-value">{latestMistakePercentage ?? 0}%</div>
                      </div>

                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Best Score</span>
                          <strong>{bestMistakePercentage ?? 0}%</strong>
                        </div>
                        <div className="subject-value">{bestMistakePercentage ?? 0}%</div>
                      </div>

                      <div className="subject-card">
                        <div className="subject-title">
                          <span>Sessions</span>
                          <strong>{mistakeProgress.length}</strong>
                        </div>
                        <div className="subject-value">{mistakeProgress.length}</div>
                      </div>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">Progress status</span>
                      <span className="meta-value">{mistakeProgressStatus}</span>
                    </div>

                    <div className="meta-box">
                      <span className="meta-label">Previous score</span>
                      <span className="meta-value">
                        {mistakeProgress.length <= 1
                          ? "First session"
                          : `${previousMistakePercentage ?? 0}%`}
                      </span>
                    </div>
                  </div>
                )}
              </section>

              <section className="panel history-card">
                <p className="section-label">Test History</p>

                {loading ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>Loading your history…</div>
                ) : error ? (
                  <div style={{ color: "#fecaca", padding: "12px 0" }}>{error}</div>
                ) : results.length === 0 ? (
                  <div style={{ color: "#dfeee7", padding: "12px 0" }}>No previous attempts yet.</div>
                ) : (
                  <table className="history-table">
                    <thead>
                      <tr>
                        <th>Completed</th>
                        <th>Total</th>
                        <th>Rules</th>
                        <th>Signs</th>
                        <th>Controls</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.map((result) => {
                        const status = result.passed ? "Pass" : "Fail";

                        return (
                          <tr
                            key={result.id || `${result.user_id}-${result.completed_at}`}
                            className="history-row"
                            onClick={() => setSelectedResult(result)}
                          >
                            <td>{formatCompletedAt(result.completed_at)}</td>
                            <td>{result.total_score ?? 0}/64</td>
                            <td>{result.rules_score ?? 0}/28</td>
                            <td>{result.signs_score ?? 0}/28</td>
                            <td>{result.controls_score ?? 0}/8</td>
                            <td>
                              <span className={`history-status ${status === "Pass" ? "pass" : "fail"}`}>
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </section>
            </div>
          </div>
        </div>
      </div>

      {selectedResult && (
        <div className="history-detail-overlay" onClick={() => setSelectedResult(null)}>
          <div className="history-detail-panel" onClick={(event) => event.stopPropagation()}>
            <div className="history-detail-header">
              <p className="section-label" style={{ margin: 0 }}>Attempt Details</p>
              <button
                type="button"
                className="history-detail-close"
                onClick={() => setSelectedResult(null)}
              >
                Close
              </button>
            </div>

            <div className="history-detail-grid">
              <div className="history-detail-item">
                <span className="history-detail-label">Completed</span>
                <div className="history-detail-value">{formatCompletedAt(selectedResult.completed_at)}</div>
              </div>

              <div className="history-detail-item">
                <span className="history-detail-label">Status</span>
                <div className="history-detail-value">
                  <span className={`history-status ${selectedResult.passed ? "pass" : "fail"}`}>
                    {selectedResult.passed ? "Pass" : "Fail"}
                  </span>
                </div>
              </div>

              <div className="history-detail-item">
                <span className="history-detail-label">Total</span>
                <div className="history-detail-value">{selectedResult.total_score ?? 0}/64</div>
              </div>

              <div className="history-detail-item">
                <span className="history-detail-label">Rules</span>
                <div className="history-detail-value">{selectedResult.rules_score ?? 0}/28</div>
              </div>

              <div className="history-detail-item">
                <span className="history-detail-label">Signs</span>
                <div className="history-detail-value">{selectedResult.signs_score ?? 0}/28</div>
              </div>

              <div className="history-detail-item">
                <span className="history-detail-label">Controls</span>
                <div className="history-detail-value">{selectedResult.controls_score ?? 0}/8</div>
              </div>
            </div>

            <div className="history-detail-body">
              <div className="history-detail-actions">
                <button
                  type="button"
                  className="history-detail-practice"
                  onClick={() =>
                    onPracticeMistakes(
                      selectedResultDetails
                        .map((detail) => detail.question_text)
                        .filter(Boolean)
                    )
                  }
                  disabled={selectedResultDetails.length === 0}
                  style={{ opacity: selectedResultDetails.length === 0 ? 0.55 : 1 }}
                >
                  Practice My Mistakes
                </button>
              </div>

              <p className="section-label" style={{ margin: 0, marginBottom: 12 }}>Mistakes</p>

              {detailsLoading ? (
                <div style={{ color: "#dfeee7", padding: "8px 0" }}>Loading mistakes…</div>
              ) : detailsError ? (
                <div style={{ color: "#fecaca", padding: "8px 0" }}>{detailsError}</div>
              ) : selectedResultDetails.length === 0 ? (
                <div style={{ color: "#dfeee7", padding: "8px 0" }}>No mistakes recorded for this attempt.</div>
              ) : (
                <div className="history-detail-list">
                  {selectedResultDetails.map((detail) => (
                    <div key={detail.id || `${detail.result_id}-${detail.question_text}`} className="history-detail-mistake">
                      <h4>{detail.question_text}</h4>

                      <div className="mistake-field mistake-answer-error">
                        <span className="mistake-field-label">Learner answer</span>
                        <div className="mistake-field-value">{detail.learner_answer || "Not answered"}</div>
                      </div>

                      <div className="mistake-field mistake-answer-success">
                        <span className="mistake-field-label">Correct answer</span>
                        <div className="mistake-field-value">{detail.correct_answer}</div>
                      </div>

                      <div className="mistake-field mistake-tip">
                        <span className="mistake-field-label">Explanation</span>
                        <div className="mistake-field-value">{detail.explanation}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
