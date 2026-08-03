"use client";

import { useCallback, useEffect, useState } from "react";
import LinkCard from "@/components/LinkCard";
import type { Link } from "@/config/profile";

type ClicksResponse = { counts: Record<string, number> };

export default function LinkList({ links }: { links: Link[] }) {
  // 응답이 오기 전에는 전부 0회로 보여준다.
  const [counts, setCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const controller = new AbortController();

    fetch("/api/clicks", { signal: controller.signal })
      .then((response) => (response.ok ? response.json() : null))
      .then((data: ClicksResponse | null) => {
        if (data) setCounts(data.counts);
      })
      .catch(() => {
        // 조회에 실패해도 0회 표시를 유지한다.
      });

    return () => controller.abort();
  }, []);

  // 클릭 직후 서버 응답을 기다리지 않고 화면에 먼저 반영한다.
  const handleClick = useCallback((id: string) => {
    setCounts((previous) => ({ ...previous, [id]: (previous[id] ?? 0) + 1 }));
  }, []);

  return (
    <nav aria-label="링크 목록">
      <ul className="flex flex-col gap-4">
        {links.map((link) => (
          <li key={link.id}>
            <LinkCard
              link={link}
              count={counts[link.id] ?? 0}
              onClick={handleClick}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}
