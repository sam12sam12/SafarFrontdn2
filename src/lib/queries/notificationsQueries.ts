import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { db, respond, wait } from "@/lib/db";
import type { AppNotification, NotificationRole } from "@/lib/db/types";
import { queryKeys } from "./queryKeys";

function sorted(items: AppNotification[]) {
  return [...items].sort((a, b) => b.at.localeCompare(a.at));
}

export function useNotifications(role: NotificationRole) {
  return useQuery({
    queryKey: queryKeys.notifications.list(role),
    queryFn: () => respond(sorted(db.notifications.filter((item) => item.role === role))),
  });
}

/** Unread count for the given role — drives the header bell badge. */
export function useUnreadCount(role: NotificationRole) {
  const query = useNotifications(role);
  const count = (query.data ?? []).filter((item) => !item.read).length;
  return { count, query };
}

export function useMarkAllRead(role: NotificationRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await wait(250);
      db.notifications.forEach((item) => {
        if (item.role === role) item.read = true;
      });
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });
}

export function useMarkRead(role: NotificationRole) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await wait(150);
      const item = db.notifications.find((entry) => entry.id === id);
      if (item) item.read = true;
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.list(role) });
    },
  });
}
