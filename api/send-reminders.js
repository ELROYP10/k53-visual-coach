import webpush from "web-push";

function reminderFor(learner) {
  if (Number(learner.streak) > 0) {
    return `Protect your ${learner.streak}-day streak with a quick ${learner.weakest_area} session.`;
  }
  if (Number(learner.readiness) < 60) {
    return `Build your ${learner.readiness}% readiness score with today's ${learner.weakest_area} practice.`;
  }
  return `You are ${learner.readiness}% exam-ready. Practise ${learner.weakest_area} to move closer to test day.`;
}

export default async function handler(request, response) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || request.headers.authorization !== `Bearer ${cronSecret}`) return response.status(401).json({ error: "Unauthorized" });

  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const secretKey = process.env.SUPABASE_SECRET_KEY;
  const publicKey = process.env.VITE_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || "mailto:elroypienaar25@gmail.com";
  if (!supabaseUrl || !secretKey || !publicKey || !privateKey) return response.status(500).json({ error: "Notification service is not configured" });

  webpush.setVapidDetails(subject, publicKey, privateKey);
  const listResponse = await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?enabled=eq.true&select=*`, {
    headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` },
  });
  if (!listResponse.ok) return response.status(502).json({ error: "Unable to load subscriptions" });

  const subscriptions = await listResponse.json();
  let sent = 0;
  let removed = 0;
  for (const learner of subscriptions) {
    try {
      await webpush.sendNotification(
        { endpoint: learner.endpoint, keys: { p256dh: learner.p256dh, auth: learner.auth } },
        JSON.stringify({ title: "Today's K53 mission", body: reminderFor(learner), url: "/?dashboard=1" }),
      );
      sent += 1;
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        removed += 1;
        await fetch(`${supabaseUrl}/rest/v1/push_subscriptions?endpoint=eq.${encodeURIComponent(learner.endpoint)}`, {
          method: "DELETE",
          headers: { apikey: secretKey, Authorization: `Bearer ${secretKey}` },
        });
      } else {
        console.error("Push delivery failed", error.statusCode || error.message);
      }
    }
  }
  return response.status(200).json({ ok: true, sent, removed });
}
