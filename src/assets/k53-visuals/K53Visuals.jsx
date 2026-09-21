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

function StopLineScene() {
  return (
    <SvgFrame label="STOP sign with stop line">
      <rect width="640" height="320" fill="#86b86b" />
      <rect x="145" width="350" height="320" fill="#4b5563" />
      <line x1="320" y1="0" x2="320" y2="170" stroke="#fff" strokeWidth="6" strokeDasharray="26 18" />
      <line x1="165" y1="205" x2="475" y2="205" stroke="#fff" strokeWidth="18" />
      <text x="320" y="188" textAnchor="middle" fill="#fff" fontSize="30" fontWeight="900">STOP LINE</text>
      <rect x="468" y="100" width="8" height="120" fill="#475569" />
      <polygon points="440,42 500,42 540,82 540,142 500,182 440,182 400,142 400,82" fill="#c62828" stroke="#fff" strokeWidth="7" />
      <text x="470" y="126" textAnchor="middle" fill="#fff" fontSize="32" fontWeight="900">STOP</text>
      <rect x="292" y="230" width="56" height="76" rx="9" fill="#2563eb" />
    </SvgFrame>
  );
}

function YieldSign() {
  return (
    <SvgFrame label="YIELD sign">
      
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="186,55 390,55 288,220" fill="white" stroke="#c62828" strokeWidth="14" />
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



function WarningFrame({ label, children }) {
  return (
    <SvgFrame label={label}>
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="288,36 400,214 176,214" fill="#fff" stroke="#dc2626" strokeWidth="12" strokeLinejoin="round" />
      {children}
    </SvgFrame>
  );
}

function JunctionWarning({ kind }) {
  const paths = {
    cross: "M288 178 V76 M235 128 H341",
    tee: "M288 180 V104 M235 104 H341",
    side: "M288 180 V76 M288 126 H345",
  };
  return <WarningFrame label={`${kind} junction warning`}><path d={paths[kind]} stroke="#111827" strokeWidth="14" fill="none" strokeLinecap="round" /></WarningFrame>;
}

function CurveWarning({ kind }) {
  const paths = {
    gentle: "M260 178 C260 145 315 145 315 92",
    sharp: "M255 178 C255 138 330 150 330 88",
    hairpin: "M270 180 V130 Q270 92 310 92 Q345 92 345 125 Q345 155 315 155 H292",
    winding: "M270 182 C340 155 235 125 310 92 C335 80 330 66 330 62",
  };
  return <WarningFrame label={`${kind} road warning`}><path d={paths[kind]} stroke="#111827" strokeWidth="14" fill="none" strokeLinecap="round" /></WarningFrame>;
}

function LaneEndsWarning() {
  return <WarningFrame label="Lane ends warning"><path d="M245 82 L270 180 M335 82 L305 180 M290 82 V180" stroke="#111827" strokeWidth="12" fill="none" strokeLinecap="round" /></WarningFrame>;
}

function ChildrenWarning() {
  return <WarningFrame label="Children warning">
    <circle cx="270" cy="102" r="10" fill="#111827"/><circle cx="309" cy="112" r="9" fill="#111827"/>
    <path d="M270 115 L267 148 M267 126 L245 140 M267 148 L250 174 M267 148 L285 174 M309 123 L306 151 M306 132 L325 143 M306 151 L292 174 M306 151 L320 174" stroke="#111827" strokeWidth="8" fill="none" strokeLinecap="round"/>
  </WarningFrame>;
}

function CyclistsWarning() {
  return <WarningFrame label="Pedal cyclists warning">
    <circle cx="255" cy="157" r="25" fill="none" stroke="#111827" strokeWidth="7"/><circle cx="324" cy="157" r="25" fill="none" stroke="#111827" strokeWidth="7"/>
    <path d="M255 157 L278 116 L301 157 L255 157 M278 116 H307 L324 157 M268 106 H286" stroke="#111827" strokeWidth="7" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
  </WarningFrame>;
}

function AnimalWarning({ wild=false }) {
  return <WarningFrame label={wild ? "Wild animals warning" : "Domestic animals warning"}>
    {wild ? <>
      <path d="M235 145 Q255 112 292 118 L330 104 L350 120 L330 132 L318 165 M275 132 L260 169 M305 132 L298 169" stroke="#111827" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M330 104 L342 84 M337 105 L354 91" stroke="#111827" strokeWidth="6"/>
    </> : <>
      <path d="M232 142 Q250 112 292 118 L326 105 L347 119 L330 134 L318 166 M260 134 L250 170 M298 134 L292 170" stroke="#111827" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M327 105 L337 90" stroke="#111827" strokeWidth="6"/>
    </>}
  </WarningFrame>;
}

function RailwayWarning() {
  return <WarningFrame label="Railway crossing warning">
    <path d="M245 92 L331 174 M331 92 L245 174" stroke="#111827" strokeWidth="14" strokeLinecap="round"/>
    <line x1="238" y1="178" x2="338" y2="178" stroke="#111827" strokeWidth="8"/>
  </WarningFrame>;
}

function SlopeWarning({ ascent=false }) {
  return <WarningFrame label={ascent ? "Steep ascent warning" : "Steep descent warning"}>
    <path d={ascent ? "M235 170 L342 92" : "M235 92 L342 170"} stroke="#111827" strokeWidth="13"/>
    <rect x="263" y="119" width="58" height="28" rx="5" fill="#111827" transform={ascent ? "rotate(-36 292 133)" : "rotate(36 292 133)"}/>
    <circle cx="276" cy="150" r="8" fill="#111827"/><circle cx="315" cy="150" r="8" fill="#111827"/>
  </WarningFrame>;
}

function RoadNarrowsWarning() {
  return <WarningFrame label="Road narrows warning"><path d="M238 82 L270 180 M338 82 L306 180" stroke="#111827" strokeWidth="14" fill="none" strokeLinecap="round"/></WarningFrame>;
}

function SlipperyRoadWarning() {
  return <WarningFrame label="Slippery road warning">
    <path d="M248 116 H315 L330 143 H238 Z" fill="#111827"/>
    <circle cx="260" cy="148" r="9" fill="#111827"/><circle cx="311" cy="148" r="9" fill="#111827"/>
    <path d="M245 166 C270 150 278 184 301 166 C320 151 330 174 346 164" stroke="#111827" strokeWidth="7" fill="none" strokeLinecap="round"/>
  </WarningFrame>;
}

function WarningOverview() {
  return <WarningFrame label="General warning sign"><text x="288" y="164" textAnchor="middle" fill="#111827" fontSize="74" fontWeight="900">!</text></WarningFrame>;
}

function KeepLeftSign() {
  return (
    <SvgFrame label="Keep left regulatory sign">
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <circle cx="288" cy="125" r="92" fill="#2563eb" stroke="#fff" strokeWidth="8" />
      <path d="M330 70 L245 155 M245 155 L245 112 M245 155 L288 155"
        stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </SvgFrame>
  );
}


function RegulatoryCircle({ label, children, background = "#2563eb", border = "#fff" }) {
  return (
    <SvgFrame label={label}>
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <circle cx="288" cy="125" r="92" fill={background} stroke={border} strokeWidth="8" />
      {children}
    </SvgFrame>
  );
}

function ArrowCommandSign({ direction = "left", label = "Regulatory command sign" }) {
  const paths = {
    left: "M340 125 H235 M235 125 L278 82 M235 125 L278 168",
    right: "M236 125 H341 M341 125 L298 82 M341 125 L298 168",
    straight: "M288 180 V72 M288 72 L247 113 M288 72 L329 113",
    downLeft: "M337 76 L240 173 M240 173 V125 M240 173 H288",
    downRight: "M239 76 L336 173 M336 173 V125 M336 173 H288",
    turnLeft: "M337 170 V119 Q337 82 300 82 H238 M238 82 L278 45 M238 82 L278 119",
    turnRight: "M239 170 V119 Q239 82 276 82 H338 M338 82 L298 45 M338 82 L298 119",
  };
  return (
    <RegulatoryCircle label={label}>
      <path d={paths[direction]} stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </RegulatoryCircle>
  );
}

function YieldPedestriansSign() {
  return (
    <SvgFrame label="Yield to pedestrians sign">
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="186,55 390,55 288,220" fill="white" stroke="#c62828" strokeWidth="14" />
      <circle cx="288" cy="102" r="10" fill="#111827" />
      <path d="M288 115 L286 151 M286 126 L261 142 M286 126 L313 142 M286 151 L265 180 M286 151 L310 180"
        stroke="#111827" strokeWidth="8" fill="none" strokeLinecap="round" />
    </SvgFrame>
  );
}

function MiniCircleSign() {
  return (
    <SvgFrame label="Yield at mini-circle sign">
      <rect x="283" y="190" width="10" height="130" fill="#475569" />
      <polygon points="186,55 390,55 288,220" fill="white" stroke="#c62828" strokeWidth="14" />
      <circle cx="288" cy="135" r="35" fill="none" stroke="#111827" strokeWidth="9" strokeDasharray="42 16" />
      <polygon points="315,103 337,109 321,126" fill="#111827" />
    </SvgFrame>
  );
}

function OneWaySign() {
  return (
    <SvgFrame label="One-way roadway sign">
      <rect x="314" y="190" width="12" height="130" fill="#475569" />
      <rect x="150" y="62" width="340" height="126" rx="10" fill="#2563eb" stroke="#fff" strokeWidth="8" />
      <path d="M205 125 H430 M430 125 L385 82 M430 125 L385 168"
        stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </SvgFrame>
  );
}

function PedestriansOnlySign() {
  return (
    <RegulatoryCircle label="Pedestrians only sign">
      <circle cx="288" cy="86" r="13" fill="#fff" />
      <path d="M288 103 L286 148 M286 118 L254 139 M286 118 L319 139 M286 148 L260 183 M286 148 L316 183"
        stroke="#fff" strokeWidth="11" fill="none" strokeLinecap="round" />
    </RegulatoryCircle>
  );
}

function CyclesOnlySign() {
  return (
    <RegulatoryCircle label="Pedal cycles only sign">
      <circle cx="253" cy="153" r="29" fill="none" stroke="#fff" strokeWidth="8" />
      <circle cx="326" cy="153" r="29" fill="none" stroke="#fff" strokeWidth="8" />
      <path d="M253 153 L277 111 L301 153 L253 153 M277 111 H309 L326 153 M267 100 H287"
        stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </RegulatoryCircle>
  );
}

function MotorcycleOnlySign() {
  return (
    <RegulatoryCircle label="Motorcycles only sign">
      <circle cx="244" cy="162" r="25" fill="none" stroke="#fff" strokeWidth="9" />
      <circle cx="334" cy="162" r="25" fill="none" stroke="#fff" strokeWidth="9" />
      <path d="M244 162 L270 136 L302 136 L320 162 H334 M270 136 L284 162 M302 136 L316 110 H338" stroke="#fff" strokeWidth="9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M270 136 Q286 108 311 116 L324 136 H291 Z" fill="#fff" />
      <path d="M316 110 L330 98 H345" stroke="#fff" strokeWidth="8" fill="none" strokeLinecap="round" />
      <circle cx="286" cy="104" r="11" fill="#fff" />
    </RegulatoryCircle>
  );
}

function MotorCarsOnlySign() {
  return (
    <RegulatoryCircle label="Motor cars only sign">
      <path d="M225 145 L241 105 Q246 94 260 94 H316 Q330 94 335 105 L351 145 V174 H225 Z"
        fill="#fff" />
      <rect x="237" y="120" width="102" height="30" rx="7" fill="#2563eb" />
      <circle cx="248" cy="174" r="12" fill="#fff" />
      <circle cx="328" cy="174" r="12" fill="#fff" />
    </RegulatoryCircle>
  );
}

function ProhibitionExampleSign() {
  return (
    <RegulatoryCircle label="Regulatory prohibition sign" background="#fff" border="#dc2626">
      <path d="M235 178 L341 72" stroke="#dc2626" strokeWidth="18" strokeLinecap="round" />
      <path d="M288 78 V172" stroke="#111827" strokeWidth="14" strokeLinecap="round" />
    </RegulatoryCircle>
  );
}

function TemporaryRegulatorySign({ variant = "command" }) {
  return (
    <SvgFrame label="Temporary regulatory sign">
      <rect x="283" y="205" width="10" height="115" fill="#475569" />
      <rect x="154" y="34" width="268" height="190" rx="16" fill="#f59e0b" stroke="#111827" strokeWidth="7" />
      <circle cx="288" cy="129" r="72" fill={variant === "prohibition" ? "#fff" : "#2563eb"}
        stroke={variant === "prohibition" ? "#dc2626" : "#fff"} strokeWidth="9" />
      {variant === "prohibition"
        ? <path d="M243 174 L333 84" stroke="#dc2626" strokeWidth="16" strokeLinecap="round" />
        : <path d="M288 174 V84 M288 84 L252 120 M288 84 L324 120"
            stroke="#fff" strokeWidth="16" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
    </SvgFrame>
  );
}

function RegulatoryOverviewSign() {
  return (
    <SvgFrame label="Regulatory signs overview">
      <circle cx="170" cy="130" r="62" fill="#2563eb" stroke="#fff" strokeWidth="7" />
      <path d="M170 170 V90 M170 90 L140 120 M170 90 L200 120" stroke="#fff" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="320" cy="130" r="62" fill="#fff" stroke="#dc2626" strokeWidth="11" />
      <path d="M280 170 L360 90" stroke="#dc2626" strokeWidth="14" strokeLinecap="round" />
      <polygon points="400,68 530,68 465,188" fill="#fff" stroke="#c62828" strokeWidth="11" strokeLinejoin="round" />
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
      {kind !== "edge" && kind !== "arrow" && (
        <line x1="320" y1="0" x2="320" y2="320" stroke="#fff" strokeWidth="7" strokeDasharray={kind === "solid" ? undefined : "28 20"} />
      )}
      {kind === "edge" && <line x1="90" y1="0" x2="90" y2="320" stroke="#facc15" strokeWidth="11" />}
      {kind === "arrow" && <path d="M320 260 V78 M320 78 L268 132 M320 78 L372 132" stroke="#fff" strokeWidth="18" fill="none" strokeLinecap="round" strokeLinejoin="round" />}
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

function NoParkingSign() {
  return (
    <SvgFrame label="No parking sign">
      <rect x="314" y="205" width="12" height="115" fill="#475569" />
      <circle cx="320" cy="125" r="82" fill="#2563eb" stroke="#dc2626" strokeWidth="14" />
      <path d="M265 70 L375 180" stroke="#dc2626" strokeWidth="17" strokeLinecap="round" />
      <text x="320" y="157" textAnchor="middle" fill="#fff" fontSize="92" fontWeight="900">P</text>
    </SvgFrame>
  );
}

function NoOvertakingSign() {
  return (
    <SvgFrame label="No overtaking sign">
      <rect x="314" y="205" width="12" height="115" fill="#475569" />
      <circle cx="320" cy="125" r="82" fill="#fff" stroke="#dc2626" strokeWidth="14" />
      <rect x="260" y="105" width="48" height="62" rx="9" fill="#111827" />
      <rect x="332" y="105" width="48" height="62" rx="9" fill="#dc2626" />
      <circle cx="272" cy="169" r="8" fill="#111827" /><circle cx="296" cy="169" r="8" fill="#111827" />
      <circle cx="344" cy="169" r="8" fill="#111827" /><circle cx="368" cy="169" r="8" fill="#111827" />
    </SvgFrame>
  );
}

function ChevronBoard() {
  return (
    <SvgFrame label="Chevron alignment board">
      <rect x="105" y="78" width="430" height="150" rx="8" fill="#facc15" stroke="#111827" strokeWidth="8" />
      {[145, 245, 345, 445].map((x) => <path key={x} d={`M${x} 100 L${x + 55} 153 L${x} 206`} stroke="#111827" strokeWidth="28" fill="none" />)}
    </SvgFrame>
  );
}

function HazardMarkerBoard() {
  return (
    <SvgFrame label="Hazard marker board">
      <rect x="190" y="50" width="260" height="220" fill="#facc15" stroke="#111827" strokeWidth="8" />
      {[-20, 60, 140, 220, 300, 380].map((x) => <path key={x} d={`M${x + 190} 270 L${x + 330} 50`} stroke="#111827" strokeWidth="34" />)}
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
      {kind === "roadsidePedestrian" ? <>
        <rect x="150" width="490" height="320" fill="#4b5563" />
        <line x1="395" y1="0" x2="395" y2="320" stroke="#fff" strokeWidth="5" strokeDasharray="24 18" />
        <line x1="166" y1="0" x2="166" y2="320" stroke="#facc15" strokeWidth="9" />
        <circle cx="105" cy="102" r="15" fill="#111827" />
        <path d="M105 120 L105 184 M105 138 L78 165 M105 138 L130 160 M105 184 L82 232 M105 184 L130 230" fill="none" stroke="#111827" strokeWidth="11" strokeLinecap="round" />
        <path d="M95 270 L95 235 M82 248 L95 235 L108 248" fill="none" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="455" y="92" width="105" height="58" rx="10" fill="#2563eb" />
        <rect x="474" y="150" width="22" height="14" rx="4" fill="#111827" />
        <rect x="524" y="150" width="22" height="14" rx="4" fill="#111827" />
        <path d="M455 120 L430 120" stroke="#ffffff" strokeWidth="5" strokeDasharray="10 9" />
        <text x="320" y="300" textAnchor="middle" fill="#ffffff" fontSize="17" fontWeight="800">Face approaching traffic</text>
      </> : kind === "crossing" ? <>
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

function DistanceGuidanceSign() {
  return (
    <SvgFrame label="Guidance sign showing destinations and distances">
      <rect x="314" y="250" width="12" height="70" fill="#475569" />
      <rect x="125" y="28" width="390" height="232" rx="12" fill="#167047" stroke="#ffffff" strokeWidth="8" />
      <text x="158" y="82" fill="#ffffff" fontSize="28" fontWeight="800">PRETORIA</text>
      <text x="477" y="82" textAnchor="end" fill="#ffffff" fontSize="28" fontWeight="800">58</text>
      <line x1="150" y1="104" x2="490" y2="104" stroke="#ffffff" strokeWidth="3" opacity="0.85" />
      <text x="158" y="151" fill="#ffffff" fontSize="28" fontWeight="800">MIDRAND</text>
      <text x="477" y="151" textAnchor="end" fill="#ffffff" fontSize="28" fontWeight="800">24</text>
      <line x1="150" y1="173" x2="490" y2="173" stroke="#ffffff" strokeWidth="3" opacity="0.85" />
      <text x="158" y="222" fill="#ffffff" fontSize="28" fontWeight="800">NEXT EXIT</text>
      <text x="477" y="222" textAnchor="end" fill="#ffffff" fontSize="28" fontWeight="800">2 km</text>
    </SvgFrame>
  );
}

function KeepLeftRoadScene() {
  return (
    <SvgFrame label="Keep left on a two-way road">
      <rect width="640" height="320" fill="#86b86b" />
      <rect x="125" width="390" height="320" fill="#4b5563" />
      <line x1="320" y1="0" x2="320" y2="320" stroke="#ffffff" strokeWidth="7" strokeDasharray="26 18" />
      <line x1="145" y1="0" x2="145" y2="320" stroke="#facc15" strokeWidth="8" />
      <line x1="495" y1="0" x2="495" y2="320" stroke="#facc15" strokeWidth="8" />
      <rect x="205" y="175" width="74" height="112" rx="13" fill="#2563eb" stroke="#ffffff" strokeWidth="4" />
      <rect x="219" y="192" width="46" height="30" rx="5" fill="#bfdbfe" />
      <circle cx="205" cy="205" r="8" fill="#111827" />
      <circle cx="279" cy="205" r="8" fill="#111827" />
      <circle cx="205" cy="264" r="8" fill="#111827" />
      <circle cx="279" cy="264" r="8" fill="#111827" />
      <path d="M242 155 L242 92 M220 116 L242 92 L264 116" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
      <text x="242" y="55" textAnchor="middle" fill="#ffffff" fontSize="20" fontWeight="900">KEEP LEFT</text>
      <rect x="372" y="38" width="74" height="112" rx="13" fill="#dc2626" stroke="#ffffff" strokeWidth="4" />
      <path d="M409 165 L409 225 M387 201 L409 225 L431 201" fill="none" stroke="#ffffff" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
    </SvgFrame>
  );
}

function inferVisual(questionText = "", visualType = "", visualAssetId = "") {
  const q = questionText.toLowerCase();

  if (q.includes("distance information") && q.includes("guidance sign")) {
    return <DistanceGuidanceSign />;
  }

  const fallbackVisuals = {
    fallback_warning_shape: <WarningOverview />,
    fallback_regulatory_shape: <RegulatoryOverviewSign />,
    fallback_guidance: <GuidanceSign />,
    fallback_solid_line: <RoadMarking kind="solid" />,
    fallback_broken_line: <RoadMarking />,
    fallback_yellow_edge: <RoadMarking kind="edge" />,
    fallback_stop_line: <RoadMarking kind="stop" />,
    fallback_chevron: <ChevronBoard />,
    fallback_children: <ChildrenWarning />,
    fallback_slippery: <SlipperyRoadWarning />,
    fallback_narrows: <RoadNarrowsWarning />,
    fallback_circle: <TrafficCircleSign />,
    fallback_railway: <RailwayWarning />,
    fallback_no_overtaking: <NoOvertakingSign />,
    fallback_no_parking: <NoParkingSign />,
    fallback_one_way: <OneWaySign />,
    fallback_lane_arrow: <RoadMarking kind="arrow" />,
    fallback_crossing: <RoadMarking kind="crossing" />,
    fallback_roadworks: <RoadworksSign />,
    fallback_hazard_marker: <HazardMarkerBoard />,
  };

  if (fallbackVisuals[visualAssetId]) return fallbackVisuals[visualAssetId];

  if (q.includes("normal two-way road") && q.includes("which side")) {
    return <KeepLeftRoadScene />;
  }

  // RM14 bicycle-lane questions need a dedicated road marking instead of the
  // generic centre-line fallback used by other road-marking questions.
  if (q.includes("bicycle lane") || q.includes("rm14")) {
    return (
      <SvgFrame label="RM14 bicycle lane road marking">
        <rect x="70" y="20" width="500" height="280" rx="18" fill="#4b5563" />
        <line
          x1="320"
          y1="20"
          x2="320"
          y2="300"
          stroke="#ffffff"
          strokeWidth="8"
          strokeDasharray="24 18"
        />

        <circle cx="410" cy="210" r="34" fill="none" stroke="#ffffff" strokeWidth="8" />
        <circle cx="510" cy="210" r="34" fill="none" stroke="#ffffff" strokeWidth="8" />

        <circle cx="458" cy="92" r="15" fill="#ffffff" />
        <path
          d="M458 112 L435 150 L475 150 L510 210 M435 150 L410 210 M435 150 L485 180 M485 180 L510 210"
          fill="none"
          stroke="#ffffff"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <path
          d="M460 260 L460 185 M440 210 L460 185 L480 210"
          fill="none"
          stroke="#ffffff"
          strokeWidth="8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </SvgFrame>
    );
  }

  // Exact regulatory-sign asset routing takes priority over text heuristics.
  const regulatoryVisuals = {
    visual_326: <StopSign />,
    visual_327: <StopLineScene />,
    visual_328: <YieldSign />,
    visual_329: <YieldPedestriansSign />,
    visual_330: <MiniCircleSign />,
    visual_331: <NoEntrySign />,
    visual_332: <OneWaySign />,
    visual_333: <SpeedSign speed="60" />,
    visual_334: <SpeedSign speed="60" />,
    visual_335: <KeepLeftSign />,
    visual_336: <ArrowCommandSign direction="downRight" label="Keep right regulatory sign" />,
    visual_337: <ArrowCommandSign direction="left" label="Proceed left only sign" />,
    visual_338: <ArrowCommandSign direction="right" label="Proceed right only sign" />,
    visual_339: <ArrowCommandSign direction="straight" label="Proceed straight only sign" />,
    visual_340: <ArrowCommandSign direction="turnLeft" label="Turn left sign" />,
    visual_341: <ArrowCommandSign direction="turnRight" label="Turn right sign" />,
    visual_342: <PedestriansOnlySign />,
    visual_343: <CyclesOnlySign />,
    visual_344: <MotorcycleOnlySign />,
    visual_345: <MotorCarsOnlySign />,
    visual_346: <ArrowCommandSign direction="straight" label="Regulatory command sign example" />,
    visual_347: <ProhibitionExampleSign />,
    visual_348: <TemporaryRegulatorySign variant="command" />,
    visual_349: <TemporaryRegulatorySign variant="prohibition" />,
    visual_350: <RegulatoryOverviewSign />,
  };

  if (regulatoryVisuals[visualAssetId]) return regulatoryVisuals[visualAssetId];


  const warningVisuals = {
    visual_351: <WarningOverview />,
    visual_352: <WarningOverview />,
    visual_353: <JunctionWarning kind="cross" />,
    visual_354: <JunctionWarning kind="tee" />,
    visual_355: <JunctionWarning kind="side" />,
    visual_356: <TrafficCircleSign />,
    visual_357: <CurveWarning kind="gentle" />,
    visual_358: <CurveWarning kind="sharp" />,
    visual_359: <CurveWarning kind="hairpin" />,
    visual_360: <CurveWarning kind="winding" />,
    visual_361: <LaneEndsWarning />,
    visual_362: <ChildrenWarning />,
    visual_363: <CyclistsWarning />,
    visual_364: <AnimalWarning />,
    visual_365: <AnimalWarning wild />,
    visual_366: <RailwayWarning />,
    visual_367: <SlopeWarning ascent />,
    visual_368: <SlopeWarning />,
    visual_369: <RoadNarrowsWarning />,
    visual_370: <SlipperyRoadWarning />,
    visual_371: <RoadworksSign />,
    visual_372: <WarningOverview />,
    visual_373: <WarningOverview />,
    visual_374: <WarningOverview />,
    visual_375: <WarningOverview />,
  };

  if (warningVisuals[visualAssetId]) return warningVisuals[visualAssetId];


  if (q.includes("stop sign")) return <StopSign />;
  if (q.includes("yield sign") || q.includes("give way sign")) return <YieldSign />;
  if (q.includes("no entry")) return <NoEntrySign />;
  if (q.includes("speed-limit") || q.includes("speed limit")) {
    const speed = (q.match(/\b(20|30|40|50|60|80|100|120)\b/) || [])[1] || "60";
    return <SpeedSign speed={speed} />;
  }
  if (q.includes("traffic circle") || q.includes("roundabout")) return <TrafficCircleSign />;
  if (q.includes("pedestrian") && ((visualType || "").includes("sign") || q.includes("sign"))) return <PedestrianSign />;
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
    if (q.includes("pedestrian") && (q.includes("no pavement") || q.includes("walking along"))) {
      return <RoadScene kind="roadsidePedestrian" />;
    }
    return <RoadScene kind="intersection" />;
  }

  return null;
}

export default function K53Visual({ visualAssetId, visualType, questionText }) {
  const visual = inferVisual(questionText, visualType, visualAssetId);
  if (!visual) return null;

  return (
    <div data-visual-id={visualAssetId || undefined} style={{ margin: "12px 0 20px" }}>
      {visual}
    </div>
  );
}
