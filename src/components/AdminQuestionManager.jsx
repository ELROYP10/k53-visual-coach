import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

const EMPTY = {
  question_code: "", section: "Rules of the Road", question_text: "",
  option_a: "", option_b: "", option_c: "", option_d: "",
  correct_option: "A", explanation: "", visual_asset_id: "", visual_type: "none", status: "DRAFT",
};

export default function AdminQuestionManager({ onBack, onAnalytics }) {
  const [questions, setQuestions] = useState([]);
  const [form, setForm] = useState(EMPTY);
  const [editingCode, setEditingCode] = useState(null);
  const [query, setQuery] = useState("");
  const [section, setSection] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const loadQuestions = useCallback(async () => {
    setLoading(true); setError("");
    const { data, error: loadError } = await supabase.from("k53_questions").select("question_code,section,question_text,option_a,option_b,option_c,option_d,correct_option,explanation,visual_asset_id,visual_type,status").order("question_code");
    if (loadError) setError(loadError.message || "Unable to load questions.");
    else setQuestions(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { loadQuestions(); }, [loadQuestions]);

  const filtered = useMemo(() => questions.filter((item) => {
    const matchesSection = section === "All" || item.section === section;
    const text = `${item.question_code} ${item.question_text}`.toLowerCase();
    return matchesSection && text.includes(query.trim().toLowerCase());
  }), [questions, query, section]);

  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const reset = () => { setForm(EMPTY); setEditingCode(null); setNotice(""); setError(""); };
  const edit = (item) => { setForm({ ...EMPTY, ...item, visual_asset_id: item.visual_asset_id || "", visual_type: item.visual_type || "none" }); setEditingCode(item.question_code); setNotice(""); setError(""); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const save = async (event) => {
    event.preventDefault(); setSaving(true); setNotice(""); setError("");
    const payload = { ...form, question_code: form.question_code.trim().toUpperCase(), question_text: form.question_text.trim(), explanation: form.explanation.trim(), visual_asset_id: form.visual_asset_id.trim() || null, visual_type: form.visual_type || "none" };
    const operation = editingCode
      ? supabase.from("k53_questions").update(payload).eq("question_code", editingCode)
      : supabase.from("k53_questions").insert(payload);
    const { error: saveError } = await operation;
    if (saveError) setError(saveError.message || "Unable to save the question.");
    else { setNotice(payload.status.startsWith("APPROVED") ? "Question published to the live test bank." : "Draft saved."); await loadQuestions(); setForm(EMPTY); setEditingCode(null); }
    setSaving(false);
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.question_code}? This cannot be undone.`)) return;
    const { error: deleteError } = await supabase.from("k53_questions").delete().eq("question_code", item.question_code);
    if (deleteError) setError(deleteError.message || "Unable to delete the question.");
    else { setNotice("Question deleted."); await loadQuestions(); }
  };

  return <div className="admin-page">
    <style>{`
      .admin-page{min-height:100vh;padding:24px;background:#071812;color:#ecfdf5;font-family:Inter,"Segoe UI",sans-serif}.admin-shell{max-width:1380px;margin:auto}.admin-head{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-bottom:18px}.admin-head h1{margin:0;font-size:clamp(1.6rem,3vw,2.4rem)}.admin-back,.admin-btn{border:1px solid #315e50;border-radius:11px;background:#0b2a22;color:#ecfdf5;padding:10px 15px;font-weight:800;cursor:pointer}.admin-grid{display:grid;grid-template-columns:minmax(360px,.82fr) minmax(0,1.18fr);gap:18px}.admin-card{border:1px solid rgba(110,231,183,.22);border-radius:18px;background:#0a251e;padding:20px;box-shadow:0 18px 45px rgba(0,0,0,.2)}.admin-card h2{margin:0 0 16px}.admin-form{display:grid;gap:11px}.admin-row{display:grid;grid-template-columns:1fr 1fr;gap:10px}.admin-form label{display:grid;gap:5px;color:#a7f3d0;font-size:.72rem;font-weight:800;letter-spacing:.04em}.admin-form input,.admin-form textarea,.admin-form select,.admin-filter input,.admin-filter select{width:100%;border:1px solid #315e50;border-radius:10px;background:#071d18;color:#f0fdf4;padding:10px;font:inherit}.admin-form textarea{min-height:68px;resize:vertical}.admin-actions{display:flex;gap:9px}.admin-save{flex:1;border:0;background:#22c55e;color:#052e16}.admin-cancel{background:transparent}.admin-notice{margin:0;color:#86efac;font-size:.8rem}.admin-error{margin:0;color:#fca5a5;font-size:.8rem}.admin-filter{display:grid;grid-template-columns:1fr 190px;gap:10px;margin-bottom:14px}.admin-stats{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:14px}.admin-stat{padding:6px 9px;border:1px solid rgba(110,231,183,.18);border-radius:999px;color:#a7f3d0;font-size:.7rem}.admin-list{display:grid;gap:9px;max-height:calc(100vh - 205px);overflow:auto;padding-right:4px}.admin-item{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;padding:12px;border:1px solid rgba(110,231,183,.15);border-radius:12px;background:rgba(255,255,255,.018)}.admin-item h3{margin:4px 0 5px;font-size:.88rem;line-height:1.35}.admin-code{color:#6ee7b7;font-size:.68rem;font-weight:900}.admin-status{font-size:.62rem;color:#fde68a}.admin-item-actions{display:flex;gap:6px;align-items:center}.admin-item-actions button{border:1px solid #315e50;border-radius:8px;background:#0c3128;color:#ecfdf5;padding:7px 9px;cursor:pointer}.admin-item-actions .delete{color:#fecaca;border-color:rgba(248,113,113,.3)}@media(max-width:850px){.admin-grid{grid-template-columns:1fr}.admin-list{max-height:none}.admin-filter,.admin-row{grid-template-columns:1fr}}
    `}</style>
    <div className="admin-shell">
      <header className="admin-head"><div><small>SECURE OWNER TOOL</small><h1>Admin Question Manager</h1></div><div className="admin-actions"><button className="admin-back" onClick={onAnalytics}>Business Analytics</button><button className="admin-back" onClick={onBack}>← Dashboard</button></div></header>
      <div className="admin-grid">
        <section className="admin-card"><h2>{editingCode ? `Edit ${editingCode}` : "Add question"}</h2><form className="admin-form" onSubmit={save}>
          <div className="admin-row"><label>Question code<input required value={form.question_code} disabled={Boolean(editingCode)} onChange={(e)=>update("question_code",e.target.value)} placeholder="R-101" /></label><label>Section<select value={form.section} onChange={(e)=>update("section",e.target.value)}><option>Rules of the Road</option><option>Road Traffic Signs</option><option>Vehicle Controls</option></select></label></div>
          <label>Question<textarea required value={form.question_text} onChange={(e)=>update("question_text",e.target.value)} /></label>
          {["a","b","c","d"].map((letter)=><label key={letter}>Option {letter.toUpperCase()}<input required value={form[`option_${letter}`]} onChange={(e)=>update(`option_${letter}`,e.target.value)} /></label>)}
          <div className="admin-row"><label>Correct answer<select value={form.correct_option} onChange={(e)=>update("correct_option",e.target.value)}>{["A","B","C","D"].map(x=><option key={x}>{x}</option>)}</select></label><label>Status<select value={form.status} onChange={(e)=>update("status",e.target.value)}><option value="DRAFT">Draft</option><option value="APPROVED">Approved — publish</option></select></label></div>
          <label>Explanation<textarea required value={form.explanation} onChange={(e)=>update("explanation",e.target.value)} /></label>
          <div className="admin-row"><label>Visual asset ID<input value={form.visual_asset_id} onChange={(e)=>update("visual_asset_id",e.target.value)} placeholder="Optional" /></label><label>Visual type<select value={form.visual_type} onChange={(e)=>update("visual_type",e.target.value)}><option value="none">None</option><option value="regulatory_sign">Regulatory sign</option><option value="warning_sign">Warning sign</option><option value="guidance_sign">Guidance sign</option><option value="road_marking">Road marking</option><option value="road_scene">Road scene</option></select></label></div>
          {notice&&<p className="admin-notice">✓ {notice}</p>}{error&&<p className="admin-error">{error}</p>}
          <div className="admin-actions"><button className="admin-btn admin-save" disabled={saving}>{saving?"Saving…":form.status==="APPROVED"?"Save and publish":"Save draft"}</button>{editingCode&&<button type="button" className="admin-btn admin-cancel" onClick={reset}>Cancel</button>}</div>
        </form></section>
        <section className="admin-card"><h2>Question bank</h2><div className="admin-stats"><span className="admin-stat">{questions.length} total</span><span className="admin-stat">{questions.filter(q=>q.status?.startsWith("APPROVED")).length} published</span><span className="admin-stat">{questions.filter(q=>!q.status?.startsWith("APPROVED")).length} drafts</span></div><div className="admin-filter"><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="Search code or question…"/><select value={section} onChange={(e)=>setSection(e.target.value)}><option>All</option><option>Rules of the Road</option><option>Road Traffic Signs</option><option>Vehicle Controls</option></select></div>
          <div className="admin-list">{loading?<p>Loading questions…</p>:filtered.length===0?<p>No matching questions.</p>:filtered.map(item=><article className="admin-item" key={item.question_code}><div><span className="admin-code">{item.question_code} · {item.section}</span><h3>{item.question_text}</h3><span className="admin-status">{item.status?.startsWith("APPROVED")?"● LIVE":"○ DRAFT"}</span></div><div className="admin-item-actions"><button onClick={()=>edit(item)}>Edit</button><button className="delete" onClick={()=>remove(item)}>Delete</button></div></article>)}</div>
        </section>
      </div>
    </div>
  </div>;
}
