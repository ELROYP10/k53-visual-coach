async function authenticate(request, supabaseUrl, anonKey) {
  const authorization = request.headers.authorization;
  if (!authorization?.startsWith("Bearer ")) return null;

  const userResponse = await fetch(`${supabaseUrl}/auth/v1/user`, {
    headers: { Authorization: authorization, apikey: anonKey },
  });
  const user = await userResponse.json();
  return userResponse.ok && user?.id ? user : null;
}

export default async function handler(request, response) {
  if (request.method !== "POST") {
    response.setHeader("Allow", "POST");
    return response.status(405).json({ error: "Method not allowed" });
  }

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !anonKey || !secretKey) return response.status(500).json({ error: "Notification service is not configured" });

  try {
    const user = await authenticate(request, supabaseUrl, anonKey);
    if (!user) return response.status(401).json({ error: "Please sign in again" });

    const { subscription, enabled, streak, weakestArea, readiness } = request.body || {};
    const endpoint = subscription?.endpoint;
    if (enabled && (!endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth)) {
      return response.status(400).json({ error: "Invalid push subscription" });
    }

    if (!enabled) {
      if (endpoint) {
        await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?user_id=eq.${user.id}&endpoint=eq.${encodeURIComponent(endpoint)}`, {
          method: "PATCH",
          headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Prefer: "return=minimal" },
          body: JSON.stringify({ enabled: false, updated_at: new Date().toISOString() }),
        });
      }
      return response.status(200).json({ ok: true });
    }

    const saveResponse = await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?on_conflict=endpoint`, {
      method: "POST",
      headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}`, "Content-Type": "application/json", Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        user_id: user.id,
        endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        enabled: true,
        streak: Math.max(0, Number(streak) || 0),
        weakest_area: String(weakestArea || "Rules of the Road").slice(0, 80),
        readiness: Math.min(100, Math.max(0, Number(readiness) || 0)),
        updated_at: new Date().toISOString(),
      }),
    });
    if (!saveResponse.ok) throw new Error("Unable to store push subscription");
    return response.status(200).json({ ok: true });
  } catch (error) {
    console.error("Push subscription failed", error);
    return response.status(500).json({ error: "Unable to save notification settings" });
  }
}
