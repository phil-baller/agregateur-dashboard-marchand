import { apiGet } from "@/lib/api/base";

export const notificationsController = {
  sendEvents: async (ref: string): Promise<void> => {
    await apiGet(`/api/notifications/events/${ref}`);
  },
};

