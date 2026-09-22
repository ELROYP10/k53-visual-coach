const jsonHeaders = (key) => ({ apikey: key, Authorization: `Bearer ${key}`, "Content-Type": "application/json" });

async function authenticateAdmin(request, supabaseUrl, anonKey) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return null;
  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, { headers: { apikey: anonKey, Authorization: authorization } });
  const user = await userResponse.json();
  if (!userResponse.ok || !user?.id) return null;
  const adminResponse = await fetch(`${supabaseUrl}/rest/v1/admin_users?user_id=eq.${user.id}&select=user_id&limit=1`, { headers: { apikey: anonKey, Authorization: authorization } });
  const admins = await adminResponse.json();
  return adminResponse.ok && admins?.[0]?.user_id ? user : null;
}

async function rest(supabaseUrl, secretKey, path) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, { headers: jsonHeaders(secretKey) });
  if (!response.ok) throw new Error(`Analytics query failed: ${response.status}`);
  return response.json();
}

export default async function handler(request, response) {
  if (!["GET", "PATCH"].includes(request.method)) {
    response.setHeader("Allow", "GET, PATCH");
    return response.status(405).json({ error: "Method not allowed" });
  }
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !anonKey || !secretKey) return response.status(500).json({ error: "Admin analytics is not configured" });

  try {
    const admin = await authenticateAdmin(request, supabaseUrl, anonKey);
    if (!admin) return response.status(403).json({ error: "Admin access required" });

    if (request.method === "PATCH") {
      const { userId, action, days } = request.body || {};
      if (!userId || !["extend", "cancel"].includes(action)) return response.status(400).json({ error: "Invalid account action" });
      const profiles = await rest(supabaseUrl, secretKey, `user_profiles?user_id=eq.${encodeURIComponent(userId)}&select=premium_until&limit=1`);
      let changes;
      if (action === "cancel") changes = { plan: "free", premium_until: null, updated_at: new Date().toISOString() };
      else {
        const safeDays = Math.min(365, Math.max(1, Number(days) || 30));
        const current = profiles?.[0]?.premium_until ? new Date(profiles[0].premium_until).getTime() : 0;
        changes = { plan: safeDays >= 90 ? "premium" : "standard", premium_until: new Date(Math.max(Date.now(), current) + safeDays * 86400000).toISOString(), updated_at: new Date().toISOString() };
      }
      const update = await fetch(`${supabaseUrl}/rest/v1/user_profiles?user_id=eq.${encodeURIComponent(userId)}`, { method: "PATCH", headers: { ...jsonHeaders(secretKey), Prefer: "return=minimal" }, body: JSON.stringify(changes) });
      if (!update.ok) throw new Error("Unable to update learner access");
      return response.status(200).json({ ok: true });
    }

    const [usersResponse, profiles, tests, practices, challenges, payments] = await Promise.all([
      fetch(`${supabaseUrl}/auth/v1/admin/users?per_page=1000`, { headers: jsonHeaders(secretKey) }).then(async (result) => { if (!result.ok) throw new Error("Unable to load users"); return result.json(); }),
      rest(supabaseUrl, secretKey, "user_profiles?select=user_id,plan,premium_until,created_at,updated_at"),
      rest(supabaseUrl, secretKey, "test_results?select=user_id,total_score,rules_score,signs_score,controls_score,passed,completed_at&order=completed_at.desc&limit=5000"),
      rest(supabaseUrl, secretKey, "mistake_practice_sessions?select=user_id,percentage,completed_at&order=completed_at.desc&limit=5000"),
      rest(supabaseUrl, secretKey, "daily_challenge_results?select=user_id,correct,xp_earned,completed_at&order=completed_at.desc&limit=5000"),
      rest(supabaseUrl, secretKey, "payment_events?select=user_id,amount_cents,plan,paid_at&order=paid_at.desc&limit=5000").catch(() => []),
    ]);
    const authUsers = usersResponse.users || [];
    const profileMap = new Map(profiles.map((item) => [item.user_id, item]));
    const activity = new Map();
    const touch = (row) => { const current = activity.get(row.user_id); const value = row.completed_at; if (!current || new Date(value) > new Date(current)) activity.set(row.user_id, value); };
    [...tests, ...practices, ...challenges].forEach(touch);
    const now = Date.now();
    const learners = authUsers.map((user) => {
      const profile = profileMap.get(user.id) || {};
      const active = ["standard", "premium"].includes(profile.plan) && (!profile.premium_until || new Date(profile.premium_until).getTime() > now);
      return { id: user.id, email: user.email, createdAt: user.created_at, lastSignIn: user.last_sign_in_at, lastActivity: activity.get(user.id) || null, plan: active ? profile.plan : "free", premiumUntil: profile.premium_until || null };
    });
    const average = (values) => values.length ? Math.round(values.reduce((sum, value) => sum + Number(value || 0), 0) / values.length) : 0;
    const sectionRates = {
      "Rules of the Road": average(tests.map((item) => Number(item.rules_score || 0) / 28 * 100)),
      "Road Traffic Signs": average(tests.map((item) => Number(item.signs_score || 0) / 28 * 100)),
      "Vehicle Controls": average(tests.map((item) => Number(item.controls_score || 0) / 8 * 100)),
    };
    const activePremium = learners.filter((item) => item.plan !== "free");
    return response.status(200).json({
      summary: { users: learners.length, premium: activePremium.length, free: learners.length - activePremium.length, tests: tests.length, challenges: challenges.length, practices: practices.length, averageScore: average(tests.map((item) => Number(item.total_score || 0) / 64 * 100)), passRate: tests.length ? Math.round(tests.filter((item) => item.passed).length / tests.length * 100) : 0, lifetimeRevenueCents: payments.reduce((sum, item) => sum + Number(item.amount_cents || 0), 0), activePlanValueCents: activePremium.reduce((sum, item) => sum + (item.plan === "premium" ? 12900 : 7900), 0) },
      sectionRates, learners: learners.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), payments: payments.slice(0, 20),
    });
  } catch (error) {
    console.error("Admin analytics failed", error);
    return response.status(500).json({ error: "Unable to load admin analytics" });
  }
}
