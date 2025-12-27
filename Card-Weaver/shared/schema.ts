import { pgTable, text, serial, jsonb, timestamp, integer, boolean } from "drizzle-orm/pg-core";
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
  owner: text("owner").default("guest").notNull(),
  width: integer("width").default(380).notNull(),
  height: integer("height").default(480).notNull(),
  borderRadius: integer("border_radius").default(20).notNull(),
  fontFamily: text("font_family").default('Rajdhani').notNull(),
  spacing: jsonb("spacing").notNull().default({ padding: 30, gap: 12 }),
  background: jsonb("background"),
  layout: text("layout").notNull().default('vertical'),
  hover: jsonb("hover"),
  gradients: jsonb("gradients"),
  shadows: jsonb("shadows"),
  tpl: boolean("tpl").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCardSchema = createInsertSchema(cards)
  .omit({
    id: true,
    createdAt: true,
  })
  .extend({
    owner: z.string().min(1).optional(),
    layout: z.enum(['vertical', 'horizontal']).optional(),
    spacing: z.object({
      padding: z.number(),
      gap: z.number(),
    }).optional(),
    background: z.object({
      url: z.string(),
      overlay: z.number(),
      position: z.string(),
    }).nullable(),
    hover: z.object({
      scale: z.number(),
      rotate: z.number(),
      lift: z.number(),
      glow: z.number(),
      speed: z.number(),
      tilt3d: z.boolean(),
    }).nullable(),
    gradients: z.object({
      type: z.enum(['linear', 'radial', 'conic']),
      angle: z.number(),
    }).optional(),
    shadows: z.object({
      outer: z.boolean(),
      inset: z.boolean(),
      blur: z.number(),
      frameWidth: z.number().optional(),
    }).optional(),
  });

export const updateCardSchema = insertCardSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  {
    message: "At least one field must be provided",
  },
);

export type Card = typeof cards.$inferSelect & { 
  background?: CardBackgroundLayer | null; 
  hover?: CardHoverSettings | null; 
  gradients?: CardGradients; 
  shadows?: CardShadows; 
  layout?: 'vertical' | 'horizontal'; 
  spacing?: { padding: number; gap: number }; 
  tpl: boolean 
};

export type InsertCard = z.infer<typeof insertCardSchema>;
export type UpdateCard = z.infer<typeof updateCardSchema>;

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

export type CardBackgroundLayer = {
  url?: string;
  overlay: number;
  position: string;
};

export type CardHoverSettings = {
  scale: number;
  rotate: number;
  lift: number;
  glow: number;
  speed: number;
  tilt3d: boolean;
};

export type CardGradients = {
  type: 'linear' | 'radial' | 'conic';
  angle: number;
};

export type CardShadows = {
  outer: boolean;
  inset: boolean;
  blur: number;
  frameWidth?: number;
};

export const cardFilterSchema = z.object({
  element: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  search: z.string().optional(),
  owner: z.string().optional(),
  tpl: z.boolean().optional(),
});
export type CardFilters = z.infer<typeof cardFilterSchema>;
