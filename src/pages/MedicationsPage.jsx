import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";

const MEDS_KEY = "medications:v1";

function loadMeds() {
  try {
    const raw = localStorage.getItem(MEDS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function saveMeds(arr) {
  try {
    localStorage.setItem(MEDS_KEY, JSON.stringify(arr));
  } catch {
    console.log("error");
  }
}
const mkId = () => Math.random().toString(36).slice(2, 10);
const norm = (s) => String(s ?? "").trim();

export default function MedicationsPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState(() => loadMeds());
  const [name, setName] = useState("");

  // 저장 동기화
  useEffect(() => {
    saveMeds(items);
  }, [items]);

  const takenCount = useMemo(
    () => items.filter((m) => m.taken).length,
    [items]
  );

  const add = () => {
    const n = norm(name);
    if (!n) return;
    // 중복 방지(대소문자/공백 무시)
    const exists = items.some(
      (m) => norm(m.name).toLowerCase() === n.toLowerCase()
    );
    if (exists) {
      setName("");
      return;
    }
    setItems((prev) => [
      ...prev,
      { id: mkId(), name: n, taken: true, createdAt: new Date().toISOString() },
    ]);
    setName("");
  };

  const toggle = (id) =>
    setItems((prev) =>
      prev.map((m) => (m.id === id ? { ...m, taken: !m.taken } : m))
    );

  const remove = (id) => setItems((prev) => prev.filter((m) => m.id !== id));

  const clearAll = () => setItems([]);

  const setAll = (val) =>
    setItems((prev) => prev.map((m) => ({ ...m, taken: val })));

  return (
    <div className="max-w-screen-sm mx-auto bg-white min-h-screen">
      <PageHeader title="약물 관리" onBack={() => navigate(-1)} />

      <div className="px-4 py-4 bg-neutral-50 min-h-[calc(100vh-56px)]">
        <div className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-blue-100">
              <svg viewBox="0 0 24 24" className="h-4 w-4">
                <path
                  d="M4 12a4 4 0 0 1 4-4h0l8 8h0a4 4 0 1 1-5.657 5.657l-6-6A3.99 3.99 0 0 1 4 12Zm12-8a4 4 0 0 1 2.828 6.828l-3.172 3.172-6-6L12.828 4A4 4 0 0 1 16 4Z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                />
              </svg>
            </span>
            <p className="text-base font-semibold">약물 복용</p>
            <div className="ml-auto text-sm text-neutral-500">
              복용중 {takenCount}/{items.length}
            </div>
          </div>

          <div className="space-y-3">
            {items.length === 0 ? (
              <div className="text-sm text-neutral-500 py-2">
                복용 중인 약을 추가하세요.
              </div>
            ) : (
              items.map((m) => (
                <div
                  key={m.id}
                  className="flex items-center justify-between rounded-xl border border-neutral-100 px-3 py-2"
                >
                  <span className="text-[15px]">{m.name}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggle(m.id)}
                      className="h-7 w-7 rounded-full border flex items-center justify-center"
                      aria-label={m.taken ? "복용중" : "미복용"}
                      title={m.taken ? "복용중" : "미복용"}
                      style={{
                        borderColor: m.taken ? "#22c55e" : "#e5e7eb",
                        background: m.taken ? "#22c55e" : "white",
                        color: m.taken ? "white" : "#9ca3af",
                      }}
                    >
                      {m.taken ? (
                        <svg viewBox="0 0 24 24" className="h-4 w-4">
                          <path
                            d="M5 13l4 4L19 7"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      ) : (
                        <div className="h-3 w-3 rounded-full border border-neutral-300" />
                      )}
                    </button>

                    <button
                      onClick={() => remove(m.id)}
                      className="text-neutral-400 hover:text-neutral-700"
                      title="삭제"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5">
                        <path
                          d="M19 7l-1 14H6L5 7m3 0V5h8v2M9 11v6m6-6v6"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="mt-4">
            <label className="sr-only" htmlFor="med-name">
              약 이름
            </label>
            <input
              id="med-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && add()}
              placeholder="약 이름 입력 (예: 혈압약)"
              className="w-full rounded-xl border border-neutral-200 px-3 py-3 text-[15px] outline-none focus:border-blue-400"
            />
            <button
              onClick={add}
              className="mt-3 w-full rounded-2xl bg-blue-500 py-3 text-center text-white font-semibold"
            >
              + 복용중인 약 추가
            </button>
          </div>

          {items.length > 0 && (
            <div className="mt-3 grid grid-cols-3 gap-2">
              <button
                onClick={() => setAll(true)}
                className="rounded-xl bg-emerald-50 py-2 text-emerald-700 text-sm"
              >
                전부 복용중
              </button>
              <button
                onClick={() => setAll(false)}
                className="rounded-xl bg-neutral-100 py-2 text-neutral-700 text-sm"
              >
                전부 미복용
              </button>
              <button
                onClick={clearAll}
                className="rounded-xl bg-red-50 py-2 text-red-600 text-sm"
              >
                전체 삭제
              </button>
            </div>
          )}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 w-full rounded-2xl border border-neutral-200 py-3 text-neutral-700"
        >
          ← 돌아가기
        </button>
      </div>
    </div>
  );
}
