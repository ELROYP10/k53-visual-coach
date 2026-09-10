import { useEffect, useMemo, useState } from "react";

const QUESTION_BANK = [
  ["Rules of the Road", "When approaching a red traffic light, what must you do?", ["Stop before the stop line", "Slow down and continue if clear", "Sound the horn", "Stop only if pedestrians are present"], 0],
  ["Rules of the Road", "What is the safest action before changing lanes?", ["Signal, check mirrors and blind spot, then move when safe", "Move first, then signal", "Only check the rear-view mirror", "Accelerate sharply without signalling"], 0],
  ["Rules of the Road", "At an uncontrolled intersection, you should primarily:", ["Approach cautiously and give way according to right-of-way rules", "Always accelerate through", "Stop in the middle", "Use your horn continuously"], 0],
  ["Rules of the Road", "If an emergency vehicle approaches with siren and warning lights, you should:", ["Give way and move aside safely", "Race it through traffic", "Stop immediately in your lane regardless of danger", "Ignore it if you are at the speed limit"], 0],
  ["Rules of the Road", "A safe following distance should:", ["Allow enough time to react and stop safely", "Always be exactly one car length", "Be shorter in rain", "Be ignored below 60 km/h"], 0],
  ["Rules of the Road", "When driving in heavy rain you should:", ["Reduce speed and increase following distance", "Drive faster to leave the rain", "Use hazard lights continuously while moving normally", "Follow the vehicle ahead closely"], 0],
  ["Rules of the Road", "Before overtaking, you must make sure:", ["The road ahead is clear and overtaking is legal and safe", "The vehicle ahead is travelling below the limit", "You can exceed any speed limit", "There is a blind corner ahead"], 0],
  ["Rules of the Road", "If you feel drowsy while driving, the safest choice is to:", ["Stop somewhere safe and rest", "Open the window and continue indefinitely", "Drive faster to arrive sooner", "Use your phone to stay awake"], 0],
  ["Rules of the Road", "When entering a freeway, you should:", ["Match traffic speed as safely as possible and merge into a safe gap", "Stop at the end of the on-ramp", "Enter at walking speed", "Force other vehicles to brake"], 0],
  ["Rules of the Road", "When leaving a freeway, you should:", ["Signal in good time and use the exit lane", "Brake sharply in the traffic lane", "Reverse if you miss the exit", "Cross multiple lanes at once"], 0],
  ["Rules of the Road", "At night, you should dip high-beam headlights when:", ["They could dazzle another road user", "You are alone on a dark road", "You are parked", "Your windscreen is clean"], 0],
  ["Rules of the Road", "If a tyre suddenly bursts while driving, you should first:", ["Keep a firm grip and reduce speed gradually", "Brake as hard as possible immediately", "Turn sharply off the road", "Accelerate"], 0],
  ["Rules of the Road", "When approaching a pedestrian crossing with people waiting to cross, you should:", ["Reduce speed and be prepared to stop", "Increase speed", "Sound the horn and continue", "Drive around them"], 0],
  ["Rules of the Road", "What should you do before reversing?", ["Check behind and around the vehicle for hazards", "Only check the dashboard", "Sound the horn and reverse immediately", "Rely only on mirrors"], 0],
  ["Rules of the Road", "Parking on a bend with poor visibility is:", ["Unsafe because other road users may not see the vehicle in time", "Always safe at night", "Required when traffic is heavy", "Safe if hazard lights are on"], 0],
  ["Rules of the Road", "If your vehicle begins to skid, a good general response is to:", ["Ease off abrupt inputs and steer smoothly toward the intended path", "Brake and steer violently", "Accelerate hard", "Close your eyes and hold the wheel"], 0],
  ["Rules of the Road", "Before moving off from the roadside, you should:", ["Check mirrors, blind spot, signal if needed, and move when safe", "Move immediately if no car is visible ahead", "Only check the left mirror", "Sound the horn instead of checking"], 0],
  ["Rules of the Road", "When approaching roadworks, you should:", ["Reduce speed and obey temporary controls", "Ignore temporary signs", "Overtake all slow vehicles", "Drive on the shoulder"], 0],
  ["Rules of the Road", "You should use a cellphone while driving only when:", ["It is legal and does not require you to hold or operate it unsafely", "Traffic is slow", "You are driving below 40 km/h", "You are on a freeway"], 0],
  ["Rules of the Road", "What is the correct action at a railway crossing if a train is approaching?", ["Stop and wait until it is completely safe to cross", "Cross quickly before it arrives", "Stop on the tracks", "Follow the vehicle ahead without checking"], 0],
  ["Rules of the Road", "If visibility is severely reduced by fog, you should:", ["Slow down and use appropriate lights", "Use high beams continuously", "Drive at normal speed", "Follow tail lights closely"], 0],
  ["Rules of the Road", "When driving downhill, vehicle control is improved by:", ["Using an appropriate lower gear and controlled braking", "Coasting in neutral", "Switching off the engine", "Holding the clutch down continuously"], 0],
  ["Rules of the Road", "If another driver is overtaking you, you should:", ["Maintain a safe, predictable course and do not accelerate to block them", "Speed up to stop them passing", "Move toward them", "Brake sharply without reason"], 0],
  ["Rules of the Road", "Seat belts should be worn by:", ["All occupants where seat belts are provided", "Only the driver", "Only front passengers", "Only on freeways"], 0],
  ["Rules of the Road", "Before a long trip, you should check:", ["Tyres, lights, fluids and general vehicle condition", "Only the radio", "Only the fuel gauge", "Nothing if the car starts"], 0],
  ["Rules of the Road", "What is the safest response if an animal runs into the road?", ["Reduce speed while maintaining control and avoid dangerous swerving", "Swerve sharply into another lane", "Close your eyes", "Accelerate"], 0],
  ["Rules of the Road", "At a stop street where two vehicles arrive together, you should:", ["Proceed according to right-of-way rules and only when safe", "Both go at the same time", "The larger vehicle always goes first", "The faster vehicle goes first"], 0],
  ["Rules of the Road", "When driving behind a motorcycle, you should:", ["Allow a generous following distance", "Follow more closely because it is smaller", "Share the same lane beside it", "Use high beams to make it move"], 0],
  ["Road Traffic Signs", "What does this sign require?", ["Come to a complete stop", "Give way only", "No entry", "Maximum speed 60 km/h"], 0],
  ["Road Traffic Signs", "What does this sign mean?", ["Give way / yield", "Stop completely", "Roadworks", "No U-turn"], 0],
  ["Road Traffic Signs", "What does this sign indicate?", ["No entry from this direction", "No parking", "Stop ahead", "One way"], 0],
  ["Road Traffic Signs", "What does this sign indicate?", ["Maximum speed 60 km/h", "Minimum speed 60 km/h", "Recommended speed only", "60 km to destination"], 0],
  ["Road Traffic Signs", "What does this warning sign indicate?", ["Pedestrians may be present ahead", "No pedestrians", "School closed", "Roadworks"], 0],
  ["Road Traffic Signs", "What does this warning sign indicate?", ["Roadworks or maintenance ahead", "Pedestrian crossing", "No entry", "Parking area"], 0],
  ["Road Traffic Signs", "What does this sign prohibit?", ["Making a U-turn", "Turning left", "Overtaking", "Parking"], 0],
  ["Road Traffic Signs", "A triangular road sign generally warns you about:", ["A hazard or condition ahead", "A compulsory parking area", "A motorway exit number", "A fuel station only"], 0],
  ["Road Traffic Signs", "A circular regulatory sign generally communicates:", ["A rule, prohibition or restriction", "Tourist information only", "Road surface quality", "Weather information"], 0],
  ["Road Traffic Signs", "A blue information sign is most likely to provide:", ["Guidance or permitted facility information", "A mandatory stop", "A danger warning only", "A railway crossing barrier"], 0],
  ["Road Traffic Signs", "A solid white line separating lanes generally means:", ["Lane crossing may be restricted depending on the marking and situation", "Overtaking is always compulsory", "Parking is compulsory", "The road ends"], 0],
  ["Road Traffic Signs", "A broken lane line normally means:", ["You may cross it when safe and legal", "You must never cross it", "You must stop on it", "It marks a pedestrian-only lane"], 0],
  ["Road Traffic Signs", "Yellow road-edge markings are used to:", ["Mark the edge or shoulder-related restriction area", "Show the centre of every freeway", "Mark pedestrian crossings only", "Indicate a stop line"], 0],
  ["Road Traffic Signs", "A painted stop line tells you where to:", ["Stop when a stop control or red light requires it", "Start overtaking", "Park permanently", "Accelerate"], 0],
  ["Road Traffic Signs", "Chevron signs on a sharp bend are intended to:", ["Guide your eyes through the change in direction", "Set a speed limit", "Indicate no entry", "Mark a parking bay"], 0],
  ["Road Traffic Signs", "A sign showing children is a warning that:", ["Children may be present near a school or crossing", "Children are prohibited", "Only buses may enter", "The road is closed"], 0],
  ["Road Traffic Signs", "A slippery-road warning sign means you should:", ["Reduce speed and avoid harsh braking or steering", "Accelerate through the area", "Brake hard to test grip", "Drive on the shoulder"], 0],
  ["Road Traffic Signs", "A narrowing-road warning means:", ["The usable road width reduces ahead", "The road becomes a freeway", "Parking begins", "You must make a U-turn"], 0],
  ["Road Traffic Signs", "A traffic-circle warning sign means:", ["A roundabout or traffic circle is ahead", "The road ends immediately", "U-turns are compulsory", "Traffic lights are out"], 0],
  ["Road Traffic Signs", "A railway-crossing warning sign tells you to:", ["Approach with caution and check for trains", "Increase speed", "Stop only if another car stops", "Park on the tracks"], 0],
  ["Road Traffic Signs", "A no-overtaking sign means:", ["Do not overtake in the controlled section", "Overtake only trucks", "Overtake on the shoulder", "Overtaking is compulsory"], 0],
  ["Road Traffic Signs", "A no-parking sign means:", ["Parking is prohibited where the restriction applies", "Stopping is always compulsory", "Only motorcycles may park", "Parking is free"], 0],
  ["Road Traffic Signs", "A one-way sign indicates:", ["Traffic must travel in the indicated direction", "Traffic may travel both ways", "The road is closed", "Pedestrians only"], 0],
  ["Road Traffic Signs", "An arrow painted in a traffic lane tells you:", ["The permitted or required direction from that lane", "The speed limit", "Where to park", "Where the road ends"], 0],
  ["Road Traffic Signs", "A pedestrian crossing marked by broad white stripes means:", ["Drivers must approach cautiously and give way when required", "Vehicles have absolute priority", "Parking is permitted on the crossing", "Pedestrians are prohibited"], 0],
  ["Road Traffic Signs", "Temporary roadwork signs must be:", ["Obeyed while they apply", "Ignored if you know the road", "Followed only by trucks", "Used as suggestions only"], 0],
  ["Road Traffic Signs", "A hazard-marker board is used to:", ["Highlight an obstruction or change in road alignment", "Set the speed limit", "Mark a bus stop only", "Show a petrol station"], 0],
  ["Road Traffic Signs", "If a road sign conflicts with a police officer directing traffic, you should:", ["Follow the lawful directions of the officer", "Ignore the officer", "Follow the sign only", "Stop and refuse to move"], 0],
  ["Vehicle Controls", "Which control is normally used to slow or stop the vehicle?", ["Brake pedal", "Accelerator", "Clutch only", "Indicator stalk"], 0],
  ["Vehicle Controls", "Which pedal controls engine power and vehicle acceleration?", ["Accelerator pedal", "Brake pedal", "Clutch pedal", "Parking brake"], 0],
  ["Vehicle Controls", "In a manual vehicle, the clutch pedal is used to:", ["Engage or disengage engine drive while changing gear or stopping", "Operate the headlights", "Apply the parking brake", "Wash the windscreen"], 0],
  ["Vehicle Controls", "The parking brake is mainly used to:", ["Secure a stationary vehicle", "Increase engine speed", "Change lanes", "Operate indicators"], 0],
  ["Vehicle Controls", "The indicator control is used to:", ["Communicate an intended turn or lane change", "Increase speed", "Stop the engine", "Adjust the seat"], 0],
  ["Vehicle Controls", "The rear-view and side mirrors are used to:", ["Monitor traffic around and behind the vehicle", "Measure fuel level", "Control speed", "Apply brakes"], 0],
  ["Vehicle Controls", "The steering wheel is used to:", ["Control the vehicle direction", "Operate the clutch", "Change engine oil", "Apply the parking brake"], 0],
  ["Vehicle Controls", "The windscreen wiper control is used to:", ["Clear rain or moisture from the windscreen", "Increase tyre pressure", "Operate the horn", "Change gears"], 0],
];

const shuffle = (array) => {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const normalizeText = (value) => String(value ?? "").replace(/\s+/g, " ").trim();

const buildQuestionMap = () => {
  const map = new Map();

  QUESTION_BANK.forEach(([section, question, options, correctIndex]) => {
    const key = normalizeText(question);
    if (!map.has(key)) {
      map.set(key, {
        section,
        question,
        options: [...options],
        correct: correctIndex,
      });
    }
  });

  return map;
};

const buildPracticeQuestions = (mistakeTexts = []) => {
  const matchMap = buildQuestionMap();
  const seen = new Set();
  const output = [];

  (Array.isArray(mistakeTexts) ? mistakeTexts : []).forEach((rawText) => {
    const key = normalizeText(rawText);
    if (!key || seen.has(key) || !matchMap.has(key)) {
      return;
    }

    const source = matchMap.get(key);
    const shuffledOptions = shuffle(source.options);

    output.push({
      id: key,
      section: source.section,
      question: source.question,
      options: shuffledOptions,
      correct: shuffledOptions.indexOf(source.options[source.correct]),
    });

    seen.add(key);
  });

  return output;
};

function MistakePractice({ mistakeTexts = [], onExit = () => {} }) {
  const practiceQuestions = useMemo(() => buildPracticeQuestions(mistakeTexts), [mistakeTexts]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setAnswers(Array(practiceQuestions.length).fill(null));
    setCurrent(0);
    setFinished(false);
  }, [practiceQuestions]);

  const totalQuestions = practiceQuestions.length;
  const question = practiceQuestions[current] || null;
  const answeredCount = answers.filter((value) => value !== null).length;
  const score = answers.reduce((total, answer, index) => {
    const currentQuestion = practiceQuestions[index];
    if (!currentQuestion) return total;
    return total + (answer === currentQuestion.correct ? 1 : 0);
  }, 0);

  const chooseAnswer = (selectedIndex) => {
    setAnswers((previous) => {
      const next = [...previous];
      next[current] = selectedIndex;
      return next;
    });
  };

  const handlePrev = () => {
    setCurrent((previous) => Math.max(0, previous - 1));
  };

  const handleNext = () => {
    if (current >= totalQuestions - 1) {
      setFinished(true);
      return;
    }

    setCurrent((previous) => previous + 1);
  };

  const restartPractice = () => {
    setAnswers(Array(totalQuestions).fill(null));
    setCurrent(0);
    setFinished(false);
  };

  const resultStyles = {
    page: { minHeight: "100vh", background: "#08111f", color: "#f8fafc", padding: "24px 5% 50px" },
    shell: { maxWidth: 980, margin: "0 auto" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap", marginBottom: 16 },
    eyebrow: { margin: 0, color: "#86efac", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" },
    heading: { margin: "6px 0 0", fontSize: 24 },
    card: { background: "#111827", border: "1px solid #334155", borderRadius: 18, padding: 24 },
    badge: { display: "inline-block", color: "#86efac", background: "#052e16", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 800 },
    question: { fontSize: 21, lineHeight: 1.4, margin: "16px 0 18px" },
    answers: { display: "grid", gap: 10 },
    answer: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", border: "2px solid #334155", borderRadius: 12, background: "#1f2937", color: "white", textAlign: "left", fontSize: 15, cursor: "pointer" },
    answerSelected: { borderColor: "#22c55e", background: "#0d2818" },
    letter: { width: 32, height: 32, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 8, background: "#0f172a", fontWeight: 900 },
    actions: { display: "flex", gap: 10, flexWrap: "wrap", marginTop: 18 },
    secondary: { border: "1px solid #475569", background: "#111827", color: "white", borderRadius: 11, padding: "11px 16px", fontWeight: 800, cursor: "pointer" },
    primary: { border: 0, background: "#22c55e", color: "#052e16", borderRadius: 11, padding: "11px 18px", fontWeight: 900, cursor: "pointer" },
    resultCard: { maxWidth: 820, margin: "50px auto", background: "#111827", border: "1px solid #334155", borderRadius: 20, padding: 28, textAlign: "center" },
    score: { fontSize: 54, fontWeight: 900, color: "#86efac" },
  };

  if (finished || totalQuestions === 0) {
    return (
      <section style={resultStyles.page}>
        <div style={resultStyles.resultCard}>
          <p style={resultStyles.eyebrow}>PRACTICE MY MISTAKES</p>
          <h2 style={{ fontSize: 34, marginBottom: 8, color: "#f8fafc" }}>
            {totalQuestions === 0 ? "No matching mistakes found" : "Practice complete"}
          </h2>

          {totalQuestions === 0 ? (
            <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
              There were no saved mistake questions available to match this K53 question bank.
            </p>
          ) : (
            <>
              <div style={resultStyles.score}>{score}/{totalQuestions}</div>
              <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
                You answered {score} out of {totalQuestions} correctly in this focused mistake review.
              </p>
            </>
          )}

          <div style={{ ...resultStyles.actions, justifyContent: "center", marginTop: 24 }}>
            <button style={resultStyles.primary} onClick={restartPractice}>
              Restart
            </button>
            <button style={resultStyles.secondary} onClick={onExit}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!question) {
    return (
      <section style={resultStyles.page}>
        <div style={resultStyles.resultCard}>
          <p style={resultStyles.eyebrow}>PRACTICE MY MISTAKES</p>
          <h2 style={{ fontSize: 34, marginBottom: 8 }}>No questions available</h2>
          <button style={resultStyles.secondary} onClick={onExit}>Back to Dashboard</button>
        </div>
      </section>
    );
  }

  return (
    <section style={resultStyles.page}>
      <div style={resultStyles.shell}>
        <div style={resultStyles.header}>
          <div>
            <p style={resultStyles.eyebrow}>PRACTICE MY MISTAKES</p>
            <h2 style={resultStyles.heading}>Question {current + 1} of {totalQuestions}</h2>
          </div>
          <button style={resultStyles.secondary} onClick={onExit}>Back to Dashboard</button>
        </div>

        <div style={resultStyles.card}>
          <span style={resultStyles.badge}>{question.section}</span>
          <h3 style={resultStyles.question}>{question.question}</h3>

          <div style={resultStyles.answers}>
            {question.options.map((option, index) => (
              <button
                key={`${question.id}-${index}`}
                type="button"
                style={{
                  ...resultStyles.answer,
                  ...(answers[current] === index ? resultStyles.answerSelected : {}),
                }}
                onClick={() => chooseAnswer(index)}
              >
                <span style={resultStyles.letter}>{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </button>
            ))}
          </div>

          <div style={resultStyles.actions}>
            <button
              type="button"
              style={{ ...resultStyles.secondary, opacity: current === 0 ? 0.45 : 1 }}
              disabled={current === 0}
              onClick={handlePrev}
            >
              Previous
            </button>

            {current === totalQuestions - 1 ? (
              <button type="button" style={resultStyles.primary} onClick={handleNext}>
                Finish
              </button>
            ) : (
              <button type="button" style={resultStyles.primary} onClick={handleNext}>
                Next Question
              </button>
            )}
          </div>
        </div>

        <div style={{ color: "#94a3b8", marginTop: 16, fontWeight: 700 }}>
          Answered {answeredCount}/{totalQuestions}
        </div>
      </div>
    </section>
  );
}

export default MistakePractice;
