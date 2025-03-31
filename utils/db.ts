import clientPromise from "@/lib/mongodb";
import { Db } from "mongodb";

export async function getDb(dbName = "sample_mflix"): Promise<Db> {
  const client = await clientPromise;
  return client.db(dbName);
}
