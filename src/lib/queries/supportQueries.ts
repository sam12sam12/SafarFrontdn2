import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  appendSupportMessage,
  db,
  respond,
  startSupportConversation,
  wait,
} from "@/lib/db";
import type { SupportConversation } from "@/lib/db/types";
import { queryKeys } from "./queryKeys";

function sorted(threads: SupportConversation[]) {
  return [...threads].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

/** All of the signed-in passenger's support threads, newest first. */
export function useSupportConversations() {
  return useQuery({
    queryKey: queryKeys.support.list(),
    queryFn: () => respond(sorted(db.supportConversations)),
  });
}

/** A single thread with its full message history. */
export function useSupportConversation(conversationId?: string) {
  return useQuery({
    queryKey: queryKeys.support.detail(conversationId ?? "new"),
    queryFn: () =>
      respond(db.supportConversations.find((thread) => thread.id === conversationId) ?? null),
    enabled: Boolean(conversationId),
  });
}

/** Opens a new thread from the user's first question. Resolves to the created
 * thread so the screen can switch to it and keep the composer flowing. */
export function useStartSupportConversation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (topic: string) => {
      await wait(500);
      return startSupportConversation(topic);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.all });
    },
  });
}

/** Sends a follow-up message in an existing thread. */
export function useSendSupportMessage(conversationId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (text: string) => {
      await wait(500);
      return appendSupportMessage(conversationId, text);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.support.detail(conversationId) });
      queryClient.invalidateQueries({ queryKey: queryKeys.support.list() });
    },
  });
}
