import { useEffect, useMemo, useRef, useState } from "react";

const toMin = (hhmm) => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + (m || 0);
};

const fmtKTime = (m) => {
  let h = Math.floor(m / 60);
  const isAm = h < 12;
  const labelHour = h % 12 === 0 ? 12 : h % 12;
  return `${isAm ? "오전" : "오후"} ${labelHour}시`;
};

function toSmoothPath(points, tension = 0.4) {
  if (points.length < 2) return "";
  const d = [];
  d.push(`M ${points[0].x} ${points[0].y}`);
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] || points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] || p2;

    const cp1x = p1.x + ((p2.x - p0.x) * tension) / 6;
    const cp1y = p1.y + ((p2.y - p0.y) * tension) / 6;
    const cp2x = p2.x - ((p3.x - p1.x) * tension) / 6;
    const cp2y = p2.y - ((p3.y - p1.y) * tension) / 6;

    d.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`);
  }
  return d.join(" ");
}

export default function HeatRiskTimeline({
  data = [], // [{ time: 'HH:MM', score: number }]
  start, // 'HH:MM' (업무 시작)
  end, // 'HH:MM' (업무 종료)
  workWindows = [], // 선택: [{start:'HH:MM', end:'HH:MM'}]
  className = "",
}) {
  const sorted = useMemo(() => {
    const arr = (data || [])
      .map((d) => ({
        t: toMin(d.time),
        s: Math.max(0, Math.min(100, Number(d.score) || 0)),
      }))
      .filter((d) => d.t != null)
      .sort((a, b) => a.t - b.t);
    return arr;
  }, [data]);

  const xMin = useMemo(
    () => (start ? toMin(start) : sorted[0]?.t ?? 8 * 60),
    [start, sorted]
  );
  const xMax = useMemo(
    () => (end ? toMin(end) : sorted.at(-1)?.t ?? 18 * 60),
    [end, sorted]
  );

  const vbW = 700,
    vbH = 320;
  const pad = 40;

  const x = (t) =>
    pad + ((t - xMin) / Math.max(1, xMax - xMin)) * (vbW - pad * 2);
  const y = (score) => pad + (1 - score / 100) * (vbH - pad * 2);

  const pts = useMemo(
    () =>
      sorted
        .filter((d) => d.t >= xMin && d.t <= xMax)
        .map((d) => ({ x: x(d.t), y: y(d.s), raw: d })),
    [sorted, xMin, xMax]
  );

  const minPt = useMemo(
    () => pts.reduce((m, p) => (m && m.raw.s < p.raw.s ? m : p), null),
    [pts]
  );
  const maxPt = useMemo(
    () => pts.reduce((m, p) => (m && m.raw.s > p.raw.s ? m : p), null),
    [pts]
  );

  const pathD = useMemo(() => toSmoothPath(pts), [pts]);
  const areaD = useMemo(() => {
    if (pts.length < 2) return "";
    return `${toSmoothPath(pts)} L ${pts.at(-1).x} ${vbH - pad} L ${pts[0].x} ${
      vbH - pad
    } Z`;
  }, [pts]);

  const pathRef = useRef(null);
  const [len, setLen] = useState(0);
  useEffect(() => {
    if (pathRef.current) setLen(pathRef.current.getTotalLength());
  }, [pathD]);

  const vTicks = useMemo(() => {
    const span = xMax - xMin;
    const step = span >= 12 * 60 ? 6 * 60 : span >= 8 * 60 ? 4 * 60 : 2 * 60;
    const ticks = [];
    for (let t = Math.ceil(xMin / step) * step; t <= xMax; t += step) {
      ticks.push(t);
    }
    return ticks;
  }, [xMin, xMax]);

  const bandY = {
    lowTop: y(30),
    cautionTop: y(50),
    riskTop: y(70),
    highTop: y(100),
    bottom: y(0),
    top: y(100),
  };

  return (
    <div
      className={`w-full rounded-2xl border border-neutral-200 p-3 bg-white ${className}`}
    >
      <svg viewBox={`0 0 ${vbW} ${vbH}`} className="w-full h-auto">
        <g>
          <rect
            x={pad}
            y={bandY.lowTop}
            width={vbW - pad * 2}
            height={bandY.bottom - bandY.lowTop}
            fill="#DCFCE7"
          />{" "}
          <rect
            x={pad}
            y={bandY.cautionTop}
            width={vbW - pad * 2}
            height={bandY.lowTop - bandY.cautionTop}
            fill="#FEF3C7"
          />{" "}
          <rect
            x={pad}
            y={bandY.riskTop}
            width={vbW - pad * 2}
            height={bandY.cautionTop - bandY.riskTop}
            fill="#FFE4D6"
          />{" "}
          <rect
            x={pad}
            y={pad}
            width={vbW - pad * 2}
            height={bandY.riskTop - pad}
            fill="#FEE2E2"
          />{" "}
        </g>

        {[
          { s: 30, label: "낮음" },
          { s: 50, label: "주의" },
          { s: 70, label: "위험" },
          { s: 100, label: "매우 위험" },
        ].map(({ s, label }) => (
          <g key={s}>
            <line
              x1={pad}
              x2={vbW - pad}
              y1={y(s)}
              y2={y(s)}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <text
              x={pad - 8}
              y={y(s) - 4}
              textAnchor="end"
              fontSize="12"
              fill="#6b7280"
            >
              {label}
            </text>
          </g>
        ))}

        {vTicks.map((t) => (
          <g key={t}>
            <line
              x1={x(t)}
              x2={x(t)}
              y1={pad}
              y2={vbH - pad}
              stroke="#e5e7eb"
              strokeDasharray="4 4"
            />
            <text
              x={x(t)}
              y={vbH - pad + 18}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {fmtKTime(t)}
            </text>
          </g>
        ))}

        {workWindows.map((w, i) => {
          const st = toMin(w.start),
            en = toMin(w.end);
          if (st == null || en == null) return null;
          const left = x(Math.max(st, xMin));
          const right = x(Math.min(en, xMax));
          if (right <= left) return null;
          return (
            <rect
              key={i}
              x={left}
              y={pad}
              width={right - left}
              height={vbH - pad * 2}
              fill="#000"
              opacity="0.05"
              rx="6"
            />
          );
        })}

        {pts.length > 1 && (
          <defs>
            <linearGradient id="area-grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FDBA74" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.1" />
            </linearGradient>
            <linearGradient id="line-grad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#FB923C" />
            </linearGradient>
          </defs>
        )}

        {pts.length > 1 && <path d={areaD} fill="url(#area-grad)" />}

        {pts.length > 1 && (
          <path
            ref={pathRef}
            d={pathD}
            fill="none"
            stroke="url(#line-grad)"
            strokeWidth="6"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              strokeDasharray: len,
              strokeDashoffset: len,
              transition: "stroke-dashoffset 900ms ease",
            }}
            onAnimationEnd={(e) => {
              e.currentTarget.style.strokeDashoffset = 0;
            }}
          />
        )}

        {minPt && (
          <g transform={`translate(${minPt.x} ${minPt.y})`}>
            <circle r="7" fill="white" stroke="#F59E0B" strokeWidth="3" />
            <text y="-10" textAnchor="middle" fontSize="12" fill="#6b7280">
              최저
            </text>
          </g>
        )}
        {maxPt && (
          <g transform={`translate(${maxPt.x} ${maxPt.y})`}>
            <circle r="7" fill="white" stroke="#F59E0B" strokeWidth="3" />
            <text y="-10" textAnchor="middle" fontSize="12" fill="#6b7280">
              최고
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}
