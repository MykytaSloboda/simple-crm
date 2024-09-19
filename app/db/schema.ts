import { pgTable, serial, text } from "drizzle-orm/pg-core";

export const teamTable = pgTable("team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  phone_number: text("phone_number").notNull(),
  role_id: text("role").notNull(),
  email: text("email").notNull().unique(),
});

export type InsertTeam = typeof teamTable.$inferInsert;
export type SelectTeam = typeof teamTable.$inferSelect;
