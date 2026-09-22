import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const CHALLENGES = [
  { q: "What must you do at a stop sign?", options: ["Come to a complete stop", "Only slow down", "Sound the horn", "Stop only when traffic is visible"], correct: 0, explanation: "A stop sign requires a complete stop before proceeding when safe." },
  { q: "What does a broken lane line normally mean?", options: ["You may cross when safe and legal", "You may never cross", "Parking is compulsory", "The lane is for pedestrians"], correct: 0, explanation: "A broken line may be crossed only when it is safe and lawful." },
  { q: "Before moving off from the roadside, what should you do?", options: ["Check mirrors and blind spot", "Move immediately", "Only check ahead", "Sound the horn"], correct: 0, explanation: "Observe all around, signal when needed, and move only when safe." },
  { q: "Which pedal slows or stops a vehicle?", options: ["Brake", "Accelerator", "Clutch", "Parking brake lever"], correct: 0, explanation: "The brake pedal controls normal slowing and stopping." },
  { q: "A triangular road sign generally warns of what?", options: ["A hazard ahead", "A parking area", "A route number", "A fuel station"], correct: 0, explanation: "Triangular signs generally warn drivers about hazards or changing conditions." },
  { q: "When visibility is reduced by fog, what is safest?", options: ["Slow down and use appropriate lights", "Use high beams continuously", "Follow closely", "Maintain normal speed"], correct: 0, explanation: "Reduce speed, increase following distance, and use appropriate lights." },
  { q: "Who should wear a seat belt where one is fitted?", options: ["Every occupant", "Only the driver", "Only front passengers", "Only children"], correct: 0, explanation: "Every occupant should use an available seat belt." },
];

const zaDateKey = () => new Intl.DateTimeFormat("en-CA", {
  timeZone: "Africa/Johannesburg", year: "numeric", month: "2-digit", day: "2-digit",
}).format(new Date());

const mondayKey = () => {
  const now = new Date();
  const za = new Date(now.toLocaleString("en-US", { timeZone: "Africa/Johannesburg" }));
  const day = za.getDay() || 7;
  za.setDate(za.getDate() - day + 1);
  za.setHours(0, 0, 0, 0);
  return za.toISOString();
};

export default function DailyChallenge({ user, onCompleted = () => {} }) {
  const dayKey = zaDateKey();
  const challenge = useMemo(() => {
    const seed = [...dayKey].reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return CHALLENGES[seed % CHALLENGES.length];
  }, [dayKey]);
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!user?.id) return;
    const [{ data: own }, { data: leaders }] = await Promise.all([
      supabase.from("daily_challenge_results").select("*").eq("user_id", user.id).eq("challenge_date", dayKey).maybeSingle(),
      supabase.from("daily_challenge_results").select("user_id,display_name,xp_earned,correct,completed_at").gte("completed_at", mondayKey()).order("xp_earned", { ascending: false }).order("completed_at", { ascending: true }).limit(30),
    ]);
    setCompleted(own || null);
    const ranked = new Map();
    (leaders || []).forEach((row) => {
      const current = ranked.get(row.user_id) || { name: row.display_name || "K53 Learner", xp: 0, correct: 0 };
      current.xp += Number(row.xp_earned || 0);
      current.correct += row.correct ? 1 : 0;
      ranked.set(row.user_id, current);
    });
    setLeaderboard([...ranked.values()].sort((a, b) => b.xp - a.xp || b.correct - a.correct).slice(0, 5));
  }, [user?.id, dayKey]);

  useEffect(() => { load(); }, [load]);

  const submit = async () => {
    if (selected === null || saving || completed) return;
    setSaving(true);
    setError("");
    const correct = selected === challenge.correct;
    const xp = correct ? 75 : 25;
    const alias = `Learner ${String(user.id).slice(0, 4).toUpperCase()}`;
    const { data, error: saveError } = await supabase.from("daily_challenge_results").insert({
      user_id: user.id, challenge_date: dayKey, question_key: challenge.q, correct, xp_earned: xp, display_name: alias,
    }).select("*").single();
    if (saveError) setError(saveError.message || "Could not save your challenge.");
    else { setCompleted(data); onCompleted(data); await load(); }
    setSaving(false);
  };

  const answered = Boolean(completed);
  return (
    <section className="daily-challenge">
      <div className="daily-title"><div><span>DAILY CHALLENGE</span><h3>{answered ? "Challenge complete" : "Earn up to 75 XP"}</h3></div><b>⚡ {completed?.xp_earned || 75} XP</b></div>
      <p className="daily-question">{challenge.q}</p>
      <div className="daily-options">
        {challenge.options.map((option, index) => (
          <button key={option} type="button" disabled={answered} className={`${selected === index ? "selected" : ""}${answered && index === challenge.correct ? " correct" : ""}`} onClick={() => setSelected(index)}>{option}</button>
        ))}
      </div>
      {!answered ? <button className="daily-submit" type="button" disabled={selected === null || saving} onClick={submit}>{saving ? "Saving…" : "Submit answer"}</button> : <p className="daily-result">{completed.correct ? "✅ Correct — full XP earned." : "📘 Completed — keep learning."} {challenge.explanation}</p>}
      {error && <p className="daily-error">{error}</p>}
      <div className="leaderboard"><strong>🏆 This week</strong>{leaderboard.length ? leaderboard.map((entry, index) => <div key={`${entry.name}-${index}`}><span>{index + 1}. {entry.name}</span><b>{entry.xp} XP</b></div>) : <small>Complete today’s challenge to enter the leaderboard.</small>}</div>
    </section>
  );
}
