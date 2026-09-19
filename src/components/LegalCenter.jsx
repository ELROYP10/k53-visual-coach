const SUPPORT_EMAIL = "elroypienaar25@gmail.com";

const pages = {
  privacy: {
    title: "Privacy Policy",
    intro: "How K53 Visual Coach collects, uses and protects personal information.",
    sections: [
      ["Information we collect", "We collect account details such as your email address, learning activity such as test attempts, scores and weak areas, support messages, and limited technical information needed to operate and secure the service. Payment providers may return a payment status and reference to us. We do not store full card details."],
      ["Why we use it", "We use personal information to create and secure accounts, provide tests and progress tracking, remember learning history, manage premium access, process support requests, prevent abuse, improve the service and meet legal obligations."],
      ["Service providers", "We use service providers to operate K53 Visual Coach, including Supabase for authentication and data storage, Vercel for hosting, and Yoco for payments. These providers process information under their own security and privacy obligations. Some processing may occur outside South Africa with appropriate safeguards."],
      ["Your choices and rights", `You may ask to access, correct or delete your personal information, object to certain processing, or ask how your information is used by emailing ${SUPPORT_EMAIL}. Some records may be retained where reasonably required for security, tax, transaction or legal purposes.`],
      ["Retention and security", "We retain information only for as long as reasonably necessary for the purposes described above. We use authenticated database policies, access controls and encrypted connections, but no online service can guarantee absolute security."],
      ["Children and learners", "The service may be used by younger learners. A parent or guardian should assist where consent is required by law. Do not submit unnecessary identity documents or sensitive personal information through the learning interface."],
      ["Cookies and local storage", "Essential browser storage is used to maintain login sessions and core preferences. If optional analytics or marketing technologies are introduced, appropriate notice and controls will be provided."],
      ["Privacy concerns", `For privacy requests or concerns, email ${SUPPORT_EMAIL}. You may also contact South Africa's Information Regulator if you believe your rights under applicable data-protection law have not been respected.`],
    ],
  },
  terms: {
    title: "Terms of Use",
    intro: "The rules that apply when using K53 Visual Coach.",
    sections: [
      ["Independent learning service", "K53 Visual Coach is an independent study and practice platform. It is not a government service, driving-licence testing centre or official examination provider. The content supports preparation but cannot guarantee a pass result."],
      ["Accounts", "You must provide accurate account information, protect your password and use only your own account. You are responsible for activity performed through your account. Contact us promptly if you suspect unauthorised access."],
      ["Acceptable use", "You may use the service for personal learning. You may not resell access, scrape or reproduce the question bank, interfere with security, attempt to bypass premium controls, or use the service unlawfully."],
      ["Plans and payments", "Free and paid features are described on the website and at checkout. Prices are shown in South African rand. Paid access is activated only after payment is confirmed by the payment provider. The duration and features of a plan are those displayed when you purchase it."],
      ["Learning content", "We work to keep content useful and accurate, but road rules, official materials and examination practices may change. Always compare learning material with current official South African requirements and instructions from an authorised driving-licence testing centre."],
      ["Availability", "We may update, repair or temporarily suspend parts of the service. We will take reasonable steps to preserve accounts and paid entitlements, but uninterrupted availability is not guaranteed."],
      ["Liability", "Nothing in these terms excludes rights or remedies that cannot lawfully be excluded. To the extent permitted by law, K53 Visual Coach is not responsible for indirect loss or for decisions made solely from practice results."],
      ["Changes", "We may update these terms as the service develops. Material changes will be communicated through the website or account where reasonably practical."],
    ],
  },
  refunds: {
    title: "Refund Policy",
    intro: "How payment problems, cancellations and refund requests are handled.",
    sections: [
      ["Before purchase", "The plan price, duration and included features are shown before checkout. Please review them before paying."],
      ["Duplicate, failed or unauthorised payments", "Contact us promptly if you are charged more than once, premium access is not activated after a successful payment, or you believe a payment was unauthorised. Include the account email, payment date, amount and payment reference, but never send full card details, PINs or one-time passwords."],
      ["Refund requests", "You may request a refund by email. Requests made within seven calendar days of purchase will be reviewed promptly, taking account of whether premium access was delivered or materially used and any rights available under South African law. This policy does not limit statutory rights relating to defective, misdescribed or undelivered services."],
      ["Processing", "Approved refunds are returned through the original payment method where possible. Bank and payment-provider processing times may apply after approval."],
      ["How to request help", `Email ${SUPPORT_EMAIL} with the subject “K53 Visual Coach payment support”. We aim to acknowledge support requests within two business days.`],
    ],
  },
  contact: {
    title: "Contact & Support",
    intro: "Get help with accounts, learning progress, payments or privacy.",
    sections: [
      ["Email support", SUPPORT_EMAIL],
      ["Helpful information to include", "Tell us what you were trying to do, what happened, the device and browser used, and your account email. For payment support, include only the payment date, amount and provider reference."],
      ["Keep sensitive information private", "Never email passwords, card numbers, PINs, one-time passwords, bank login details, identity-document images or selfies."],
      ["Response target", "We aim to acknowledge support requests within two business days. Verification, banking and refund timelines may also depend on the relevant service provider."],
    ],
  },
};

export default function LegalCenter({ page = "privacy", onNavigate, onHome }) {
  const content = pages[page] || pages.privacy;

  return (
    <main className="legal-shell">
      <style>{`
        .legal-shell { min-height: 100vh; box-sizing: border-box; padding: 28px clamp(18px, 5vw, 72px) 60px; color: #eaf8f1; background: radial-gradient(circle at top right, rgba(34,197,94,.13), transparent 30%), #071521; font-family: Inter, "Segoe UI", sans-serif; }
        .legal-nav { max-width: 980px; margin: 0 auto 28px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .legal-brand { border: 0; background: transparent; color: #f4fff9; font-weight: 900; font-size: 1.08rem; cursor: pointer; }
        .legal-back { border: 1px solid #315347; border-radius: 11px; padding: 10px 15px; background: #0b211e; color: #dcfce7; font-weight: 800; cursor: pointer; }
        .legal-card { max-width: 980px; margin: 0 auto; padding: clamp(24px, 4vw, 48px); border: 1px solid rgba(110,231,183,.22); border-radius: 24px; background: rgba(7,31,29,.94); box-shadow: 0 28px 75px rgba(0,0,0,.28); }
        .legal-kicker { margin: 0 0 10px; color: #6ee7b7; font-size: .72rem; font-weight: 900; letter-spacing: .12em; }
        .legal-card h1 { margin: 0; font-size: clamp(2.1rem, 5vw, 3.8rem); letter-spacing: -.045em; }
        .legal-intro { max-width: 720px; margin: 14px 0 32px; color: #b9d9cd; line-height: 1.65; }
        .legal-section { padding: 22px 0; border-top: 1px solid rgba(148,216,185,.14); }
        .legal-section h2 { margin: 0 0 9px; color: #f2fff8; font-size: 1.08rem; }
        .legal-section p { margin: 0; color: #bdd8cd; line-height: 1.72; white-space: pre-wrap; }
        .legal-tabs { max-width: 980px; margin: 24px auto 0; display: flex; flex-wrap: wrap; gap: 10px; }
        .legal-tabs button { border: 1px solid #315347; border-radius: 999px; padding: 9px 14px; background: #0b211e; color: #ccebdd; cursor: pointer; }
        .legal-tabs button.active { border-color: #34d399; color: #071521; background: #6ee7b7; font-weight: 900; }
        .legal-note { max-width: 980px; margin: 20px auto 0; color: #779b8d; font-size: .82rem; line-height: 1.55; }
        @media (max-width: 520px) { .legal-nav { align-items: flex-start; } .legal-brand { text-align: left; } .legal-card { border-radius: 18px; } }
      `}</style>

      <nav className="legal-nav" aria-label="Legal page navigation">
        <button className="legal-brand" onClick={onHome}>🚦 K53 Visual Coach</button>
        <button className="legal-back" onClick={onHome}>Back to home</button>
      </nav>

      <article className="legal-card">
        <p className="legal-kicker">K53 VISUAL COACH</p>
        <h1>{content.title}</h1>
        <p className="legal-intro">{content.intro}</p>
        {content.sections.map(([heading, body]) => (
          <section className="legal-section" key={heading}>
            <h2>{heading}</h2>
            <p>{body}</p>
          </section>
        ))}
      </article>

      <nav className="legal-tabs" aria-label="Legal and support pages">
        {Object.entries(pages).map(([key, value]) => (
          <button className={key === page ? "active" : ""} key={key} onClick={() => onNavigate(key)}>
            {value.title}
          </button>
        ))}
      </nav>
      <p className="legal-note">Last updated: 19 September 2026. These pages provide general service information and do not replace professional legal advice.</p>
    </main>
  );
}
