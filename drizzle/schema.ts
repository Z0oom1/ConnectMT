import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Chat History Table
export const chatHistory = mysqlTable("chatHistory", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ChatHistory = typeof chatHistory.$inferSelect;
export type InsertChatHistory = typeof chatHistory.$inferInsert;

// Alerts Table
export const alerts = mysqlTable("alerts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["critical", "warning", "info"]).notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Alert = typeof alerts.$inferSelect;
export type InsertAlert = typeof alerts.$inferInsert;

// Routes/Trajectories Table
export const routes = mysqlTable("routes", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  startLocation: varchar("startLocation", { length: 255 }).notNull(),
  endLocation: varchar("endLocation", { length: 255 }).notNull(),
  distance: int("distance").notNull(), // in meters
  duration: int("duration").notNull(), // in seconds
  avgSpeed: int("avgSpeed").notNull(), // in km/h
  maxSpeed: int("maxSpeed").notNull(), // in km/h
  coordinates: text("coordinates").notNull(), // JSON string of coordinates
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Route = typeof routes.$inferSelect;
export type InsertRoute = typeof routes.$inferInsert;

// Motorcycle Health Data Table
export const motorcycleHealth = mysqlTable("motorcycleHealth", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  temperature: int("temperature").notNull(), // in Celsius
  vibration: int("vibration").notNull(), // 0-100 scale
  inclination: int("inclination").notNull(), // in degrees
  speed: int("speed").notNull(), // in km/h
  batteryLevel: int("batteryLevel").notNull(), // 0-100
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type MotorcycleHealth = typeof motorcycleHealth.$inferSelect;
export type InsertMotorcycleHealth = typeof motorcycleHealth.$inferInsert;

// TODO: Add your tables here