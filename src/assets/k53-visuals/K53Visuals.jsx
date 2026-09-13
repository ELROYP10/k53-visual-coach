import React from "react";

const wrapStyle = {
  width: "100%",
  maxWidth: 520,
  margin: "0 auto",
  borderRadius: 18,
  overflow: "hidden",
  background: "#f8fafc",
  border: "1px solid #334155",
};

function SvgFrame({ children, label }) {
  return (
    <div style={wrapStyle}>
      <svg viewBox="0 0 640 320" role="img" aria-label={label || "K53 visual"} style={{ width: "100%", display: "block" }}>
        <rect width="640" height="320" fill="#f8fafc" />
        {children}
      </svg>
    </div>
  );
}

function StopSign() {
  return (
    <SvgFrame label="STOP sign">
      
      <rect x="283" y="185" width="10" height="135" fill="#475569" />
      <polygon points="250,38 326,38 380,92 380,168 326,222 250,222 196,168 196,92"
        fill="#c62828" stroke="#fff" strokeWidth="8" />
      <text x="288" y="145" textAnchor="middle" fill="white" fontSize="48" fontWeight="900">STOP</text>
    </SvgFrame>
  );
}

function YieldSign() {
  return (
    <SvgFrame label="YIELD sign">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,45 390,210 186,210" fill="white" stroke="#c62828" strokeWidth="14" />
    </SvgFrame>
  );
}

function NoEntrySign() {
  return (
    <SvgFrame label="No entry sign">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <circle cx="288" cy="125" r="92" fill="#c62828" />
      <rect x="220" y="108" width="136" height="34" rx="4" fill="#fff" />
    </SvgFrame>
  );
}

function SpeedSign({ speed = "60" }) {
  return (
    <SvgFrame label={`Speed limit ${speed}`}>
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <circle cx="288" cy="125" r="92" fill="#fff" stroke="#c62828" strokeWidth="14" />
      <text x="288" y="148" textAnchor="middle" fill="#111827" fontSize="62" fontWeight="900">{speed}</text>
    </SvgFrame>
  );
}

function WarningSign({ symbol = "!" }) {
  return (
    <SvgFrame label="Warning sign">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,36 400,214 176,214" fill="#fff" stroke="#dc2626" strokeWidth="12" />
      <text x="288" y="165" textAnchor="middle" fill="#111827" fontSize="70" fontWeight="900">{symbol}</text>
    </SvgFrame>
  );
}

function TrafficCircleSign() {
  return (
    <SvgFrame label="Traffic circle warning">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,36 400,214 176,214" fill="#fff" stroke="#dc2626" strokeWidth="12" />
      <circle cx="288" cy="130" r="42" fill="none" stroke="#111827" strokeWidth="11" strokeDasharray="50 18" />
      <polygon points="325,94 347,101 331,118" fill="#111827" />
    </SvgFrame>
  );
}

function PedestrianSign() {
  return (
    <SvgFrame label="Pedestrian warning">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,36 400,214 176,214" fill="#fff" stroke="#dc2626" strokeWidth="12" />
      <circle cx="288" cy="95" r="13" fill="#111827" />
      <path d="M288 112 L286 155 M286 126 L255 145 M286 126 L318 144 M286 155 L260 190 M286 155 L316 190"
        stroke="#111827" strokeWidth="11" fill="none" strokeLinecap="round" />
    </SvgFrame>
  );
}

function RoadworksSign() {
  return (
    <SvgFrame label="Roadworks warning">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,36 400,214 176,214" fill="#fff" stroke="#dc2626" strokeWidth="12" />
      <circle cx="270" cy="96" r="12" fill="#111827" />
      <path d="M270 111 L260 152 M263 127 L238 145 M262 129 L302 145 M260 152 L241 188 M260 152 L287 188"
        stroke="#111827" strokeWidth="10" fill="none" strokeLinecap="round" />
      <path d="M315 150 L350 192 M305 192 L366 192" stroke="#111827" strokeWidth="9" />
    </SvgFrame>
  );
}

function TrafficLight({ active = "red", arrow = false }) {
  const light = (name, cy) => (
    <circle cx="320" cy={cy} r="34" fill={active === name ? (name === "red" ? "#dc2626" : name === "amber" ? "#f59e0b" : "#16a34a") : "#374151"} />
  );

  return (
    <SvgFrame label={`${active} traffic signal`}>
      
      <rect x="300" y="42" width="40" height="200" rx="8" fill="#111827" />
      <rect x="260" y="20" width="120" height="210" rx="18" fill="#1f2937" stroke="#0f172a" strokeWidth="8" />
      {light("red", 62)}
      {light("amber", 125)}
      {light("green", 188)}
      {arrow && <text x="320" y="203" textAnchor="middle" fontSize="54" fontWeight="900" fill="#fff">→</text>}
    </SvgFrame>
  );
}

function RoadMarking({ kind = "generic" }) {
  return (
    <SvgFrame label="Road marking illustration">
      <rect width="640" height="320" fill="#94a3b8" />
      <rect x="0" y="0" width="640" height="320" fill="#4b5563" />
      <line x1="320" y1="0" x2="320" y2="320" stroke="#fff" strokeWidth="7" strokeDasharray="28 20" />
      {kind === "stop" && <>
        <line x1="80" y1="235" x2="560" y2="235" stroke="#fff" strokeWidth="16" />
        <text x="320" y="205" textAnchor="middle" fill="#fff" fontSize="52" fontWeight="900">STOP</text>
      </>}
      {kind === "yield" && <>
        <line x1="90" y1="230" x2="550" y2="230" stroke="#fff" strokeWidth="14" strokeDasharray="28 16" />
        <polygon points="320,145 360,205 280,205" fill="none" stroke="#fff" strokeWidth="9" />
      </>}
      {kind === "crossing" && Array.from({ length: 8 }).map((_, i) => (
        <rect key={i} x={120 + i * 52} y="115" width="26" height="95" fill="#fff" />
      ))}
      {kind === "island" && <polygon points="250,70 390,70 440,250 200,250" fill="#f8fafc" stroke="#f8fafc" strokeWidth="5" />}
    </SvgFrame>
  );
}

function VehicleControl({ kind = "steering" }) {
  return (
    <SvgFrame label="Vehicle control illustration">
      <rect width="640" height="320" fill="#0f172a" />
      <rect x="60" y="50" width="520" height="220" rx="34" fill="#1f2937" stroke="#475569" strokeWidth="6" />
      {kind === "steering" && <>
        <circle cx="230" cy="160" r="74" fill="none" stroke="#cbd5e1" strokeWidth="16" />
        <circle cx="230" cy="160" r="18" fill="#cbd5e1" />
        <path d="M230 142 L230 90 M216 168 L170 205 M244 168 L290 205" stroke="#cbd5e1" strokeWidth="13" strokeLinecap="round" />
      </>}
      {kind === "pedals" && <>
        <rect x="180" y="120" width="55" height="100" rx="12" fill="#94a3b8" />
        <rect x="292" y="95" width="55" height="125" rx="12" fill="#94a3b8" />
        <rect x="404" y="132" width="55" height="88" rx="12" fill="#94a3b8" />
      </>}
      {kind === "gear" && <>
        <line x1="320" y1="215" x2="320" y2="110" stroke="#cbd5e1" strokeWidth="16" strokeLinecap="round" />
        <circle cx="320" cy="90" r="34" fill="#cbd5e1" />
        <text x="320" y="101" textAnchor="middle" fontSize="28" fontWeight="900" fill="#111827">H</text>
      </>}
      {kind === "mirror" && <>
        <rect x="210" y="105" width="220" height="92" rx="46" fill="#cbd5e1" stroke="#64748b" strokeWidth="8" />
        <line x1="320" y1="197" x2="320" y2="245" stroke="#cbd5e1" strokeWidth="10" />
      </>}
    </SvgFrame>
  );
}

function RoadScene({ kind = "intersection" }) {
  return (
    <SvgFrame label="Road scene">
      <rect width="640" height="320" fill="#86b86b" />
      {kind === "crossing" ? <>
        <rect y="85" width="640" height="150" fill="#4b5563" />
        {Array.from({ length: 8 }).map((_, i) => <rect key={i} x={190 + i * 34} y="85" width="15" height="150" fill="#fff" />)}
        <rect x="72" y="140" width="95" height="48" rx="9" fill="#2563eb" />
        <text x="120" y="171" textAnchor="middle" fill="#fff" fontSize="20" fontWeight="800">YOU</text>
      </> : <>
        <rect x="255" width="130" height="320" fill="#4b5563" />
        <rect y="105" width="640" height="110" fill="#4b5563" />
        <line x1="320" y1="0" x2="320" y2="320" stroke="#fff" strokeWidth="5" strokeDasharray="24 18" />
        <line x1="0" y1="160" x2="640" y2="160" stroke="#fff" strokeWidth="5" strokeDasharray="24 18" />
        <rect x="275" y="235" width="42" height="65" rx="7" fill="#2563eb" />
        <text x="296" y="275" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">A</text>
        <rect x="410" y="128" width="70" height="42" rx="7" fill="#dc2626" />
        <text x="445" y="155" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="800">B</text>
      </>}
    </SvgFrame>
  );
}

function GuidanceSign() {
  return (
    <SvgFrame label="Guidance sign">
      
      <rect x="314" y="190" width="12" height="130" fill="#475569" />
      <rect x="150" y="48" width="340" height="160" rx="10" fill="#2563eb" stroke="#fff" strokeWidth="8" />
      <path d="M225 168 L225 98 L205 118 M225 98 L245 118" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M350 168 L350 110 L420 110 M420 110 L398 90 M420 110 L398 130" stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </SvgFrame>
  );
}

function inferVisual(questionText = "", visualType = "") {
  const q = questionText.toLowerCase();

  if (q.includes("stop sign")) return <StopSign />;
  if (q.includes("yield sign") || q.includes("give way sign")) return <YieldSign />;
  if (q.includes("no entry")) return <NoEntrySign />;
  if (q.includes("speed-limit") || q.includes("speed limit")) {
    const speed = (q.match(/\b(20|30|40|50|60|80|100|120)\b/) || [])[1] || "60";
    return <SpeedSign speed={speed} />;
  }
  if (q.includes("traffic circle") || q.includes("roundabout")) return <TrafficCircleSign />;
  if (q.includes("pedestrian") && (visualType.includes("sign") || q.includes("sign"))) return <PedestrianSign />;
  if (q.includes("road works") || q.includes("roadworks") || q.includes("grader working")) return <RoadworksSign />;

  if (visualType === "traffic_signal") {
    if (q.includes("amber")) return <TrafficLight active="amber" />;
    if (q.includes("green")) return <TrafficLight active="green" />;
    return <TrafficLight active="red" />;
  }

  if (visualType === "road_marking") {
    if (q.includes("stop line")) return <RoadMarking kind="stop" />;
    if (q.includes("yield line")) return <RoadMarking kind="yield" />;
    if (q.includes("pedestrian crossing")) return <RoadMarking kind="crossing" />;
    if (q.includes("island")) return <RoadMarking kind="island" />;
    return <RoadMarking />;
  }

  if (visualType === "vehicle_control") {
    if (q.includes("steering")) return <VehicleControl kind="steering" />;
    if (q.includes("accelerator") || q.includes("brake pedal") || q.includes("clutch")) return <VehicleControl kind="pedals" />;
    if (q.includes("gear")) return <VehicleControl kind="gear" />;
    if (q.includes("mirror")) return <VehicleControl kind="mirror" />;
    return <VehicleControl />;
  }

  if (visualType === "guidance_sign") return <GuidanceSign />;
  if (visualType === "warning_sign" || visualType === "hazard_sign" || visualType === "regulatory_sign") return <WarningSign />;
  if (visualType === "road_scene") {
    if (q.includes("pedestrian crossing")) return <RoadScene kind="crossing" />;
    return <RoadScene kind="intersection" />;
  }

  return null;
}

export default function K53Visual({ visualAssetId, visualType, questionText }) {
  if (!visualType || visualType === "none") return null;

  const visual = inferVisual(questionText, visualType);
  if (!visual) return null;

  return (
    <div data-visual-id={visualAssetId || undefined} style={{ margin: "12px 0 20px" }}>
      {visual}
    </div>
  );
}
