"use client";

import type { Link } from "@/config/profile";

/**
 * 클릭을 집계 API로 보낸다. 실패해도 링크 이동에는 영향을 주지 않도록
 * 반환값을 확인하지 않는다.
 */
function reportClick(id: string) {
  const body = JSON.stringify({ id });

  if (typeof navigator.sendBeacon === "function") {
    navigator.sendBeacon(
      "/api/clicks",
      new Blob([body], { type: "application/json" }),
    );
    return;
  }

  fetch("/api/clicks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true,
  }).catch(() => {});
}

export default function LinkCard({
  link,
  count,
  onClick,
}: {
  link: Link;
  /** 현재 클릭 수. 서버 값을 받기 전에는 0이다. */
  count: number;
  onClick?: (id: string) => void;
}) {
  const isExternal = link.url.startsWith("http");

  function handleClick() {
    reportClick(link.id);
    onClick?.(link.id);
  }

  return (
    <a
      href={link.url}
      onClick={handleClick}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="relative block rounded-3xl border border-white/12 bg-white/[0.06] px-6 py-5 text-center shadow-[0_8px_32px_-12px_rgba(2,10,25,0.65)] backdrop-blur-xl transition duration-200 ease-out hover:-translate-y-0.5 hover:border-white/25 hover:bg-white/[0.1] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300/80"
    >
      <span className="text-[0.975rem] font-semibold tracking-tight text-white/95">
        {link.label}
      </span>
      {link.description && (
        <span className="mt-1.5 block text-xs text-white/55">
          {link.description}
        </span>
      )}
      {/* 가운데 정렬된 라벨을 밀어내지 않도록 카드 오른쪽에 겹쳐 둔다. */}
      <span
        aria-label={`클릭 ${count}회`}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-[0.6875rem] tabular-nums text-white/40"
      >
        {count.toLocaleString("ko-KR")}회
      </span>
    </a>
  );
}
