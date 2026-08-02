import { getDb } from "@/lib/mongodb";
import { profile } from "@/config/profile";

const knownIds = new Set(profile.links.map((link) => link.id));

type ClickDoc = {
  _id: string;
  count: number;
  updatedAt: Date;
};

/**
 * 링크 클릭을 집계한다. 클라이언트는 응답을 확인하지 않으므로
 * 본문 없이 상태 코드만 돌려준다.
 */
export async function POST(request: Request) {
  let id: unknown;

  try {
    ({ id } = await request.json());
  } catch {
    return new Response(null, { status: 400 });
  }

  if (typeof id !== "string" || !knownIds.has(id)) {
    return new Response(null, { status: 400 });
  }

  try {
    const db = await getDb();

    // MONGODB_URI가 없는 환경에서는 집계를 건너뛴다.
    if (db) {
      await db
        .collection<ClickDoc>("clicks")
        .updateOne(
          { _id: id },
          { $inc: { count: 1 }, $set: { updatedAt: new Date() } },
          { upsert: true },
        );
    }
  } catch (error) {
    // 집계 실패가 사용자 경험에 영향을 주지 않도록 로그만 남긴다.
    console.error("[clicks] 집계에 실패했습니다:", error);
  }

  return new Response(null, { status: 204 });
}
