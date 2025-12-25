import { db } from "./db";
import { cards, type InsertCard, type Card } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getCards(): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
}

export class DatabaseStorage implements IStorage {
  async getCards(): Promise<Card[]> {
    return await db.select().from(cards).orderBy(desc(cards.createdAt));
  }

  async getCard(id: number): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }
}

export const storage = new DatabaseStorage();
