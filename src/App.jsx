import { useState, useRef, useEffect } from "react";

const VIEWS = { HOME: "home", SCAN: "scan", STOPS: "stops", ROUTE: "route" };
const EV_PROFILES = {
  light:  { label: "Light EV",  range: 150, regen: 0.18, consumption: 14 },
  sedan:  { label: "EV Sedan",  range: 280, regen: 0.22, consumption: 18 },
  van:    { label: "EV Van",    range: 200, regen: 0.15, consumption: 28 },
};

// ── SVG ICONS ─────────────────────────────────────────────────────────────────
const IcoLightning = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
const IcoCamera = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IcoPackage = ({ size = 48, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IcoNote = ({ size = 12, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
  </svg>
);
const IcoMap = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
    <line x1="8" y1="2" x2="8" y2="18" />
    <line x1="16" y1="6" x2="16" y2="22" />
  </svg>
);
const IcoCar = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M5 17H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v9a2 2 0 0 1-2 2h-2" />
    <circle cx="7.5" cy="17.5" r="2.5" />
    <circle cx="17.5" cy="17.5" r="2.5" />
  </svg>
);
const IcoClipboard = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);
const IcoEye = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);
const IcoEyeOff = ({ size = 15, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);
const IcoX = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" style={{ display: "block", flexShrink: 0 }}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcoArrowRight = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcoUpload = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <polyline points="16 16 12 12 8 16" />
    <line x1="12" y1="12" x2="12" y2="21" />
    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
  </svg>
);
const IcoArrowLeft = ({ size = 14, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "block", flexShrink: 0 }}>
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

// Haversine distance in miles
const haversine = (a, b) => {
  const R = 3958.8;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;
  const x = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
};

// Nearest-neighbour TSP fallback
const tspNN = (pts) => {
  if (pts.length <= 1) return pts.map((_, i) => i);
  const visited = new Set([0]);
  const order = [0];
  while (order.length < pts.length) {
    const last = pts[order[order.length - 1]];
    let best = Infinity, bi = -1;
    pts.forEach((p, i) => { if (!visited.has(i)) { const d = haversine(last, p); if (d < best) { best = d; bi = i; } } });
    visited.add(bi); order.push(bi);
  }
  return order;
};

// ORS geocode
const geocode = async (address, key) => {
  if (!key) return { lat: 51.505 + (Math.random() - 0.5) * 0.09, lng: -0.09 + (Math.random() - 0.5) * 0.13 };
  const r = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${key}&text=${encodeURIComponent(address)}&size=1`);
  const d = await r.json();
  const [lng, lat] = d.features?.[0]?.geometry?.coordinates || [0, 0];
  return { lat, lng };
};

// ORS optimization
const orsOptimize = async (depotCoord, stopCoords, key) => {
  if (!key) return null;
  const body = {
    jobs: stopCoords.map((c, i) => ({ id: i + 1, location: [c.lng, c.lat] })),
    vehicles: [{ id: 1, profile: "driving-car", start: [depotCoord.lng, depotCoord.lat], end: [depotCoord.lng, depotCoord.lat] }],
  };
  const r = await fetch(`https://api.openrouteservice.org/optimization?api_key=${key}`, {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const d = await r.json();
  return d.routes?.[0]?.steps?.filter(s => s.type === "job").map(s => s.id) || null;
};

// ORS elevation
const getElevation = async (coords, key) => {
  const fallback = coords.map((_, i) => 15 + Math.sin(i * 1.1) * 28 + Math.cos(i * 0.7) * 18);
  if (!key || coords.length < 2) return fallback;
  try {
    const r = await fetch(`https://api.openrouteservice.org/elevation/line?api_key=${key}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ format_in: "geojson", geometry: { type: "LineString", coordinates: coords.map(c => [c.lng, c.lat]) } }),
    });
    const d = await r.json();
    return d.geometry?.coordinates?.map(c => c[2]) || fallback;
  } catch { return fallback; }
};

// ── MINI MAP ─────────────────────────────────────────────────────────────────
function MiniMap({ stops, depot }) {
  if (!stops?.length || !depot) return null;
  const all = [depot, ...stops];
  const lats = all.map(s => s.lat), lngs = all.map(s => s.lng);
  const minLat = Math.min(...lats), maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs), maxLng = Math.max(...lngs);
  const W = 360, H = 190, PAD = 22;
  const tx = lng => PAD + ((lng - minLng) / (maxLng - minLng || 0.001)) * (W - PAD * 2);
  const ty = lat => H - PAD - ((lat - minLat) / (maxLat - minLat || 0.001)) * (H - PAD * 2);
  const dp = { x: tx(depot.lng), y: ty(depot.lat) };
  const pts = stops.map(s => ({ x: tx(s.lng), y: ty(s.lat) }));
  const path = [dp, ...pts].map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", borderRadius: 12, background: "#0a0f18", display: "block" }}>
      <path d={path} fill="none" stroke="#1D9E75" strokeWidth="1.5" strokeDasharray="5 3" opacity="0.6" />
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={6} fill="#1D9E75" opacity="0.9" />
          <text x={p.x + 8} y={p.y + 4} fontSize="9" fill="rgba(255,255,255,0.55)" fontFamily="monospace">{i + 1}</text>
        </g>
      ))}
      <circle cx={dp.x} cy={dp.y} r={7} fill="#378ADD" />
      <text x={dp.x + 9} y={dp.y + 4} fontSize="9" fill="rgba(255,255,255,0.6)" fontFamily="monospace">D</text>
    </svg>
  );
}

// ── ELEV CHART ────────────────────────────────────────────────────────────────
function ElevChart({ elevations }) {
  if (!elevations?.length) return null;
  const W = 360, H = 72, PAD = 6;
  const min = Math.min(...elevations), max = Math.max(...elevations);
  const pts = elevations.map((e, i) => ({
    x: PAD + (i / Math.max(elevations.length - 1, 1)) * (W - PAD * 2),
    y: H - PAD - ((e - min) / (max - min || 1)) * (H - PAD * 2),
  }));
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
  const area = `${line} L${pts[pts.length - 1].x},${H} L${pts[0].x},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: 72, display: "block" }}>
      <defs>
        <linearGradient id="elg" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#1D9E75" stopOpacity="0.32" />
          <stop offset="100%" stopColor="#1D9E75" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#elg)" />
      <path d={line} fill="none" stroke="#1D9E75" strokeWidth="2" />
      {pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="3" fill="#1D9E75" />)}
    </svg>
  );
}

// ── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView]                   = useState(VIEWS.HOME);
  const [stops, setStops]                 = useState([]);
  const [depot, setDepot]                 = useState("1 Market St, San Francisco, CA 94105");
  const [evProfile, setEvProfile]         = useState("sedan");
  const [battery, setBattery]             = useState(85);
  const [orsKey, setOrsKey]               = useState("");
  const [anthropicKey, setAnthropicKey]   = useState("");
  const [showOrsKey, setShowOrsKey]       = useState(false);
  const [showAnthropicKey, setShowAnthropicKey] = useState(false);

  const [scanning, setScanning]       = useState(false);
  const [processing, setProcessing]   = useState(false);
  const [optimizing, setOptimizing]   = useState(false);
  const [capturedImg, setCapturedImg] = useState(null);
  const [extracted, setExtracted]     = useState(null);
  const [camErr, setCamErr]           = useState(null);
  const [toast, setToast]             = useState(null);
  const [route, setRoute]             = useState(null);

  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const fileRef   = useRef(null);

  const notify = (msg, type = "ok") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  // ── CAMERA ────────────────────────────────────────────────────────────────
  const startCam = async () => {
    setCamErr(null); setScanning(true); setCapturedImg(null); setExtracted(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" }, width: { ideal: 1920 } } });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
    } catch { setCamErr("Camera unavailable — use the upload button below."); setScanning(false); }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null; setScanning(false);
  };

  const snap = () => {
    const v = videoRef.current; if (!v) return;
    const c = canvasRef.current;
    c.width = v.videoWidth; c.height = v.videoHeight;
    c.getContext("2d").drawImage(v, 0, 0);
    const img = c.toDataURL("image/jpeg", 0.92);
    setCapturedImg(img); stopCam(); runExtract(img);
  };

  const onFile = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { setCapturedImg(ev.target.result); setScanning(false); runExtract(ev.target.result); };
    r.readAsDataURL(f); e.target.value = "";
  };

  useEffect(() => {
    if (view === VIEWS.SCAN && !scanning && !capturedImg) startCam();
    if (view !== VIEWS.SCAN) stopCam();
  }, [view]);

  // ── AI EXTRACTION ─────────────────────────────────────────────────────────
  const runExtract = async (imgData) => {
    if (!anthropicKey) { notify("Add your Claude API key in Setup first", "err"); setProcessing(false); return; }
    setProcessing(true); setExtracted(null);
    try {
      const base64 = imgData.split(",")[1];
      const mime   = imgData.startsWith("data:image/png") ? "image/png" : "image/jpeg";
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-6", max_tokens: 500,
          messages: [{ role: "user", content: [
            { type: "image", source: { type: "base64", media_type: mime, data: base64 } },
            { type: "text", text: `Extract the DELIVERY (recipient) address from this postal label. Reply ONLY with raw JSON, no markdown:\n{"name":"recipient name or company","address":"full street address, city, state zip","notes":"special delivery note or empty string","confidence":"high|medium|low"}\nIf no address visible: {"error":"no address found"}` }
          ]}]
        })
      });
      const d   = await res.json();
      const txt = (d.content?.[0]?.text || "{}").replace(/```[a-z]*/g, "").replace(/```/g, "").trim();
      setExtracted(JSON.parse(txt));
    } catch { setExtracted({ error: "Could not parse — try a clearer photo." }); }
    setProcessing(false);
  };

  const confirmStop = async () => {
    if (!extracted || extracted.error) return;
    setProcessing(true);
    const coords = await geocode(extracted.address, orsKey).catch(() => ({ lat: 51.505 + Math.random()*0.05, lng: -0.09 + Math.random()*0.05 }));
    const stop = { id: Date.now(), name: extracted.name || "Recipient", address: extracted.address, notes: extracted.notes || "", ...coords };
    setStops(p => [...p, stop]);
    notify(`Added: ${stop.name}`);
    setCapturedImg(null); setExtracted(null); setProcessing(false);
    startCam();
  };

  // ── OPTIMISE ──────────────────────────────────────────────────────────────
  const optimise = async () => {
    if (!stops.length) { notify("Add at least 1 stop", "err"); return; }
    setOptimizing(true);
    try {
      const depotCoord  = await geocode(depot, orsKey);
      const stopCoords  = stops.map(s => ({ lat: s.lat, lng: s.lng }));
      // Route order
      let order = await orsOptimize(depotCoord, stopCoords, orsKey).catch(() => null);
      if (!order) order = tspNN(stopCoords).map(i => i + 1);
      const orderedStops = order.map(i => stops[i - 1]).filter(Boolean);

      // Elevation
      const elevCoords  = [depotCoord, ...orderedStops.map(s => ({ lat: s.lat, lng: s.lng }))];
      const elevations  = await getElevation(elevCoords, orsKey);

      // Stats
      let totalDist = 0, elevGain = 0, elevLoss = 0;
      for (let i = 0; i < orderedStops.length; i++) {
        const from = i === 0 ? depotCoord : orderedStops[i - 1];
        totalDist += haversine(from, orderedStops[i]);
        const dE = (elevations[i + 1] || 0) - (elevations[i] || 0);
        if (dE > 0) elevGain += dE; else elevLoss += Math.abs(dE);
      }
      const prof     = EV_PROFILES[evProfile];
      const regenPct = prof.regen * 100 * (elevLoss / Math.max(elevGain + elevLoss, 1));
      const energyEff = 1 - prof.regen * (elevLoss / Math.max(elevGain + elevLoss, 1));
      const battUsed  = Math.min(battery, (totalDist * prof.consumption / 1000) / (prof.range * prof.consumption / 1000) * 100 * energyEff);
      const battLeft  = Math.max(0, battery - battUsed);

      setRoute({ stops: orderedStops, totalDist, elevGain, elevLoss, battUsed, battLeft, regenPct, elevations: elevations.slice(1), depotCoord });
      setView(VIEWS.ROUTE);
    } catch (e) { notify("Optimisation error", "err"); console.error(e); }
    setOptimizing(false);
  };

  // ── EXPORT ────────────────────────────────────────────────────────────────
  const exportGoogle = () => {
    if (!route?.stops.length) return;
    const enc = s => encodeURIComponent(s);
    const mid = route.stops.slice(0, -1).map(s => enc(s.address)).join("|");
    const dst = enc(route.stops[route.stops.length - 1].address);
    window.open(`https://www.google.com/maps/dir/?api=1&origin=${enc(depot)}&destination=${dst}&waypoints=${mid}&travelmode=driving`, "_blank");
  };

  const exportWaze = () => {
    if (!route?.stops[0]) return;
    const f = route.stops[0];
    window.open(`https://waze.com/ul?ll=${f.lat},${f.lng}&navigate=yes`, "_blank");
    notify("Waze navigates to stop 1 — continue manually through stops");
  };

  const copyList = () => {
    const body = route.stops.map((s, i) => `${i + 1}. ${s.name}\n   ${s.address}${s.notes ? "\n   Note: " + s.notes : ""}`).join("\n\n");
    navigator.clipboard.writeText(`DELIVERY ROUTE — ${new Date().toLocaleDateString()}\nDepot: ${depot}\n\n${body}`);
    notify("Stop list copied to clipboard");
  };

  // ── SHARED STYLES ─────────────────────────────────────────────────────────
  const card  = { background: "#0d1220", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 14, padding: "1.1rem 1.2rem" };
  const btn   = (bg, col, extra = {}) => ({ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7, border: "none", borderRadius: 11, padding: "11px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", background: bg, color: col, transition: "opacity 0.15s, transform 0.1s", ...extra });
  const lbl   = { fontSize: 10.5, fontWeight: 700, letterSpacing: "0.09em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", display: "block", marginBottom: 6 };
  const inp   = { width: "100%", padding: "9px 12px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 9, color: "#e8ecf5", fontSize: 13, boxSizing: "border-box", outline: "none" };
  const tag   = (bg, col) => ({ display: "inline-block", padding: "3px 9px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: bg, color: col, border: `1px solid ${col}44` });
  const battCol = battery > 50 ? "#1D9E75" : battery > 20 ? "#EF9F27" : "#E24B4A";

  return (
    <div style={{ fontFamily: "'Outfit', system-ui, sans-serif", minHeight: "100vh", background: "#060a10", color: "#e8ecf5" }}>
      <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box}
        input:focus{border-color:rgba(29,158,117,0.55)!important;box-shadow:0 0 0 3px rgba(29,158,117,0.1)!important}
        input[type=range]{accent-color:#1D9E75;width:100%}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes up{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes tin{from{opacity:0;transform:translateX(14px)}to{opacity:1;transform:translateX(0)}}
        .hvr:hover{opacity:0.82} .hvr:active{transform:scale(0.97)}
        .stop-row:hover{background:rgba(255,255,255,0.03)!important}
      `}</style>

      {/* NAV */}
      <div style={{ background: "#0d1220", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "0 1rem", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg,#1D9E75,#378ADD)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <IcoLightning size={14} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: 15, letterSpacing: -0.4 }}>RouteEV</span>
        </div>
        <div style={{ display: "flex", gap: 3 }}>
          {[{ k: VIEWS.HOME, l: "Setup" }, { k: VIEWS.SCAN, l: "Scan" }, { k: VIEWS.STOPS, l: `Stops${stops.length ? ` (${stops.length})` : ""}` }, { k: VIEWS.ROUTE, l: "Route" }].map(({ k, l }) => (
            <button key={k} onClick={() => setView(k)} className="hvr" style={{ ...btn(view === k ? "rgba(29,158,117,0.18)" : "transparent", view === k ? "#1D9E75" : "rgba(255,255,255,0.4)"), padding: "6px 10px", fontSize: 12, border: view === k ? "1px solid rgba(29,158,117,0.35)" : "1px solid transparent" }}>{l}</button>
          ))}
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: "fixed", top: 62, right: 14, zIndex: 999, background: toast.type === "err" ? "#b91c1c" : "#0F6E56", color: "white", padding: "9px 15px", borderRadius: 10, fontSize: 13, fontWeight: 600, animation: "tin 0.2s ease", boxShadow: "0 4px 20px rgba(0,0,0,0.4)", maxWidth: 290 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ maxWidth: 500, margin: "0 auto", padding: "1.5rem 1.1rem 5rem" }}>

        {/* ── HOME ─────────────────────────────────────────────────────── */}
        {view === VIEWS.HOME && (
          <div style={{ animation: "up 0.35s ease" }}>
            <div style={{ marginBottom: "2rem" }}>
              <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: -0.6, lineHeight: 1.15, marginBottom: 8 }}>
                Smart EV<br /><span style={{ color: "#1D9E75" }}>Delivery Routes</span>
              </h1>
              <p style={{ fontSize: 13.5, color: "rgba(255,255,255,0.38)", lineHeight: 1.65 }}>
                Scan postal labels with your phone camera. Claude AI extracts addresses. OpenRouteService builds a battery-optimised route that recovers energy on downhills.
              </p>
            </div>

            {/* Claude API key */}
            <div style={{ ...card, marginBottom: 10, borderColor: anthropicKey ? "rgba(29,158,117,0.28)" : "rgba(224,72,74,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={lbl}>Claude API Key</span>
                <span style={tag(anthropicKey ? "rgba(29,158,117,0.15)" : "rgba(224,72,74,0.15)", anthropicKey ? "#1D9E75" : "#E24B4A")}>{anthropicKey ? "✓ ready" : "required"}</span>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <input
                  type={showAnthropicKey ? "text" : "password"}
                  placeholder="sk-ant-… from console.anthropic.com"
                  value={anthropicKey}
                  onChange={e => setAnthropicKey(e.target.value)}
                  style={{ ...inp, flex: 1 }}
                  autoComplete="off"
                />
                <button onClick={() => setShowAnthropicKey(p => !p)} className="hvr" aria-label={showAnthropicKey ? "Hide key" : "Show key"} style={{ ...btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.5)"), padding: "9px 11px" }}>
                  {showAnthropicKey ? <IcoEyeOff size={15} /> : <IcoEye size={15} />}
                </button>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 7, lineHeight: 1.5 }}>
                Required for label scanning. Get a free key at console.anthropic.com.
              </div>
            </div>

            {/* ORS key */}
            <div style={{ ...card, marginBottom: 10, borderColor: orsKey ? "rgba(29,158,117,0.28)" : "rgba(239,159,39,0.25)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={lbl}>OpenRouteService API Key</span>
                <span style={tag(orsKey ? "rgba(29,158,117,0.15)" : "rgba(239,159,39,0.15)", orsKey ? "#1D9E75" : "#EF9F27")}>{orsKey ? "✓ live" : "demo mode"}</span>
              </div>
              <div style={{ display: "flex", gap: 7 }}>
                <input type={showOrsKey ? "text" : "password"} placeholder="Free key → openrouteservice.org" value={orsKey} onChange={e => setOrsKey(e.target.value)} style={{ ...inp, flex: 1 }} />
                <button onClick={() => setShowOrsKey(p => !p)} className="hvr" aria-label={showOrsKey ? "Hide key" : "Show key"} style={{ ...btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.5)"), padding: "9px 11px" }}>
                  {showOrsKey ? <IcoEyeOff size={15} /> : <IcoEye size={15} />}
                </button>
              </div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.25)", marginTop: 7, lineHeight: 1.5 }}>
                Without a key: nearest-neighbour routing + simulated elevation. Free ORS key gives real optimisation + real elevation data.
              </div>
            </div>

            {/* EV settings */}
            <div style={{ ...card, marginBottom: 10 }}>
              <span style={lbl}>Vehicle profile</span>
              <div style={{ display: "flex", gap: 7, marginBottom: 14 }}>
                {Object.entries(EV_PROFILES).map(([k, v]) => (
                  <button key={k} onClick={() => setEvProfile(k)} className="hvr" style={{ flex: 1, padding: "9px 4px", borderRadius: 9, border: evProfile === k ? "1.5px solid #1D9E75" : "1px solid rgba(255,255,255,0.09)", background: evProfile === k ? "rgba(29,158,117,0.13)" : "transparent", color: evProfile === k ? "#1D9E75" : "rgba(255,255,255,0.4)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{v.label}</button>
                ))}
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                <span style={lbl}>Starting battery</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: battCol }}>{battery}%</span>
              </div>
              <input type="range" min="5" max="100" step="1" value={battery} onChange={e => setBattery(+e.target.value)} style={{ marginBottom: 14 }} />

              <span style={lbl}>Depot / start address</span>
              <input value={depot} onChange={e => setDepot(e.target.value)} style={inp} placeholder="Start address" />
            </div>

            <button onClick={() => setView(VIEWS.SCAN)} className="hvr" style={{ ...btn("#1D9E75", "white"), width: "100%", padding: "13px", fontSize: 15, fontWeight: 700, marginBottom: 8 }}>
              <IcoCamera size={17} color="white" /> Start scanning labels
            </button>
            <button onClick={() => {
              setStops([
                { id: 1, name: "Alice Wong",   address: "742 Evergreen Terrace, Springfield, IL 62701", notes: "Ring bell",     lat: 51.510, lng: -0.075 },
                { id: 2, name: "Bob Martinez", address: "1600 Pennsylvania Ave NW, Washington DC 20500", notes: "",             lat: 51.498, lng: -0.086 },
                { id: 3, name: "Carla Nguyen", address: "221B Baker St, London NW1 6XE",                 notes: "Leave at door", lat: 51.523, lng: -0.094 },
                { id: 4, name: "David Lee",    address: "350 Fifth Ave, New York, NY 10118",             notes: "",             lat: 51.505, lng: -0.107 },
                { id: 5, name: "Eva Kowalski", address: "1 Infinite Loop, Cupertino, CA 95014",          notes: "Fragile",      lat: 51.516, lng: -0.100 },
              ]);
              notify("5 sample stops loaded"); setView(VIEWS.STOPS);
            }} className="hvr" style={{ ...btn("rgba(255,255,255,0.05)", "rgba(255,255,255,0.4)"), width: "100%", padding: "11px", fontSize: 13, border: "1px solid rgba(255,255,255,0.09)" }}>
              Load 5 demo stops
            </button>
          </div>
        )}

        {/* ── SCAN ─────────────────────────────────────────────────────── */}
        {view === VIEWS.SCAN && (
          <div style={{ animation: "up 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700 }}>Scan Label</h2>
              <span style={tag("rgba(55,138,221,0.15)", "#378ADD")}>{stops.length} scanned</span>
            </div>

            {/* Viewfinder */}
            <div style={{ borderRadius: 16, overflow: "hidden", background: "#080c14", aspectRatio: "4/3", position: "relative", marginBottom: 10, border: "1px solid rgba(255,255,255,0.07)" }}>
              {scanning && (
                <>
                  <video ref={videoRef} autoPlay playsInline muted style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
                    <div style={{ width: "72%", height: "44%", border: "2px solid #1D9E75", borderRadius: 12, boxShadow: "0 0 0 2000px rgba(0,0,0,0.38)" }}>
                      <div style={{ position: "absolute", top: -15, left: "50%", transform: "translateX(-50%)", fontSize: 9.5, fontWeight: 800, color: "#1D9E75", letterSpacing: "0.1em", background: "#060a10", padding: "2px 9px", borderRadius: 4 }}>ALIGN LABEL IN FRAME</div>
                    </div>
                  </div>
                  <div style={{ position: "absolute", bottom: 18, left: 0, right: 0, display: "flex", justifyContent: "center" }}>
                    <button onClick={snap} aria-label="Capture photo" style={{ width: 62, height: 62, borderRadius: "50%", background: "white", border: "4px solid rgba(255,255,255,0.25)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 7px rgba(255,255,255,0.08)" }}>
                      <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1D9E75" }} />
                    </button>
                  </div>
                </>
              )}
              {capturedImg && !scanning && <img src={capturedImg} alt="Captured label" style={{ width: "100%", height: "100%", objectFit: "contain" }} />}
              {!scanning && !capturedImg && (
                <div style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  {camErr && <div style={{ color: "#EF9F27", fontSize: 13, textAlign: "center", maxWidth: 260, lineHeight: 1.5 }}>{camErr}</div>}
                  <button onClick={startCam} className="hvr" style={{ ...btn("#1D9E75", "white") }}>Open Camera</button>
                </div>
              )}
            </div>
            <canvas ref={canvasRef} style={{ display: "none" }} />

            {/* AI processing */}
            {processing && (
              <div style={{ ...card, textAlign: "center", marginBottom: 10, animation: "up 0.25s ease" }}>
                <div style={{ width: 26, height: 26, border: "2.5px solid rgba(29,158,117,0.2)", borderTopColor: "#1D9E75", borderRadius: "50%", animation: "spin 0.7s linear infinite", margin: "0 auto 10px" }} />
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>Extracting address…</div>
              </div>
            )}

            {/* Extracted OK */}
            {extracted && !extracted.error && !processing && (
              <div style={{ ...card, borderColor: "rgba(29,158,117,0.4)", marginBottom: 10, animation: "up 0.25s ease" }}>
                <div style={{ display: "flex", gap: 6, marginBottom: 9 }}>
                  <span style={tag("rgba(29,158,117,0.15)", "#1D9E75")}>✓ extracted</span>
                  <span style={tag(extracted.confidence === "high" ? "rgba(29,158,117,0.12)" : extracted.confidence === "medium" ? "rgba(239,159,39,0.12)" : "rgba(224,72,74,0.12)", extracted.confidence === "high" ? "#1D9E75" : extracted.confidence === "medium" ? "#EF9F27" : "#E24B4A")}>{extracted.confidence}</span>
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{extracted.name}</div>
                <div style={{ fontSize: 12.5, color: "rgba(255,255,255,0.42)", lineHeight: 1.55, marginBottom: extracted.notes ? 8 : 12 }}>{extracted.address}</div>
                {extracted.notes && (
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#EF9F27", background: "rgba(239,159,39,0.1)", borderRadius: 7, padding: "5px 10px", marginBottom: 12 }}>
                    <IcoNote size={12} color="#EF9F27" /> {extracted.notes}
                  </div>
                )}
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={confirmStop} disabled={processing} className="hvr" style={{ ...btn("#1D9E75", "white"), flex: 2 }}>
                    Add to route <IcoArrowRight size={14} color="white" />
                  </button>
                  <button onClick={() => { setCapturedImg(null); setExtracted(null); startCam(); }} className="hvr" style={{ ...btn("rgba(255,255,255,0.07)", "rgba(255,255,255,0.5)"), flex: 1 }}>Rescan</button>
                </div>
              </div>
            )}

            {/* Extracted error */}
            {extracted?.error && !processing && (
              <div style={{ ...card, borderColor: "rgba(224,72,74,0.3)", marginBottom: 10, color: "#E24B4A", fontSize: 13 }}>
                ⚠ {extracted.error}
                <button onClick={() => { setCapturedImg(null); setExtracted(null); startCam(); }} style={{ display: "block", marginTop: 8, background: "none", border: "none", color: "#E24B4A", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>Try again</button>
              </div>
            )}

            {/* File upload */}
            <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
            <button onClick={() => fileRef.current?.click()} className="hvr" style={{ ...btn("rgba(255,255,255,0.04)", "rgba(255,255,255,0.35)"), width: "100%", border: "1px solid rgba(255,255,255,0.09)", fontSize: 13 }}>
              <IcoUpload size={14} /> Upload from gallery
            </button>
            {stops.length >= 1 && (
              <button onClick={() => setView(VIEWS.STOPS)} className="hvr" style={{ ...btn("rgba(29,158,117,0.1)", "#1D9E75"), width: "100%", marginTop: 8, border: "1px solid rgba(29,158,117,0.28)", fontSize: 13 }}>
                View {stops.length} stops <IcoArrowRight size={14} color="#1D9E75" />
              </button>
            )}
          </div>
        )}

        {/* ── STOPS ────────────────────────────────────────────────────── */}
        {view === VIEWS.STOPS && (
          <div style={{ animation: "up 0.3s ease" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              <h2 style={{ fontSize: 19, fontWeight: 700 }}>Delivery Stops</h2>
              <button onClick={() => setView(VIEWS.SCAN)} className="hvr" style={{ ...btn("#1D9E75", "white"), padding: "7px 12px", fontSize: 12 }}>+ Scan</button>
            </div>

            {stops.length === 0 ? (
              <div style={{ textAlign: "center", paddingTop: "3.5rem", color: "rgba(255,255,255,0.25)" }}>
                <div style={{ display: "flex", justifyContent: "center", marginBottom: 12 }}>
                  <IcoPackage size={48} color="rgba(255,255,255,0.2)" />
                </div>
                <div style={{ fontSize: 14 }}>No stops yet — scan labels or load demo data from Setup.</div>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: 14 }}>
                  {stops.map((s, i) => (
                    <div key={s.id} className="stop-row" style={{ display: "flex", alignItems: "flex-start", gap: 11, padding: "11px 10px", borderBottom: i < stops.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: "rgba(255,255,255,0.015)", borderRadius: i === 0 ? "12px 12px 0 0" : i === stops.length - 1 ? "0 0 12px 12px" : 0 }}>
                      <div style={{ minWidth: 26, height: 26, borderRadius: 7, background: "rgba(29,158,117,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#1D9E75" }}>{i + 1}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 2 }}>{s.name}</div>
                        <div style={{ fontSize: 11.5, color: "rgba(255,255,255,0.35)", lineHeight: 1.45, wordBreak: "break-word" }}>{s.address}</div>
                        {s.notes && (
                          <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#EF9F27", marginTop: 3 }}>
                            <IcoNote size={11} color="#EF9F27" /> {s.notes}
                          </div>
                        )}
                      </div>
                      {/* Delete button with proper 44px touch target */}
                      <button
                        onClick={() => setStops(p => p.filter(x => x.id !== s.id))}
                        aria-label={`Remove ${s.name}`}
                        style={{ background: "none", border: "none", color: "rgba(224,72,74,0.5)", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center", width: 44, height: 44, borderRadius: 8, flexShrink: 0, marginTop: -9, marginRight: -8 }}
                      >
                        <IcoX size={16} color="rgba(224,72,74,0.6)" />
                      </button>
                    </div>
                  ))}
                </div>

                <button onClick={optimise} disabled={optimizing} className="hvr" style={{ ...btn(optimizing ? "rgba(255,255,255,0.05)" : "#1D9E75", optimizing ? "rgba(255,255,255,0.3)" : "white"), width: "100%", padding: "13px", fontSize: 15, fontWeight: 700, cursor: optimizing ? "not-allowed" : "pointer" }}>
                  {optimizing
                    ? <><div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} /> Optimising route…</>
                    : <><IcoLightning size={16} color="white" /> Optimise EV route ({stops.length} stops)</>}
                </button>
                <button onClick={() => { if (window.confirm("Clear all stops?")) setStops([]); }} className="hvr" style={{ ...btn("transparent", "rgba(224,72,74,0.4)"), width: "100%", marginTop: 7, fontSize: 12 }}>Clear all stops</button>
              </>
            )}
          </div>
        )}

        {/* ── ROUTE ────────────────────────────────────────────────────── */}
        {view === VIEWS.ROUTE && (
          !route ? (
            <div style={{ textAlign: "center", paddingTop: "3.5rem" }}>
              <div style={{ fontSize: 14, color: "rgba(255,255,255,0.3)", marginBottom: 16 }}>No optimised route yet.</div>
              <button onClick={() => setView(VIEWS.STOPS)} className="hvr" style={{ ...btn("#1D9E75", "white") }}>
                Go to stops <IcoArrowRight size={14} color="white" />
              </button>
            </div>
          ) : (
            <div style={{ animation: "up 0.35s ease" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <h2 style={{ fontSize: 19, fontWeight: 700 }}>Optimised Route</h2>
                <span style={tag("rgba(29,158,117,0.15)", "#1D9E75")}>{route.stops.length} stops</span>
              </div>

              {/* Stats */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7, marginBottom: 12 }}>
                {[
                  { l: "Distance",     v: `${route.totalDist.toFixed(1)} mi` },
                  { l: "Battery used", v: `${route.battUsed.toFixed(0)}%`,   c: route.battUsed > 50 ? "#EF9F27" : "#1D9E75" },
                  { l: "Remaining",    v: `${route.battLeft.toFixed(0)}%`,   c: route.battLeft < 20 ? "#E24B4A" : "#1D9E75" },
                  { l: "Elev gain",    v: `${route.elevGain.toFixed(0)} ft` },
                  { l: "Elev loss",    v: `${route.elevLoss.toFixed(0)} ft` },
                  { l: "Regen",        v: `+${route.regenPct.toFixed(1)}%`, c: "#378ADD" },
                ].map((c, i) => (
                  <div key={i} style={{ background: "#0d1220", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "9px 8px", textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: "rgba(255,255,255,0.28)", marginBottom: 4, letterSpacing: "0.07em", textTransform: "uppercase" }}>{c.l}</div>
                    <div style={{ fontSize: 15.5, fontWeight: 700, color: c.c || "#e8ecf5" }}>{c.v}</div>
                  </div>
                ))}
              </div>

              {/* Mini map */}
              <div style={{ marginBottom: 12 }}>
                <MiniMap stops={route.stops} depot={route.depotCoord} />
              </div>

              {/* Elevation */}
              <div style={{ ...card, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10 }}>Elevation profile</div>
                <ElevChart elevations={route.elevations} />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)" }}>↑ climbs drain battery</span>
                  <span style={{ fontSize: 10, color: "#378ADD" }}>↓ downhills recover regen</span>
                </div>
              </div>

              {/* Stop list */}
              <div style={{ ...card, marginBottom: 12 }}>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 11 }}>Stop order</div>
                <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 9, paddingBottom: 9, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: "rgba(55,138,221,0.18)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#378ADD" }}>D</div>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.35)" }}>{depot}</span>
                </div>
                {route.stops.map((s, i) => (
                  <div key={s.id || i} style={{ display: "flex", alignItems: "flex-start", gap: 9, paddingBottom: 9, marginBottom: 9, borderBottom: i < route.stops.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <div style={{ minWidth: 22, height: 22, borderRadius: 6, background: "rgba(29,158,117,0.16)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9.5, fontWeight: 800, color: "#1D9E75" }}>{i + 1}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{s.name}</div>
                      <div style={{ fontSize: 11, color: "rgba(255,255,255,0.32)", lineHeight: 1.4 }}>{s.address}</div>
                      {s.notes && (
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 11, color: "#EF9F27" }}>
                          <IcoNote size={11} color="#EF9F27" /> {s.notes}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Export */}
              <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
                <button onClick={exportGoogle} className="hvr" style={{ ...btn("#4285F4", "white"), flex: 1, fontSize: 13 }}>
                  <IcoMap size={15} color="white" /> Google Maps
                </button>
                <button onClick={exportWaze} className="hvr" style={{ ...btn("#33CCFF", "#060a10"), flex: 1, fontSize: 13 }}>
                  <IcoCar size={15} color="#060a10" /> Waze
                </button>
              </div>
              <button onClick={copyList} className="hvr" style={{ ...btn("rgba(255,255,255,0.05)", "rgba(255,255,255,0.45)"), width: "100%", border: "1px solid rgba(255,255,255,0.09)", fontSize: 13 }}>
                <IcoClipboard size={15} /> Copy stop list
              </button>

              <button onClick={() => { setRoute(null); setView(VIEWS.STOPS); }} className="hvr" style={{ ...btn("transparent", "rgba(255,255,255,0.25)"), width: "100%", marginTop: 8, fontSize: 12 }}>
                <IcoArrowLeft size={14} /> Back to stops
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
