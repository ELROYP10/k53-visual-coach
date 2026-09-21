const sectionAdvice = {
  "Rules of the Road": {
    icon: "🛣️",
    skill: "right-of-way, safe following and legal road behaviour",
    tip: "Read every option fully and choose the safest lawful action—not merely the most convenient one.",
  },
  "Road Traffic Signs": {
    icon: "🚦",
    skill: "sign shapes, colours and road-marking meanings",
    tip: "Identify the sign family from its shape and colour before reading the answer options.",
  },
  "Vehicle Controls": {
    icon: "🚘",
    skill: "control identification and correct control use",
    tip: "Picture the driver’s position, then identify the control by location before choosing its function.",
  },
};

export default function StudyCoach({
  loading,
  testsCompleted,
  readiness,
  weakestArea,
  weakestScore,
  streak,
  latestMistakePercentage,
  onStartTest,
  onPracticeWeakAreas,
}) {
  const primaryArea = String(weakestArea || "").split(" & ")[0];
  const advice = sectionAdvice[primaryArea] || sectionAdvice["Rules of the Road"];
  const newLearner = testsCompleted === 0;
  const ready = readiness >= 80;
  const needsReview = latestMistakePercentage !== null && latestMistakePercentage < 70;

  const mission = newLearner
    ? "Complete your first mock test so I can analyse your strengths and gaps."
    : ready
      ? `Protect your ${readiness}% readiness with a focused ${primaryArea} session.`
      : `Raise ${primaryArea} from ${weakestScore}% by practising ${advice.skill}.`;

  const coachMessage = newLearner
    ? "Your first result becomes the baseline for a personalised study plan."
    : needsReview
      ? `Your recent mistake-practice score is ${latestMistakePercentage}%. Review explanations slowly before attempting another full test.`
      : streak === 0
        ? "A short session today will restart your practice streak and keep the material fresh."
        : `You are on a ${streak}-day streak. Consistency is now one of your strongest preparation habits.`;

  return (
    <section className="study-coach" aria-labelledby="study-coach-title">
      <div className="coach-heading">
        <div>
          <p className="section-label" style={{ marginBottom: 5 }}>AI Study Coach</p>
          <h2 id="study-coach-title">Today’s mission</h2>
        </div>
        <span className="coach-status"><span /> Personalised</span>
      </div>

      {loading ? (
        <p className="coach-loading">Analysing your learning history…</p>
      ) : (
        <>
          <div className="coach-focus">
            <span className="coach-icon">{newLearner ? "🎯" : advice.icon}</span>
            <div>
              <strong>{mission}</strong>
              <p>{coachMessage}</p>
            </div>
          </div>

          {!newLearner && (
            <div className="coach-tip">
              <span>COACH TIP</span>
              <p>{advice.tip}</p>
            </div>
          )}

          <div className="coach-actions">
            <button type="button" className="coach-primary" onClick={newLearner || ready ? onStartTest : onPracticeWeakAreas}>
              {newLearner ? "Start baseline test" : ready ? "Test my readiness" : `Practise ${primaryArea}`}
            </button>
            {!newLearner && (
              <button type="button" className="coach-secondary" onClick={ready ? onPracticeWeakAreas : onStartTest}>
                {ready ? "Strengthen weak area" : "Take full mock test"}
              </button>
            )}
          </div>
        </>
      )}
    </section>
  );
}
