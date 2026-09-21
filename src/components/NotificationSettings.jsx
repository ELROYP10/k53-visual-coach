import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;
const SUPPORTS_PUSH = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function decodePublicKey(value) {
  const padding = "=".repeat((4 - (value.length % 4)) % 4);
  const base64 = (value + padding).replace(/-/g, "+").replace(/_/g, "/");
  return Uint8Array.from(window.atob(base64), (character) => character.charCodeAt(0));
}

export default function NotificationSettings({ streak = 0, weakestArea = "Rules of the Road", readiness = 0 }) {
  const [status, setStatus] = useState(SUPPORTS_PUSH ? "loading" : "unsupported");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!SUPPORTS_PUSH) return;

    navigator.serviceWorker.ready
      .then((registration) => registration.pushManager.getSubscription())
      .then((subscription) => setStatus(subscription ? "enabled" : Notification.permission === "denied" ? "blocked" : "disabled"))
      .catch(() => setStatus("disabled"));
  }, []);

  const saveSubscription = async (subscription, enabled) => {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (!token) throw new Error("Please sign in again before changing reminders.");

    const response = await fetch("/api/push-subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        subscription: subscription?.toJSON() || null,
        enabled,
        streak,
        weakestArea,
        readiness,
      }),
    });
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Unable to save notification settings.");
  };

  const enable = async () => {
    if (!PUBLIC_KEY) {
      setMessage("Notifications are awaiting final secure-key setup.");
      return;
    }

    try {
      setBusy(true);
      setMessage("");
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setStatus(permission === "denied" ? "blocked" : "disabled");
        setMessage("Notifications were not enabled. You can change this in your browser settings.");
        return;
      }

      const registration = await navigator.serviceWorker.ready;
      const existing = await registration.pushManager.getSubscription();
      const subscription = existing || await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: decodePublicKey(PUBLIC_KEY),
      });
      await saveSubscription(subscription, true);
      setStatus("enabled");
      setMessage("Daily study reminders are on.");
    } catch (error) {
      setMessage(error.message || "Unable to enable reminders.");
    } finally {
      setBusy(false);
    }
  };

  const disable = async () => {
    try {
      setBusy(true);
      setMessage("");
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      await saveSubscription(subscription, false);
      if (subscription) await subscription.unsubscribe();
      setStatus("disabled");
      setMessage("Study reminders are off.");
    } catch (error) {
      setMessage(error.message || "Unable to disable reminders.");
    } finally {
      setBusy(false);
    }
  };

  if (status === "unsupported") return null;

  return (
    <div className="notification-settings">
      <div>
        <p className="section-label">Smart reminders</p>
        <strong>{status === "enabled" ? "🔔 Daily coach enabled" : "🔕 Keep your study streak moving"}</strong>
        <p>{status === "blocked" ? "Notifications are blocked in this browser's settings." : "Get one personalised practice reminder each morning."}</p>
      </div>
      <button type="button" onClick={status === "enabled" ? disable : enable} disabled={busy || status === "loading" || status === "blocked"}>
        {busy ? "Saving…" : status === "enabled" ? "Turn off" : "Enable"}
      </button>
      {message && <small>{message}</small>}
      <style>{`
        .notification-settings{display:grid;grid-template-columns:1fr auto;gap:8px 14px;align-items:center;margin-top:10px;padding:12px;border:1px solid #275744;border-radius:14px;background:#09241d;color:#f3fff8}.notification-settings .section-label{margin:0 0 3px}.notification-settings strong{font-size:.88rem}.notification-settings p:not(.section-label){margin:4px 0 0;color:#a9d1bf;font-size:.72rem;line-height:1.35}.notification-settings button{border:1px solid #39cc78;border-radius:10px;background:#193c31;color:#eafff2;padding:9px 12px;font-weight:800;cursor:pointer}.notification-settings button:disabled{cursor:not-allowed;opacity:.55}.notification-settings small{grid-column:1/-1;color:#84efb2;font-size:.7rem}
      `}</style>
    </div>
  );
}
