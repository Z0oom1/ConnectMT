import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { db } from "./db";
import { chatHistory, alerts, routes, motorcycleHealth } from "@shared/schema";
import { eq } from "drizzle-orm";

export const dataRouter = router({
  // Chat History
  saveChatMessage: protectedProcedure
    .input(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(chatHistory).values({
        userId: ctx.user.id,
        role: input.role,
        content: input.content,
      });
      return result;
    }),

  getChatHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(50),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await db
        .select()
        .from(chatHistory)
        .where(eq(chatHistory.userId, ctx.user.id))
        .orderBy(chatHistory.createdAt)
        .limit(input.limit)
        .offset(input.offset);
      return messages;
    }),

  // Alerts
  saveAlert: protectedProcedure
    .input(
      z.object({
        type: z.enum(["critical", "warning", "info"]),
        title: z.string(),
        message: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(alerts).values({
        userId: ctx.user.id,
        type: input.type,
        title: input.title,
        message: input.message,
      });
      return result;
    }),

  getAlerts: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
        unreadOnly: z.boolean().default(false),
      })
    )
    .query(async ({ input, ctx }) => {
      let query = db
        .select()
        .from(alerts)
        .where(eq(alerts.userId, ctx.user.id));

      if (input.unreadOnly) {
        query = query.where(eq(alerts.isRead, 0));
      }

      const result = await query
        .orderBy(alerts.createdAt)
        .limit(input.limit)
        .offset(input.offset);

      return result;
    }),

  markAlertAsRead: protectedProcedure
    .input(z.object({ alertId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const result = await db
        .update(alerts)
        .set({ isRead: 1 })
        .where(eq(alerts.id, input.alertId));
      return result;
    }),

  // Routes
  saveRoute: protectedProcedure
    .input(
      z.object({
        startLocation: z.string(),
        endLocation: z.string(),
        distance: z.number(),
        duration: z.number(),
        avgSpeed: z.number(),
        maxSpeed: z.number(),
        coordinates: z.string(), // JSON string
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(routes).values({
        userId: ctx.user.id,
        startLocation: input.startLocation,
        endLocation: input.endLocation,
        distance: input.distance,
        duration: input.duration,
        avgSpeed: input.avgSpeed,
        maxSpeed: input.maxSpeed,
        coordinates: input.coordinates,
      });
      return result;
    }),

  getRoutes: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(20),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await db
        .select()
        .from(routes)
        .where(eq(routes.userId, ctx.user.id))
        .orderBy(routes.createdAt)
        .limit(input.limit)
        .offset(input.offset);
      return result;
    }),

  // Motorcycle Health
  saveHealthData: protectedProcedure
    .input(
      z.object({
        temperature: z.number(),
        vibration: z.number(),
        inclination: z.number(),
        speed: z.number(),
        batteryLevel: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const result = await db.insert(motorcycleHealth).values({
        userId: ctx.user.id,
        temperature: input.temperature,
        vibration: input.vibration,
        inclination: input.inclination,
        speed: input.speed,
        batteryLevel: input.batteryLevel,
      });
      return result;
    }),

  getLatestHealthData: protectedProcedure.query(async ({ ctx }) => {
    const result = await db
      .select()
      .from(motorcycleHealth)
      .where(eq(motorcycleHealth.userId, ctx.user.id))
      .orderBy(motorcycleHealth.createdAt)
      .limit(1);
    return result[0] || null;
  }),

  getHealthDataHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().default(100),
        offset: z.number().default(0),
      })
    )
    .query(async ({ input, ctx }) => {
      const result = await db
        .select()
        .from(motorcycleHealth)
        .where(eq(motorcycleHealth.userId, ctx.user.id))
        .orderBy(motorcycleHealth.createdAt)
        .limit(input.limit)
        .offset(input.offset);
      return result;
    }),
});
