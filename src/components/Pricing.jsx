const PLANS = [
  {
    id: "standard",
    name: "Premium 30",
    price: 79,
    days: 30,
    description: "Focused preparation for your upcoming learner's test.",
    features: [
      "Full learning dashboard",
      "Saved test history and readiness score",
      "Weak-area and mistake practice",
      "All licence categories and visual questions",
    ],
  },
  {
    id: "premium",
    name: "Premium 90",
    price: 129,
    days: 90,
    badge: "BEST VALUE",
    description: "More time to practise, improve and prepare with confidence.",
    features: [
      "Everything in Premium 30",
      "Three months of full access",
      "Best value for steady preparation",
      "Progress retained throughout your access period",
    ],
  },
];

export default function Pricing({
  user,
  hasActiveAccess,
  premiumUntil,
  paymentLoading,
  onChoosePlan,
  onSignIn,
  onBack,
}) {
  const expiryLabel = premiumUntil
    ? new Intl.DateTimeFormat("en-ZA", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(premiumUntil))
    : "";

  return (
    <main className="pricing-page">
      <style>{`
        .pricing-page { min-height:100vh; padding:28px 5% 48px; background:radial-gradient(circle at 80% 0%,rgba(34,197,94,.17),transparent 32%),#07131f; color:#f8fafc; font-family:Inter,"Segoe UI",sans-serif; }
        .pricing-shell { width:min(1040px,100%); margin:0 auto; }
        .pricing-top { display:flex; justify-content:space-between; align-items:center; gap:20px; }
        .pricing-brand { font-size:1.08rem; font-weight:900; }
        .pricing-back { border:1px solid #334155; border-radius:11px; padding:10px 16px; background:#111827; color:#e2e8f0; font-weight:800; cursor:pointer; }
        .pricing-hero { max-width:760px; margin:54px auto 34px; text-align:center; }
        .pricing-eyebrow { margin:0 0 12px; color:#86efac; font-size:.78rem; font-weight:900; letter-spacing:.13em; }
        .pricing-hero h1 { margin:0; font-size:clamp(2.35rem,6vw,4.6rem); line-height:1; letter-spacing:-.045em; }
        .pricing-hero > p:last-child { color:#b8c5d6; line-height:1.65; font-size:1.05rem; }
        .pricing-status { max-width:720px; margin:0 auto 24px; padding:14px 18px; border:1px solid rgba(74,222,128,.42); border-radius:14px; background:rgba(20,83,45,.35); color:#dcfce7; text-align:center; }
        .pricing-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }
        .plan-card { position:relative; display:flex; flex-direction:column; padding:30px; border:1px solid #314052; border-radius:22px; background:rgba(15,23,42,.9); box-shadow:0 22px 60px rgba(0,0,0,.24); }
        .plan-card.featured { border-color:#22c55e; box-shadow:0 22px 70px rgba(34,197,94,.12); }
        .plan-badge { position:absolute; top:18px; right:18px; padding:6px 9px; border-radius:999px; background:#22c55e; color:#052e16; font-size:.7rem; font-weight:950; letter-spacing:.08em; }
        .plan-name { margin:0 0 7px; font-size:1.35rem; }
        .plan-copy { min-height:52px; margin:0; color:#94a3b8; line-height:1.55; }
        .plan-price { display:flex; align-items:flex-end; gap:8px; margin:25px 0 7px; }
        .plan-price strong { font-size:3.2rem; line-height:1; }
        .plan-price span { color:#94a3b8; font-weight:700; }
        .plan-once { margin:0 0 22px; color:#86efac; font-size:.86rem; font-weight:800; }
        .plan-features { flex:1; display:grid; gap:12px; padding:0; margin:0 0 26px; list-style:none; color:#dbe5f1; }
        .plan-features li::before { content:"✓"; margin-right:10px; color:#4ade80; font-weight:950; }
        .plan-button { min-height:52px; border:0; border-radius:13px; background:#22c55e; color:#052e16; font-weight:900; cursor:pointer; }
        .plan-card:not(.featured) .plan-button { border:1px solid #4b5f74; background:#162235; color:#f8fafc; }
        .plan-button:disabled { cursor:wait; opacity:.6; }
        .pricing-trust { display:flex; justify-content:center; flex-wrap:wrap; gap:18px; margin:25px 0 0; color:#94a3b8; font-size:.84rem; }
        .pricing-note { margin:20px auto 0; color:#64748b; font-size:.78rem; line-height:1.55; text-align:center; }
        @media(max-width:720px){ .pricing-page{padding:20px 18px 36px}.pricing-hero{margin-top:38px}.pricing-grid{grid-template-columns:1fr}.plan-copy{min-height:0}.pricing-top{align-items:flex-start}.pricing-brand{max-width:190px} }
      `}</style>

      <div className="pricing-shell">
        <header className="pricing-top">
          <div className="pricing-brand">🚦 K53 Visual Coach</div>
          <button type="button" className="pricing-back" onClick={onBack}>Back to home</button>
        </header>

        <section className="pricing-hero">
          <p className="pricing-eyebrow">PREMIUM ACCESS</p>
          <h1>Practise smarter. Walk in prepared.</h1>
          <p>Choose the preparation period that suits your test date. One secure payment—no automatic renewal.</p>
        </section>

        {hasActiveAccess && (
          <div className="pricing-status" role="status">
            Your Premium access is active until <strong>{expiryLabel}</strong>.
          </div>
        )}

        <section className="pricing-grid" aria-label="Premium access plans">
          {PLANS.map((plan) => (
            <article key={plan.id} className={`plan-card${plan.badge ? " featured" : ""}`}>
              {plan.badge && <span className="plan-badge">{plan.badge}</span>}
              <h2 className="plan-name">{plan.name}</h2>
              <p className="plan-copy">{plan.description}</p>
              <div className="plan-price"><strong>R{plan.price}</strong><span>/ {plan.days} days</span></div>
              <p className="plan-once">Once-off payment</p>
              <ul className="plan-features">
                {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
              </ul>
              <button
                type="button"
                className="plan-button"
                disabled={paymentLoading}
                onClick={() => user ? onChoosePlan(plan.id) : onSignIn()}
              >
                {paymentLoading ? "Opening secure checkout…" : user ? `${hasActiveAccess ? "Extend with" : "Choose"} ${plan.name}` : "Sign in to continue"}
              </button>
            </article>
          ))}
        </section>

        <div className="pricing-trust"><span>🔒 Secure Yoco checkout</span><span>✓ Automatic activation</span><span>↻ No automatic renewal</span></div>
        <p className="pricing-note">Access starts after successful payment confirmation. Prices are in South African rand. Refund and payment-support terms are available from the home page.</p>
      </div>
    </main>
  );
}
