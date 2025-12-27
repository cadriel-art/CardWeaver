import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertCard, UpdateCard, CardFilters, Card } from "@shared/schema";

function serializeFilters(filters?: CardFilters) {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.element) params.set("element", filters.element);
  if (filters.category) params.set("category", filters.category);
  if (filters.search) params.set("search", filters.search);
  if (filters.tags && filters.tags.length > 0) {
    params.set("tags", filters.tags.join(","));
  }
  if (filters.owner) params.set("owner", filters.owner);
  if (typeof filters.tpl === "boolean") params.set("tpl", String(filters.tpl));
  const query = params.toString();
  return query ? `?${query}` : "";
}

export function useCards(filters?: CardFilters) {
  const queryKey = [api.cards.list.path, filters];

  return useQuery({
    queryKey,
    queryFn: async () => {
      const res = await fetch(`${api.cards.list.path}${serializeFilters(filters)}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch cards");
      const data = api.cards.list.responses[200].parse(await res.json());
      return data as unknown as Card[];
    },
  });
}

export function useCard(id: number) {
  return useQuery({
    queryKey: [api.cards.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.cards.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch card");
      const data = api.cards.get.responses[200].parse(await res.json());
      return data as unknown as Card;
    },
  });
}

export function useCreateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: InsertCard) => {
      const res = await fetch(api.cards.create.path, {
        method: api.cards.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.cards.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create card");
      }
      const responseJson = await res.json();
      const created = api.cards.create.responses[201].parse(responseJson);
      return created as unknown as Card;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [api.cards.list.path] }),
  });
}

export function useUpdateCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateCard }) => {
      const url = buildUrl(api.cards.update.path, { id });
      const res = await fetch(url, {
        method: api.cards.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });

      if (res.status === 404) throw new Error("Card not found");
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.cards.update.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to update card");
      }
      const responseJson = await res.json();
      const updated = api.cards.update.responses[200].parse(responseJson);
      return updated as unknown as Card;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [api.cards.list.path] }),
  });
}

export function useDeleteCard() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.cards.remove.path, { id });
      const res = await fetch(url, {
        method: api.cards.remove.method,
        credentials: "include",
      });
      if (res.status === 404) {
        throw new Error("Card not found");
      }
      if (!res.ok) throw new Error("Failed to delete card");
      return true;
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [api.cards.list.path] }),
  });
}
