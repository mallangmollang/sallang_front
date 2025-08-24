import { useEffect, useMemo, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import MapIcon from "../assets/MapIcon.svg";

const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ a, b }) {
  const map = useMap();
  useEffect(() => {
    if (!a || !b) return;
    const bounds = L.latLngBounds([a, b]).pad(0.2);
    map.fitBounds(bounds);
  }, [a, b, map]);
  return null;
}

function formatDistance(m) {
  if (m == null) return "";
  return m < 1000 ? `${Math.round(m)}m` : `${(m / 1000).toFixed(1)}km`;
}

// 경도/위도 목적지까지 외부 길찾기 링크(구글 지도)
function directionsUrl(origin, dest) {
  if (!origin) {
    return `https://www.google.com/maps/dir/?api=1&destination=${dest.lat},${dest.lng}`;
  }
  return `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${dest.lat},${dest.lng}`;
}

export default function ShelterCard({
  name,
  category,
  roadAddress,
  distanceM,
  position,
}) {
  const [open, setOpen] = useState(false);
  const [myPos, setMyPos] = useState(null);
  const [geoErr, setGeoErr] = useState(null);

  useEffect(() => {
    if (!open) return;
    if (!navigator.geolocation) {
      setGeoErr("이 브라우저는 위치 정보를 지원하지 않아요.");
      return;
    }
    const opts = { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 };
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setMyPos({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setGeoErr(null);
      },
      (err) => setGeoErr(err.message || "위치 정보를 가져오지 못했어요."),
      opts
    );
  }, [open]);

  const distText = useMemo(() => formatDistance(distanceM), [distanceM]);

  return (
    <>
      <div className="rounded-2xl border border-neutral-200 p-4 shadow-sm bg-white">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-lg truncate">{name}</h3>
              {category && (
                <span className="shrink-0 rounded-md bg-blue-100 text-blue-700 text-xs font-semibold px-2 py-0.5">
                  {category}
                </span>
              )}
            </div>
            <p className="text-neutral-600 mt-2">{roadAddress}</p>
          </div>

          {distText && (
            <span className="shrink-0 rounded-full bg-orange-100 text-orange-600 text-sm font-bold px-3 py-1">
              {distText}
            </span>
          )}
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => setOpen(true)}
            className="flex-1 h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold grid place-items-center"
          >
            <div className="flex gap-2 items-center justify-center">
              <img
                src={MapIcon}
                alt="SunLogo"
                className=" w-6 h-6 object-contain"
              />

              <span className="flex items-center gap-2">길찾기</span>
            </div>
          </button>
        </div>
      </div>

      {/* 모달 */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-[1px] grid place-items-center p-4"
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-md h-[70vh] bg-white rounded-2xl overflow-hidden shadow-xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-3 border-b">
              <div className="font-bold">현재 위치에서 길찾기</div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 grid place-items-center rounded-md hover:bg-neutral-100"
                aria-label="닫기"
              >
                ✕
              </button>
            </div>

            {/* 지도 영역 */}
            <div className="flex-1">
              {position ? (
                <MapContainer
                  center={[position.lat, position.lng]}
                  zoom={16}
                  style={{ width: "100%", height: "100%" }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                  />
                  <Marker
                    position={[position.lat, position.lng]}
                    icon={defaultIcon}
                  />
                  {myPos && (
                    <>
                      <Marker
                        position={[myPos.lat, myPos.lng]}
                        icon={defaultIcon}
                      />
                      <Polyline
                        positions={[
                          [myPos.lat, myPos.lng],
                          [position.lat, position.lng],
                        ]}
                        color="#f97316"
                        weight={4}
                        opacity={0.8}
                      />
                      <FitBounds
                        a={[myPos.lat, myPos.lng]}
                        b={[position.lat, position.lng]}
                      />
                    </>
                  )}
                </MapContainer>
              ) : (
                <div className="h-full grid place-items-center text-neutral-500">
                  목적지 좌표가 없습니다.
                </div>
              )}
            </div>

            {/* 안내 & 외부 길찾기 링크 */}
            <div className="p-3 border-t space-y-2">
              {geoErr && <p className="text-sm text-red-500">⚠️ {geoErr}</p>}
              <a
                className="block w-full text-center bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-2 rounded-lg"
                href={directionsUrl(myPos, position)}
                target="_blank"
                rel="noreferrer"
              >
                구글 지도에서 길찾기 열기
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
