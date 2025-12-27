import { db } from "./db";
import {
  cards,
  type InsertCard,
  type UpdateCard,
  type Card,
  type CardFilters,
  CardBackgroundLayer,
  CardHoverSettings,
  CardGradients,
  CardShadows,
} from "@shared/schema";
import { eq, desc, and, ilike, sql, or } from "drizzle-orm";

type DatabaseClient = NonNullable<typeof db>;

export interface IStorage {
  getCards(filters?: CardFilters): Promise<Card[]>;
  getCard(id: number): Promise<Card | undefined>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: number, card: UpdateCard): Promise<Card | undefined>;
  deleteCard(id: number): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  constructor(private readonly client: DatabaseClient) {}

  async getCards(filters?: CardFilters): Promise<Card[]> {
    try {
      const builder = this.client
        .select()
        .from(cards)
        .where(buildFilterWhere(filters))
        .orderBy(desc(cards.createdAt));

      return await builder as any;
    } catch (err) {
      console.error("DB error in getCards:", err);
      return [];
    }
  }

  async getCard(id: number): Promise<Card | undefined> {
    try {
      const [card] = await this.client
        .select()
        .from(cards)
        .where(eq(cards.id, id));
      return card as any;
    } catch (err) {
      console.error("DB error in getCard:", err);
      return undefined;
    }
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    try {
      const [card] = await this.client.insert(cards).values(insertCard).returning();
      return card as any;
    } catch (err) {
      console.error("DB error in createCard:", err);
      throw err;
    }
  }

  async updateCard(id: number, update: UpdateCard): Promise<Card | undefined> {
    try {
      const [card] = await this.client
        .update(cards)
        .set(update)
        .where(eq(cards.id, id))
        .returning();
      return card as any;
    } catch (err) {
      console.error("DB error in updateCard:", err);
      throw err;
    }
  }

  async deleteCard(id: number): Promise<boolean> {
    try {
      const [deleted] = await this.client.delete(cards).where(eq(cards.id, id)).returning({
        id: cards.id,
      });
      return Boolean(deleted);
    } catch (err) {
      console.error("DB error in deleteCard:", err);
      throw err;
    }
  }
}

class MemoryStorage implements IStorage {
  private cards: Card[] = [];
  private idCounter = 1;

  private static readonly defaultSpacing = { padding: 30, gap: 12 };
  private static readonly defaultLayout: 'vertical' | 'horizontal' = "vertical";

  async getCards(filters?: CardFilters): Promise<Card[]> {
    const filtered = this.cards.filter((card) => matchesFilters(card, filters));
    return filtered.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });
  }

  async getCard(id: number): Promise<Card | undefined> {
    return this.cards.find((card) => card.id === id);
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const now = new Date();
    const card: Card = {
      id: this.idCounter++,
      title: insertCard.title,
      description: insertCard.description,
      category: insertCard.category,
      appType: insertCard.appType,
      tags: insertCard.tags,
      element: insertCard.element,
      palette: insertCard.palette,
      animations: insertCard.animations,
      owner: insertCard.owner ?? "guest",
      width: insertCard.width ?? 380,
      height: insertCard.height ?? 480,
      borderRadius: insertCard.borderRadius ?? 20,
      fontFamily: insertCard.fontFamily ?? "Rajdhani",
      background: (insertCard.background ?? null) as CardBackgroundLayer | null,
      hover: (insertCard.hover ?? null) as CardHoverSettings | null,
      gradients: (insertCard.gradients ?? { type: "linear", angle: 0 }) as CardGradients,
      shadows: (insertCard.shadows ?? { outer: true, inset: false, blur: 10 }) as CardShadows,
      layout: insertCard.layout ?? MemoryStorage.defaultLayout,
      spacing: (insertCard.spacing as { padding: number; gap: number } | undefined) ?? MemoryStorage.defaultSpacing,
      tpl: insertCard.tpl ?? false,
      createdAt: now,
    };
    this.cards.push(card);
    return card;
  }

  async updateCard(id: number, update: UpdateCard): Promise<Card | undefined> {
    const index = this.cards.findIndex((card) => card.id === id);
    if (index === -1) return undefined;
    const updated = {
      ...this.cards[index],
      ...update,
    } as Card;
    this.cards[index] = updated;
    return updated;
  }

  async deleteCard(id: number): Promise<boolean> {
    const initialLength = this.cards.length;
    this.cards = this.cards.filter((card) => card.id !== id);
    return this.cards.length < initialLength;
  }
}

export const storage: IStorage = db
  ? new DatabaseStorage(db)
  : new MemoryStorage();

function buildFilterWhere(filters?: CardFilters) {
  if (!filters) return sql`true`;
  const clauses = [];

  if (filters.element) {
    clauses.push(eq(cards.element, filters.element));
  }
  if (filters.category) {
    clauses.push(eq(cards.category, filters.category));
  }
  if (filters.owner) {
    clauses.push(eq(cards.owner, filters.owner));
  }
  if (filters.tags && filters.tags.length > 0) {
    clauses.push(sql`${cards.tags} @> ${filters.tags}`);
  }
  if (filters.search) {
    const term = `%${filters.search}%`;
    clauses.push(
      or(
        ilike(cards.title, term),
        ilike(cards.description, term),
        ilike(cards.appType, term),
      ),
    );
  }

  if (clauses.length === 0) {
    return sql`true`;
  }

  return and(...clauses);
}

function matchesFilters(card: Card, filters?: CardFilters): boolean {
  if (!filters) return true;
  if (filters.element && card.element !== filters.element) return false;
  if (filters.category && card.category !== filters.category) return false;
  if (filters.owner && card.owner !== filters.owner) return false;

  if (filters.tags && filters.tags.length > 0) {
    const cardTags = card.tags ?? [];
    const hasAll = filters.tags.every((target) =>
      cardTags.some((tag) => tag.toLowerCase() === target.toLowerCase()),
    );
    if (!hasAll) return false;
  }

  if (filters.search) {
    const haystack = `${card.title} ${card.description} ${card.appType}`.toLowerCase();
    if (!haystack.includes(filters.search.toLowerCase())) {
      return false;
    }
  }

  return true;
}
