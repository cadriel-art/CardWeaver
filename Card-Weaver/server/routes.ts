import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  app.get(api.cards.list.path, async (req, res) => {
    const cards = await storage.getCards();
    res.json(cards);
  });

  app.get(api.cards.get.path, async (req, res) => {
    const card = await storage.getCard(Number(req.params.id));
    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.json(card);
  });

  app.post(api.cards.create.path, async (req, res) => {
    try {
      const input = api.cards.create.input.parse(req.body);
      const card = await storage.createCard(input);
      res.status(201).json(card);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  // Seed data if empty - wait a bit for DB to initialize
  setTimeout(async () => {
    try {
      const existing = await storage.getCards();
      if (existing.length === 0) {
        console.log("Seeding database...");
        await storage.createCard({
          title: "Inferno Dragon",
          description: "A legendary beast born from the heart of a dying star. Its flames can melt adamantium.",
          category: "LEGENDARY",
          appType: "MONSTER",
          tags: ["fire", "dragon", "boss"],
          element: "fire",
          palette: {
            color1: "#dd8448",
            color2: "#ff9d66",
            color3: "#ff6b35",
            glow: "rgba(221, 132, 72, 0.5)"
          },
          animations: {
            borderRotation: true,
            glowPulse: true,
            chromatic: false,
            particles: true
          },
          width: 380,
          height: 480,
          borderRadius: 20,
          fontFamily: 'Rajdhani'
        });

        await storage.createCard({
          title: "Abyssal Leviathan",
          description: "Lurking in the deepest trenches, this ancient entity controls the tides.",
          category: "MYTHIC",
          appType: "SEA CREATURE",
          tags: ["water", "abyss", "ancient"],
          element: "water",
          palette: {
            color1: "#00f0ff",
            color2: "#00aaff",
            color3: "#0055ff",
            glow: "rgba(0, 240, 255, 0.5)"
          },
          animations: {
            borderRotation: true,
            glowPulse: true,
            chromatic: true,
            particles: true
          },
          width: 380,
          height: 480,
          borderRadius: 20,
          fontFamily: 'Rajdhani'
        });
        console.log("Seeding complete.");
      }
    } catch (err) {
      console.error("Error seeding database:", err);
    }
  }, 2000);

  return httpServer;
}
