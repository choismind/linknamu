import { MongoClient, type Db } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB ?? "linknamu";

// dev 환경의 HMR 마다 새 연결이 생기지 않도록 전역에 캐싱한다.
const globalForMongo = globalThis as typeof globalThis & {
  _mongoClientPromise?: Promise<MongoClient>;
};

/**
 * MONGODB_URI가 설정돼 있으면 DB 핸들을, 아니면 null을 반환한다.
 * 호출부는 null을 정상 상태로 취급해야 한다.
 */
export async function getDb(): Promise<Db | null> {
  if (!uri) return null;

  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = new MongoClient(uri).connect();
  }

  try {
    const client = await globalForMongo._mongoClientPromise;
    return client.db(dbName);
  } catch (error) {
    // 실패한 promise가 캐시에 남아 이후 요청까지 전부 실패하는 것을 막는다.
    globalForMongo._mongoClientPromise = undefined;
    throw error;
  }
}
