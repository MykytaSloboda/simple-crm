import { eq } from "drizzle-orm";
import { db } from "./index";
import {
  InsertTeam,
  teamTable,
  SelectTeam,
} from "./schema";

export async function createTeam(data: InsertTeam) {
  await db.insert(teamTable).values(data);
}

export async function getTeam() {
  try {
    return await db.select().from(teamTable);
  } catch (error) {
    console.error(error);
  }
}

export async function updateTeam(
  id: SelectTeam["id"],
  data: Partial<Omit<SelectTeam, "id">>
) {
  await db.update(teamTable).set(data).where(eq(teamTable.id, id));

  return data;
}

export async function deleteTeam(id: SelectTeam["id"]) {
  await db.delete(teamTable).where(eq(teamTable.id, id));

  return id;
}
