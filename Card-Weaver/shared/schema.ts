import { pgTable, text, serial, jsonb, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const cards = pgTable("cards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  appType: text("app_type").notNull(),
  tags: text("tags").array().notNull(),
  element: text("element").notNull(), // e.g., 'fire', 'water', 'alien', 'electric'
  palette: jsonb("palette").notNull(), // { color1, color2, color3, glow }
  animations: jsonb("animations").notNull(), // { borderRotation, glowPulse, chromatic, particles }
  width: integer("width").default(380).notNull(),
  height: integer("height").default(480).notNull(),
  borderRadius: integer("border_radius").default(20).notNull(),
  fontFamily: text("font_family").default('Rajdhani').notNull(),
  spacing: jsonb("spacing").notNull().default({ padding: 30, gap: 12 }),
  layout: jsonb("layout").notNull().default({ contentAlign: 'top', textAlign: 'left' }),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCardSchema = createInsertSchema(cards).omit({ id: true, createdAt: true });

export type Card = typeof cards.$inferSelect;
export type InsertCard = z.infer<typeof insertCardSchema>;

export type CardPalette = {
  color1: string;
  color2: string;
  color3: string;
  glow: string;
};

export type CardAnimations = {
  borderRotation: boolean;
  glowPulse: boolean;
  chromatic: boolean;
  particles: boolean;
  duration?: number; // Animation speed in seconds (0.5-5)
};

export type CardSpacing = {
  padding: number; // Content padding (10-50px)
  gap: number; // Gap between elements (5-20px)
};

export type CardLayout = {
  contentAlign: 'top' | 'center' | 'bottom';
  textAlign: 'left' | 'center' | 'right';
};
