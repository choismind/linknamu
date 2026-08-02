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

export default function LinkCard({ link }: { link: Link }) {
  const isExternal = link.url.startsWith("http");

  return (
    <a
      href={link.url}
      onClick={() => reportClick(link.id)}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noopener noreferrer" : undefined}
      className="block rounded-2xl border border-black/10 bg-black/[0.02] px-5 py-4 text-center transition hover:-translate-y-0.5 hover:border-black/20 hover:bg-black/[0.05] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current dark:border-white/15 dark:bg-white/[0.04] dark:hover:border-white/30 dark:hover:bg-white/[0.08]"
    >
      <span className="font-medium">{link.label}</span>
      {link.description && (
        <span className="mt-1 block text-xs text-black/50 dark:text-white/50">
          {link.description}
        </span>
      )}
    </a>
  );
}
