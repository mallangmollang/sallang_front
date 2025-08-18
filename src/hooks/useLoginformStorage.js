import { useCallback } from "react";

export default function useLoginFormStorage(storageKey = "loginForm:v1") {
  // load함수: localstorage에서 해당 키를 읽고 Json 파싱을 한다.
  const load = useCallback(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (typeof data !== "object" || !data) return null;
      return data;
    } catch {
      return null;
    }
  }, [storageKey]);
  // save함수: localstorage에 해당 키로 데이터를 저장한다.
  const save = useCallback(
    (snapshot) => {
      try {
        const payload = {
          ...snapshot,
          savedAt: new Date().toISOString(),
        };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        return true;
      } catch (err) {
        console.error("localStorage 저장 실패:", err);
        return false;
      }
    },
    [storageKey]
  );
  // clear함수: localstorage에서 해당 키를 삭제한다.
  const clear = useCallback(() => {
    try {
      localStorage.removeItem(storageKey);
    } catch (err) {
      console.error("localStorage 삭제 실패:", err);
    }
  }, [storageKey]);

  return { load, save, clear, storageKey };
}
