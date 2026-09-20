import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import K53Visual from "../assets/k53-visuals/K53Visuals";

const signSVG={
stop:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><polygon points="35,5 85,5 115,35 115,85 85,115 35,115 5,85 5,35" fill="#c62828" stroke="#fff" stroke-width="5"/><text x="60" y="70" text-anchor="middle" fill="white" font-size="27" font-weight="700">STOP</text></svg></div>`,
yield:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><polygon points="60,108 8,15 112,15" fill="white" stroke="#c62828" stroke-width="9"/></svg></div>`,
noentry:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="52" fill="#c62828"/><rect x="24" y="50" width="72" height="20" fill="white"/></svg></div>`,
speed60:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="51" fill="white" stroke="#c62828" stroke-width="8"/><text x="60" y="72" text-anchor="middle" font-size="39" font-weight="700">60</text></svg></div>`,
pedestrian:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><polygon points="60,6 114,108 6,108" fill="#f7d154" stroke="#222" stroke-width="5"/><circle cx="60" cy="38" r="7" fill="#222"/><path d="M60 47 L58 69 M58 55 L44 67 M58 55 L72 66 M58 69 L45 91 M58 69 L73 91" stroke="#222" stroke-width="6" fill="none" stroke-linecap="round"/></svg></div>`,
roadworks:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><polygon points="60,6 114,108 6,108" fill="#f7d154" stroke="#222" stroke-width="5"/><circle cx="54" cy="39" r="6" fill="#222"/><path d="M54 47 L51 66 M51 55 L37 65 M51 55 L67 64 M51 66 L40 89 M51 66 L66 89" stroke="#222" stroke-width="5"/><path d="M73 63 L88 90 M68 90 L92 90" stroke="#222" stroke-width="5"/></svg></div>`,
uturn:`<div class="sign-wrap"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="51" fill="white" stroke="#c62828" stroke-width="8"/><path d="M76 81 V53 C76 35 46 34 46 53 V65" stroke="#222" stroke-width="8" fill="none"/><polygon points="35,62 46,77 57,62" fill="#222"/><path d="M25 25 L95 95" stroke="#c62828" stroke-width="9"/></svg></div>`
};

function scenario(type){
 if(type==='intersection') return `<div class="scenario"><svg viewBox="0 0 600 280"><rect width="600" height="280" fill="#b7d49b"/><rect x="245" width="110" height="280" fill="#555"/><rect y="90" width="600" height="100" fill="#555"/><line x1="300" y1="0" x2="300" y2="280" stroke="white" stroke-width="4" stroke-dasharray="18 14"/><line x1="0" y1="140" x2="600" y2="140" stroke="white" stroke-width="4" stroke-dasharray="18 14"/><rect x="265" y="205" width="35" height="58" rx="6" fill="#2563eb"/><text x="282" y="240" text-anchor="middle" fill="white" font-size="18">A</text><rect x="370" y="110" width="58" height="35" rx="6" fill="#dc2626"/><text x="399" y="134" text-anchor="middle" fill="white" font-size="18">B</text><text x="300" y="24" text-anchor="middle" fill="#111" font-size="16" font-weight="700">Schematic intersection</text></svg></div>`;
 if(type==='pedcross') return `<div class="scenario"><svg viewBox="0 0 600 240"><rect width="600" height="240" fill="#86b86b"/><rect y="55" width="600" height="130" fill="#555"/>${[220,240,260,280,300,320,340,360].map(x=>`<rect x="${x}" y="55" width="12" height="130" fill="white"/>`).join('')}<circle cx="300" cy="35" r="10" fill="#111"/><path d="M300 45 L300 80 M300 55 L280 70 M300 55 L320 70 M300 80 L282 108 M300 80 L320 108" stroke="#111" stroke-width="7"/><rect x="90" y="105" width="75" height="38" rx="8" fill="#2563eb"/><text x="127" y="130" text-anchor="middle" fill="white" font-size="18">YOU</text></svg></div>`;
 return '';
}

const R='Rules of the Road',S='Road Traffic Signs',C='Vehicle Controls';
const QUESTION_BANK=[
// Rules 28
[R,'When approaching a red traffic light, what must you do?',['Stop before the stop line','Slow down and continue if clear','Sound the horn','Stop only if pedestrians are present'],0,'A red light requires you to stop before the stop line and wait for a lawful signal to proceed.'],
[R,'What is the safest action before changing lanes?',['Signal, check mirrors and blind spot, then move when safe','Move first, then signal','Only check the rear-view mirror','Accelerate sharply without signalling'],0,'Lane changes require observation, signalling and a final blind-spot check before moving.'],
[R,'At an uncontrolled intersection, you should primarily:',['Approach cautiously and give way according to right-of-way rules','Always accelerate through','Stop in the middle','Use your horn continuously'],0,'Reduce speed and assess the intersection before proceeding.'],
[R,'If an emergency vehicle approaches with siren and warning lights, you should:',['Give way and move aside safely','Race it through traffic','Stop immediately in your lane regardless of danger','Ignore it if you are at the speed limit'],0,'Emergency vehicles require other drivers to make way when it is safe to do so.'],
[R,'A safe following distance should:',['Allow enough time to react and stop safely','Always be exactly one car length','Be shorter in rain','Be ignored below 60 km/h'],0,'Following distance should increase with speed, poor visibility and slippery conditions.'],
[R,'When driving in heavy rain you should:',['Reduce speed and increase following distance','Drive faster to leave the rain','Use hazard lights continuously while moving normally','Follow the vehicle ahead closely'],0,'Wet roads reduce grip and visibility, so speed should be reduced and spacing increased.'],
[R,'Before overtaking, you must make sure:',['The road ahead is clear and overtaking is legal and safe','The vehicle ahead is travelling below the limit','You can exceed any speed limit','There is a blind corner ahead'],0,'Overtaking must only be done where legal and with adequate visibility and space.'],
[R,'If you feel drowsy while driving, the safest choice is to:',['Stop somewhere safe and rest','Open the window and continue indefinitely','Drive faster to arrive sooner','Use your phone to stay awake'],0,'Fatigue seriously reduces reaction time and judgement.'],
[R,'When entering a freeway, you should:',['Match traffic speed as safely as possible and merge into a safe gap','Stop at the end of the on-ramp','Enter at walking speed','Force other vehicles to brake'],0,'Use the acceleration lane to build appropriate speed and merge into a safe gap.'],
[R,'When leaving a freeway, you should:',['Signal in good time and use the exit lane','Brake sharply in the traffic lane','Reverse if you miss the exit','Cross multiple lanes at once'],0,'Plan the exit early, signal and move into the correct lane safely.'],
[R,'At night, you should dip high-beam headlights when:',['They could dazzle another road user','You are alone on a dark road','You are parked','Your windscreen is clean'],0,'High beams should not be used when they can dazzle approaching or nearby drivers.'],
[R,'If a tyre suddenly bursts while driving, you should first:',['Keep a firm grip and reduce speed gradually','Brake as hard as possible immediately','Turn sharply off the road','Accelerate'],0,'Sudden braking or steering can make a tyre blowout harder to control.'],
[R,'When approaching a pedestrian crossing with people waiting to cross, you should:', ['Reduce speed and be prepared to stop','Increase speed','Sound the horn and continue','Drive around them'],0,'Drivers must approach pedestrian crossings cautiously and yield when required.'],
[R,'What should you do before reversing?',['Check behind and around the vehicle for hazards','Only check the dashboard','Sound the horn and reverse immediately','Rely only on mirrors'],0,'A full observation around the vehicle is essential before reversing.'],
[R,'Parking on a bend with poor visibility is:',['Unsafe because other road users may not see the vehicle in time','Always safe at night','Required when traffic is heavy','Safe if hazard lights are on'],0,'Parking where visibility is restricted can create a serious collision risk.'],
[R,'If your vehicle begins to skid, a good general response is to:',['Ease off abrupt inputs and steer smoothly toward the intended path','Brake and steer violently','Accelerate hard','Close your eyes and hold the wheel'],0,'Smooth control inputs help restore grip and direction.'],
[R,'Before moving off from the roadside, you should:',['Check mirrors, blind spot, signal if needed, and move when safe','Move immediately if no car is visible ahead','Only check the left mirror','Sound the horn instead of checking'],0,'Observation and signalling are required before rejoining traffic.'],
[R,'When approaching roadworks, you should:',['Reduce speed and obey temporary controls','Ignore temporary signs','Overtake all slow vehicles','Drive on the shoulder'],0,'Temporary roadworks signs and controls are there to protect workers and road users.'],
[R,'You should use a cellphone while driving only when:',['It is legal and does not require you to hold or operate it unsafely','Traffic is slow','You are driving below 40 km/h','You are on a freeway'],0,'Handheld phone use distracts the driver and is unsafe.'],
[R,'What is the correct action at a railway crossing if a train is approaching?',['Stop and wait until it is completely safe to cross','Cross quickly before it arrives','Stop on the tracks','Follow the vehicle ahead without checking'],0,'Never enter a crossing unless you can clear it safely and no train is approaching.'],
[R,'If visibility is severely reduced by fog, you should:',['Slow down and use appropriate lights','Use high beams continuously','Drive at normal speed','Follow tail lights closely'],0,'Reduced visibility requires slower speed, increased spacing and appropriate lighting.'],
[R,'When driving downhill, vehicle control is improved by:',['Using an appropriate lower gear and controlled braking','Coasting in neutral','Switching off the engine','Holding the clutch down continuously'],0,'An appropriate gear helps control speed and reduces excessive brake use.'],
[R,'If another driver is overtaking you, you should:',['Maintain a safe, predictable course and do not accelerate to block them','Speed up to stop them passing','Move toward them','Brake sharply without reason'],0,'Being predictable helps the overtaking vehicle complete the manoeuvre safely.'],
[R,'Seat belts should be worn by:',['All occupants where seat belts are provided','Only the driver','Only front passengers','Only on freeways'],0,'Seat belts reduce injury risk and should be used by all occupants where fitted.'],
[R,'Before a long trip, you should check:',['Tyres, lights, fluids and general vehicle condition','Only the radio','Only the fuel gauge','Nothing if the car starts'],0,'Basic roadworthiness checks reduce breakdown and collision risk.'],
[R,'What is the safest response if an animal runs into the road?',['Reduce speed while maintaining control and avoid dangerous swerving','Swerve sharply into another lane','Close your eyes','Accelerate'],0,'Avoid sudden steering that could cause a more serious collision.'],
[R,'At a stop street where two vehicles arrive together, you should:',['Proceed according to right-of-way rules and only when safe','Both go at the same time','The larger vehicle always goes first','The faster vehicle goes first'],0,'Right-of-way and safe observation determine who proceeds.'],
[R,'When driving behind a motorcycle, you should:',['Allow a generous following distance','Follow more closely because it is smaller','Share the same lane beside it','Use high beams to make it move'],0,'Motorcycles can stop quickly and are vulnerable, so leave adequate space.'],
// Signs 28
[S,'What does this sign require?', ['Come to a complete stop','Give way only','No entry','Maximum speed 60 km/h'],0,'This is a STOP sign.', 'stop'],
[S,'What does this sign mean?',['Give way / yield','Stop completely','Roadworks','No U-turn'],0,'This is a yield sign.', 'yield'],
[S,'What does this sign indicate?',['No entry from this direction','No parking','Stop ahead','One way'],0,'This sign prohibits entry from that direction.', 'noentry'],
[S,'What does this sign indicate?',['Maximum speed 60 km/h','Minimum speed 60 km/h','Recommended speed only','60 km to destination'],0,'A red-bordered speed sign shows the maximum permitted speed.', 'speed60'],
[S,'What does this warning sign indicate?',['Pedestrians may be present ahead','No pedestrians','School closed','Roadworks'],0,'This warns of pedestrians or a pedestrian crossing area.', 'pedestrian'],
[S,'What does this warning sign indicate?',['Roadworks or maintenance ahead','Pedestrian crossing','No entry','Parking area'],0,'This warns of road construction or maintenance.', 'roadworks'],
[S,'What does this sign prohibit?',['Making a U-turn','Turning left','Overtaking','Parking'],0,'The crossed U-turn symbol means U-turns are prohibited.', 'uturn'],
[S,'A triangular road sign generally warns you about:',['A hazard or condition ahead','A compulsory parking area','A motorway exit number','A fuel station only'],0,'Triangular signs are commonly used for warnings.'],
[S,'A circular regulatory sign generally communicates:',['A rule, prohibition or restriction','Tourist information only','Road surface quality','Weather information'],0,'Circular signs commonly communicate regulatory requirements or restrictions.'],
[S,'A blue information sign is most likely to provide:',['Guidance or permitted facility information','A mandatory stop','A danger warning only','A railway crossing barrier'],0,'Information signs guide road users or identify facilities and routes.'],
[S,'A solid white line separating lanes generally means:',['Lane crossing may be restricted depending on the marking and situation','Overtaking is always compulsory','Parking is compulsory','The road ends'],0,'Solid lane markings often restrict crossing and must be obeyed.'],
[S,'A broken lane line normally means:',['You may cross it when safe and legal','You must never cross it','You must stop on it','It marks a pedestrian-only lane'],0,'Broken lane markings generally permit crossing when safe.'],
[S,'Yellow road-edge markings are used to:',['Mark the edge or shoulder-related restriction area','Show the centre of every freeway','Mark pedestrian crossings only','Indicate a stop line'],0,'Yellow edge lines identify road-edge/shoulder areas and related restrictions.'],
[S,'A painted stop line tells you where to:',['Stop when a stop control or red light requires it','Start overtaking','Park permanently','Accelerate'],0,'The stop line indicates the required stopping position.'],
[S,'Chevron signs on a sharp bend are intended to:',['Guide your eyes through the change in direction','Set a speed limit','Indicate no entry','Mark a parking bay'],0,'Chevrons visually guide drivers around sharp bends.'],
[S,'A sign showing children is a warning that:',['Children may be present near a school or crossing','Children are prohibited','Only buses may enter','The road is closed'],0,'Children warning signs alert drivers to areas where children may enter the road.'],
[S,'A slippery-road warning sign means you should:',['Reduce speed and avoid harsh braking or steering','Accelerate through the area','Brake hard to test grip','Drive on the shoulder'],0,'Slippery surfaces require smoother inputs and lower speed.'],
[S,'A narrowing-road warning means:',['The usable road width reduces ahead','The road becomes a freeway','Parking begins','You must make a U-turn'],0,'This warns that the roadway narrows ahead.'],
[S,'A traffic-circle warning sign means:',['A roundabout or traffic circle is ahead','The road ends immediately','U-turns are compulsory','Traffic lights are out'],0,'Drivers should prepare for circulation and yielding rules at a roundabout.'],
[S,'A railway-crossing warning sign tells you to:',['Approach with caution and check for trains','Increase speed','Stop only if another car stops','Park on the tracks'],0,'Railway crossings require careful observation and readiness to stop.'],
[S,'A no-overtaking sign means:',['Do not overtake in the controlled section','Overtake only trucks','Overtake on the shoulder','Overtaking is compulsory'],0,'The sign prohibits overtaking for the applicable stretch.'],
[S,'A no-parking sign means:',['Parking is prohibited where the restriction applies','Stopping is always compulsory','Only motorcycles may park','Parking is free'],0,'Parking is prohibited in the controlled area.'],
[S,'A one-way sign indicates:',['Traffic must travel in the indicated direction','Traffic may travel both ways','The road is closed','Pedestrians only'],0,'One-way signs indicate the permitted direction of vehicle travel.'],
[S,'An arrow painted in a traffic lane tells you:',['The permitted or required direction from that lane','The speed limit','Where to park','Where the road ends'],0,'Lane arrows guide or control the direction of movement from a lane.'],
[S,'A pedestrian crossing marked by broad white stripes means:',['Drivers must approach cautiously and give way when required','Vehicles have absolute priority','Parking is permitted on the crossing','Pedestrians are prohibited'],0,'Marked crossings are designed to provide safer pedestrian movement.'],
[S,'Temporary roadwork signs must be:',['Obeyed while they apply','Ignored if you know the road','Followed only by trucks','Used as suggestions only'],0,'Temporary traffic control signs have legal and safety importance while in force.'],
[S,'A hazard-marker board is used to:',['Highlight an obstruction or change in road alignment','Set the speed limit','Mark a bus stop only','Show a petrol station'],0,'Hazard markers make physical hazards and alignment changes more visible.'],
[S,'If a road sign conflicts with a police officer directing traffic, you should:',['Follow the lawful directions of the officer','Ignore the officer','Follow the sign only','Stop and refuse to move'],0,'Lawful traffic directions from an authorised officer take priority.'],
// Controls 8
[C,'Which control is normally used to slow or stop the vehicle?',['Brake pedal','Accelerator','Clutch only','Indicator stalk'],0,'The brake pedal reduces speed and stops the vehicle.'],
[C,'Which pedal controls engine power and vehicle acceleration?',['Accelerator pedal','Brake pedal','Clutch pedal','Parking brake'],0,'The accelerator controls engine power and acceleration.'],
[C,'In a manual vehicle, the clutch pedal is used to:',['Engage or disengage engine drive while changing gear or stopping','Operate the headlights','Apply the parking brake','Wash the windscreen'],0,'The clutch temporarily disconnects engine drive from the gearbox.'],
[C,'The parking brake is mainly used to:',['Secure a stationary vehicle','Increase engine speed','Change lanes','Operate indicators'],0,'The parking brake helps keep the vehicle stationary when parked.'],
[C,'The indicator control is used to:',['Communicate an intended turn or lane change','Increase speed','Stop the engine','Adjust the seat'],0,'Indicators communicate intended direction changes to other road users.'],
[C,'The rear-view and side mirrors are used to:',['Monitor traffic around and behind the vehicle','Measure fuel level','Control speed','Apply brakes'],0,'Mirrors support observation but do not replace blind-spot checks.'],
[C,'The steering wheel is used to:',['Control the vehicle direction','Operate the clutch','Change engine oil','Apply the parking brake'],0,'Steering controls the vehicle direction.'],
[C,'The windscreen wiper control is used to:',['Clear rain or moisture from the windscreen','Increase tyre pressure','Operate the horn','Change gears'],0,'Wipers help maintain visibility in rain or spray.']
];

function shuffle(array) {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function prepareQuestions() {
  return shuffle(
    QUESTION_BANK.map((sourceQ, id) => {
      const options = [...sourceQ[2]];
      const correctText = options[sourceQ[3]];
      const shuffledOptions = shuffle(options);
      return {
        id,
        section: sourceQ[0],
        question: sourceQ[1],
        options: shuffledOptions,
        correct: shuffledOptions.indexOf(correctText),
        explanation: sourceQ[4],
        sign: sourceQ[5] || null,
        scenario: sourceQ[6] || null,
      };
    })
  );
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function getMistakePracticeDuration(questionCount) {
  const secondsFromCount = questionCount * 60;
  return Math.min(3600, Math.max(600, secondsFromCount));
}

function K53Test({ onExit, focusCategory = null, focusMistakes = [], licenceCode = "CODE_2" }) {
  const licenceLabels = {
    CODE_1: "Code 1 · Motorcycle",
    CODE_2: "Code 2 · Light motor vehicle",
    CODE_3: "Code 3 · Heavy motor vehicle",
  };
  const licenceLabel = licenceLabels[licenceCode] || licenceLabels.CODE_2;
  const normalizedFocus = focusCategory ? focusCategory.trim() : null;
  const normalizedMistakes = Array.isArray(focusMistakes) ? focusMistakes.filter(Boolean) : [];
  const mistakeKey = normalizedMistakes.map((value) => String(value).trim()).join("||");
  const isMistakePractice = normalizedMistakes.length > 0;

  const [questionBank, setQuestionBank] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(true);
  const [questionsError, setQuestionsError] = useState("");

  useEffect(() => {
    let active = true;

    const loadQuestions = async () => {
      setQuestionsLoading(true);
      setQuestionsError("");

      const { data, error } = await supabase
        .from("k53_questions")
        .select("question_code,section,question_text,option_a,option_b,option_c,option_d,correct_option,explanation,visual_asset_id,visual_type,status")
        .like("status", "APPROVED%")
        .order("question_code", { ascending: true });

      if (!active) return;

      if (error) {
        setQuestionsError(error.message || "Unable to load the K53 question bank.");
        setQuestionsLoading(false);
        return;
      }

      const converted = (data || []).map((row) => {
        const sourceOptions = [row.option_a, row.option_b, row.option_c, row.option_d];
        const correctIndex = Math.max(0, "ABCD".indexOf(row.correct_option));
        const correctText = sourceOptions[correctIndex];
        const shuffledOptions = shuffle(sourceOptions);

        return {
          id: row.question_code,
          section: row.section,
          question: row.question_text,
          options: shuffledOptions,
          correct: shuffledOptions.indexOf(correctText),
          explanation: row.explanation || "",
          sign: null,
          scenario: null,
          visualAssetId: row.visual_asset_id || null,
          visualType: row.visual_type || null,
        };
      });

      setQuestionBank(converted);
      setQuestionsLoading(false);
    };

    loadQuestions();
    return () => { active = false; };
  }, []);

  const questions = useMemo(() => {
    if (!questionBank.length) return [];

    if (normalizedMistakes.length > 0) {
      const mistakeSet = new Set(normalizedMistakes.map((value) => String(value).trim()));
      return shuffle(questionBank.filter((question) => mistakeSet.has(question.question.trim())));
    }

    const categoryMap = {
      "Rules of the Road": R,
      "Road Traffic Signs": S,
      "Vehicle Controls": C,
    };

    const pick = (section, count) =>
      shuffle(questionBank.filter((question) => question.section === section)).slice(0, count);

    if (normalizedFocus) {
      const matchedSection = categoryMap[normalizedFocus] || normalizedFocus;
      const sectionQuestionCount = {
        [R]: 28,
        [S]: 28,
        [C]: 8,
      };

      return pick(matchedSection, sectionQuestionCount[matchedSection] || 28);
    }

    return shuffle([
      ...pick(R, 28),
      ...pick(S, 28),
      ...pick(C, 8),
    ]);
  }, [questionBank, normalizedFocus, mistakeKey]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(() => Array(questions.length).fill(null));
  const [flags, setFlags] = useState(() => Array(questions.length).fill(false));
  const initialSeconds = isMistakePractice
    ? getMistakePracticeDuration(normalizedMistakes.length)
    : 3600;
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds);
  const [submitted, setSubmitted] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    setCurrent(0);
    setAnswers(Array(questions.length).fill(null));
    setFlags(Array(questions.length).fill(false));
    setSecondsLeft(isMistakePractice ? getMistakePracticeDuration(questions.length) : 3600);
    setSubmitted(false);
    setShowReview(false);
  }, [questions, isMistakePractice]);

  const saveCurrentResult = async () => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      return sessionError.message || "Unable to read your current session.";
    }

    const user = session?.user ?? null;
    if (!user) {
      return "You must be signed in to save this test result.";
    }

    const resultToSave = {
      user_id: user.id,
      rules_score: sectionResults[R].correct,
      signs_score: sectionResults[S].correct,
      controls_score: sectionResults[C].correct,
      total_score: totalScore,
      passed,
    };

    const { data: insertedRows, error } = await supabase
      .from("test_results")
      .insert([resultToSave])
      .select();

    if (error) {
      return error.message || "Unable to save your test result.";
    }

    const insertedResult = insertedRows?.[0];
    if (!insertedResult?.id) {
      return "Main result saved, but the result id was not returned.";
    }

    const detailRows = questions
      .map((question, index) => {
        const selectedAnswer = answers[index];
        const isMissingOrWrong = selectedAnswer === null || selectedAnswer !== question.correct;

        if (!isMissingOrWrong) {
          return null;
        }

        return {
          result_id: insertedResult.id,
          user_id: user.id,
          question_text: question.question,
          category: question.section,
          learner_answer: selectedAnswer === null ? null : question.options[selectedAnswer],
          correct_answer: question.options[question.correct],
          explanation: question.explanation,
        };
      })
      .filter(Boolean);

    if (detailRows.length === 0) {
      return null;
    }

    const { error: detailError } = await supabase
      .from("test_result_details")
      .insert(detailRows);

    if (detailError) {
      return `Main test result saved, but detailed mistake data could not be saved: ${detailError.message}`;
    }

    return null;
  };

  const finalizeSubmission = async () => {
    const resultError = await saveCurrentResult();
    if (resultError) {
      setSaveError(resultError);
    } else {
      setSaveError("");
    }
    setSubmitted(true);
  };

  useEffect(() => {
    if (submitted || questionsLoading || questions.length === 0) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => {
        if (value <= 1) {
          window.clearInterval(timer);
          finalizeSubmission();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [submitted, questionsLoading, questions.length]);

  const totalQuestions = questions.length;
  const question = questions[current];
  const answeredCount = answers.filter((a) => a !== null).length;

  const sectionResults = {
    [R]: { correct: 0, total: 28, target: 22 },
    [S]: { correct: 0, total: 28, target: 23 },
    [C]: { correct: 0, total: 8, target: 6 },
  };

  const activeSectionResults = normalizedFocus
    ? Object.fromEntries(
        Object.entries(sectionResults).filter(([section]) => {
          const focusMap = {
            "Rules of the Road": R,
            "Road Traffic Signs": S,
            "Vehicle Controls": C,
          };
          return section === (focusMap[normalizedFocus] || normalizedFocus);
        })
      )
    : sectionResults;

  let totalScore = 0;
  const mistakeSectionStats = {};

  questions.forEach((item, index) => {
    if (answers[index] === item.correct) {
      totalScore += 1;
      if (isMistakePractice) {
        mistakeSectionStats[item.section] ??= { correct: 0, total: 0 };
        mistakeSectionStats[item.section].correct += 1;
      } else if (activeSectionResults[item.section]) {
        activeSectionResults[item.section].correct += 1;
      }
    }

    if (isMistakePractice) {
      mistakeSectionStats[item.section] ??= { correct: 0, total: 0 };
      mistakeSectionStats[item.section].total += 1;
    }
  });

  const resultSectionSummary = isMistakePractice
    ? Object.fromEntries(
        Object.entries(mistakeSectionStats).map(([section, result]) => [
          section,
          { ...result, target: result.total },
        ])
      )
    : activeSectionResults;

  const passed = isMistakePractice
    ? true
    : Object.values(activeSectionResults).every(
        (result) => result.correct >= result.target
      );

  const chooseAnswer = (index) => {
    const updated = [...answers];
    updated[current] = index;
    setAnswers(updated);
  };

  const toggleFlag = () => {
    const updated = [...flags];
    updated[current] = !updated[current];
    setFlags(updated);
  };

  const submitTest = async () => {
    const unanswered = answers.filter((a) => a === null).length;
    const message = unanswered
      ? `You still have ${unanswered} unanswered question(s). Submit anyway?`
      : "Submit your completed test?";

    if (!window.confirm(message)) return;
    await finalizeSubmission();
  };

  const restartTest = () => window.location.reload();

  if (questionsLoading) {
    return (
      <section style={{ minHeight: "100vh", background: "#08111f", color: "#f8fafc", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ textAlign: "center" }}>
          <h2>Loading K53 question bank…</h2>
          <p style={{ color: "#94a3b8" }}>Connecting to the live Supabase database.</p>
        </div>
      </section>
    );
  }

  if (questionsError || questions.length === 0) {
    return (
      <section style={{ minHeight: "100vh", background: "#08111f", color: "#f8fafc", display: "grid", placeItems: "center", padding: 24 }}>
        <div style={{ maxWidth: 620, textAlign: "center" }}>
          <h2>Question bank unavailable</h2>
          <p style={{ color: "#fca5a5" }}>{questionsError || "No matching questions were found."}</p>
          <button onClick={onExit} style={{ border: 0, background: "#22c55e", color: "#052e16", borderRadius: 11, padding: "11px 18px", fontWeight: 900, cursor: "pointer" }}>Back to Home</button>
        </div>
      </section>
    );
  }

  const visual = question.sign
    ? signSVG[question.sign]
    : question.scenario
      ? scenario(question.scenario)
      : "";

  const styles = {
    page: { height: "100vh", background: "#08111f", color: "#f8fafc", padding: "18px 5%", overflow: "hidden", boxSizing: "border-box", display: "grid", placeItems: "center" },
    shell: { width: "100%", maxWidth: 1100, height: "100%", margin: "0 auto", minHeight: 0, display: "grid", gridTemplateRows: "auto minmax(0, 1fr)", gap: 12 },
    testPage: { height: "100vh", background: "#08111f", color: "#f8fafc", padding: "12px 18px", overflow: "hidden", boxSizing: "border-box" },
    testShell: { width: "100%", maxWidth: 1360, height: "100%", margin: "0 auto", display: "grid", gridTemplateRows: "auto auto minmax(0, 1fr) auto", gap: 10 },
    testCard: { minHeight: 0, background: "#111827", border: "1px solid #334155", borderRadius: 18, padding: 18, display: "grid", gridTemplateColumns: "minmax(0, 1.08fr) minmax(360px, .92fr)", gap: 20, overflow: "hidden" },
    questionPane: { minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column" },
    answerPane: { minWidth: 0, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "center" },
    compactMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 8 },
    visualStage: { flex: 1, minHeight: 0, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: 14, background: "#0b1424", border: "1px solid #263449", padding: 10 },
    footerNav: { display: "grid", gridTemplateColumns: "repeat(16, 30px)", gap: 4, justifyContent: "center", alignContent: "center" },
    header: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "nowrap", marginBottom: 0 },
    eyebrow: { margin: 0, color: "#86efac", fontSize: 12, fontWeight: 800, letterSpacing: ".1em" },
    heading: { margin: "2px 0 0", fontSize: 22 },
    timerRow: { display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" },
    exit: { border: "1px solid #475569", background: "#111827", color: "white", borderRadius: 11, padding: "11px 16px", fontWeight: 800, cursor: "pointer" },
    progressTrack: { height: 7, background: "#1e293b", borderRadius: 999, overflow: "hidden", marginBottom: 0 },
    progressFill: { height: "100%", background: "#22c55e", width: `${((current + 1) / totalQuestions) * 100}%` },
    answered: { color: "#94a3b8", marginBottom: 0, fontSize: 13 },
    card: { background: "#111827", border: "1px solid #334155", borderRadius: 18, padding: 24 },
    badge: { display: "inline-block", color: "#86efac", background: "#052e16", borderRadius: 999, padding: "6px 10px", fontSize: 12, fontWeight: 800 },
    question: { fontSize: 22, lineHeight: 1.3, margin: "10px 0 12px" },
    visualBox: { width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "hidden" },
    answers: { display: "grid", gap: 10, width: "100%" },
    answer: { width: "100%", minHeight: 54, display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "2px solid #334155", borderRadius: 12, background: "#1f2937", color: "white", textAlign: "left", fontSize: 15, cursor: "pointer" },
    answerSelected: { borderColor: "#22c55e", background: "#0d2818" },
    letter: { width: 32, height: 32, flexShrink: 0, display: "grid", placeItems: "center", borderRadius: 8, background: "#0f172a", fontWeight: 900 },
    actions: { display: "flex", gap: 8, flexWrap: "nowrap", marginTop: 14 },
    secondary: { border: "1px solid #475569", background: "#111827", color: "white", borderRadius: 11, padding: "11px 16px", fontWeight: 800, cursor: "pointer" },
    primary: { border: 0, background: "#22c55e", color: "#052e16", borderRadius: 11, padding: "11px 18px", fontWeight: 900, cursor: "pointer" },
    navigator: { display: "grid", gridTemplateColumns: "repeat(16, 30px)", gap: 4, justifyContent: "center", width: "100%" },
    navButton: { width: 30, height: 26, minWidth: 30, minHeight: 26, padding: 0, borderRadius: 6, color: "white", fontSize: 11, fontWeight: 800, cursor: "pointer" },
    resultCard: { width: "min(820px, 100%)", maxHeight: "calc(100vh - 36px)", margin: 0, background: "#111827", border: "1px solid #334155", borderRadius: 20, padding: "22px 28px", textAlign: "center", boxSizing: "border-box", overflow: "hidden" },
    sections: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: 12, marginTop: 16 },
    sectionCard: { border: "1px solid #334155", borderRadius: 14, padding: 14, background: "#0f172a", textAlign: "left" },
    reviewList: { minHeight: 0, overflowY: "auto", display: "grid", gap: 12, paddingRight: 6, alignContent: "start" },
  };

  if (submitted && showReview) {
    const mistakes = questions
      .map((item, index) => ({ item, index, selected: answers[index] }))
      .filter(({ item, selected }) => selected !== item.correct);

    return (
      <section style={styles.page}>
        <div style={styles.shell}>
          <div style={styles.header}>
            <div>
              <p style={styles.eyebrow}>MISTAKE REVIEW</p>
              <h2 style={styles.heading}>{mistakes.length ? `${mistakes.length} question(s) to review` : "Perfect score"}</h2>
            </div>
            <button style={styles.secondary} onClick={() => setShowReview(false)}>Back to Results</button>
          </div>

          <div style={styles.reviewList}>
            {mistakes.length === 0 ? (
              <div style={styles.card}><h3>No mistakes to review.</h3></div>
            ) : mistakes.map(({ item, index, selected }) => (
              <div style={styles.card} key={item.id}>
                <span style={styles.badge}>{item.section}</span>
                <h3 style={styles.question}>Question {index + 1}: {item.question}</h3>
                <p style={{ color: "#fca5a5" }}><strong>Your answer:</strong> {selected === null ? "Not answered" : item.options[selected]}</p>
                <p style={{ color: "#86efac" }}><strong>Correct answer:</strong> {item.options[item.correct]}</p>
                <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>{item.explanation}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (submitted) {
    return (
      <section style={styles.page}>
        <div style={styles.resultCard}>
          <p style={styles.eyebrow}>{isMistakePractice ? "PRACTICE MY MISTAKES" : "COMPLETE K53 PRACTICE RESULT"}</p>
          <h2 style={{ fontSize: 32, margin: "10px 0 6px", color: passed ? "#86efac" : "#fca5a5" }}>
            {isMistakePractice ? "PRACTICE COMPLETE" : passed ? "PASS" : "NOT YET"}
          </h2>
          <div style={{ fontSize: 50, lineHeight: 1, fontWeight: 900, color: "#86efac" }}>{totalScore}/{totalQuestions}</div>
          <p style={{ color: "#cbd5e1", lineHeight: 1.6 }}>
            {isMistakePractice
              ? `You completed ${totalScore}/${totalQuestions} in this focused mistake-practice set.`
              : passed
                ? "You met all three section targets in this practice test."
                : "One or more section targets were missed. Review your mistakes and practise the weaker area."}
          </p>

          {saveError && (
            <div style={{ marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "rgba(127, 29, 29, 0.28)", border: "1px solid rgba(248, 113, 113, 0.5)", color: "#fecaca", fontWeight: 700 }}>
              {saveError}
            </div>
          )}

          <div style={styles.sections}>
            {Object.entries(resultSectionSummary).map(([section, result]) => (
              <div key={section} style={styles.sectionCard}>
                <small style={{ color: "#94a3b8" }}>{section}</small>
                <strong style={{ display: "block", fontSize: 28, margin: "8px 0" }}>{result.correct}/{result.total}</strong>
                <span style={{ color: isMistakePractice ? "#86efac" : result.correct >= result.target ? "#86efac" : "#fca5a5" }}>
                  {isMistakePractice
                    ? `Score ${result.correct}/${result.total}`
                    : `Target ${result.target}/${result.total} — ${result.correct >= result.target ? "Pass" : "Needs work"}`}
                </span>
              </div>
            ))}
          </div>

          <div style={{ ...styles.actions, justifyContent: "center", marginTop: 18 }}>
            <button style={styles.primary} onClick={() => setShowReview(true)}>Review Mistakes</button>
            <button style={styles.secondary} onClick={restartTest}>New Test</button>
            <button style={styles.secondary} onClick={onExit}>Back to Home</button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={styles.testPage}>
      <div style={styles.testShell}>
        <div style={styles.header}>
          <div>
            <p style={styles.eyebrow}>
              {isMistakePractice
                ? "PRACTICE MY MISTAKES"
                : normalizedFocus
                  ? `${totalQuestions}-QUESTION ${normalizedFocus.toUpperCase()} PRACTICE`
                  : "FULL 64-QUESTION PRACTICE"}
            </p>
            <h2 style={styles.heading}>Question {current + 1} of {totalQuestions}</h2>
            <span style={{ color: "#94a3b8", fontSize: 12 }}>{licenceLabel}</span>
          </div>
          <div style={styles.timerRow}>
            <span style={styles.answered}>Answered {answeredCount}/{totalQuestions}</span>
            <strong style={{ color: secondsLeft <= 300 ? "#fca5a5" : "#86efac" }}>⏱ {formatTime(secondsLeft)}</strong>
            <button style={styles.exit} onClick={onExit}>Exit Test</button>
          </div>
        </div>

        <div style={styles.progressTrack}><div style={styles.progressFill} /></div>

        <div style={styles.testCard}>
          <div style={styles.questionPane}>
            <div style={styles.compactMeta}>
              <span style={styles.badge}>{question.section}</span>
              <span style={{ color: "#94a3b8", fontSize: 12 }}>{question.id}</span>
            </div>

            <h3 style={styles.question}>{question.question}</h3>

            <div style={styles.visualStage}>
              {visual ? (
                <div
                  style={styles.visualBox}
                  dangerouslySetInnerHTML={{ __html: visual }}
                />
              ) : (
                <K53Visual
                  visualAssetId={question.visualAssetId}
                  visualType={question.visualType}
                  questionText={question.question}
                />
              )}
            </div>
          </div>

          <div style={styles.answerPane}>
            <div style={styles.answers}>
              {question.options.map((option, index) => (
                <button
                  key={`${question.id}-${index}`}
                  style={{ ...styles.answer, ...(answers[current] === index ? styles.answerSelected : {}) }}
                  onClick={() => chooseAnswer(index)}
                >
                  <span style={styles.letter}>{String.fromCharCode(65 + index)}</span>
                  <span>{option}</span>
                </button>
              ))}
            </div>

            <div style={styles.actions}>
              <button
                style={{ ...styles.secondary, flex: 1, opacity: current === 0 ? 0.45 : 1 }}
                disabled={current === 0}
                onClick={() => setCurrent(current - 1)}
              >
                Previous
              </button>
              <button style={{ ...styles.secondary, flex: 1 }} onClick={toggleFlag}>
                {flags[current] ? "⚑ Flagged" : "⚑ Flag"}
              </button>
              {current === questions.length - 1 ? (
                <button style={{ ...styles.primary, flex: 1 }} onClick={submitTest}>Submit</button>
              ) : (
                <button style={{ ...styles.primary, flex: 1 }} onClick={() => setCurrent(current + 1)}>Next</button>
              )}
            </div>
          </div>
        </div>

        <div style={styles.footerNav}>
          {questions.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setCurrent(index)}
              title={flags[index] ? "Flagged" : answers[index] !== null ? "Answered" : "Unanswered"}
              style={{
                ...styles.navButton,
                border: index === current ? "2px solid #38bdf8" : "1px solid #334155",
                background: flags[index] ? "#78350f" : answers[index] !== null ? "#14532d" : "#1e293b",
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default K53Test;
