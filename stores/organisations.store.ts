import { create } from "zustand";
import { organisationsController } from "@/controllers/organisations.controller";
import type {
  CreateOrganisationDto,
  UpdateOrganisationDto,
  GenerateApiKeyOrganisationDto,
  CreateWebhookDto,
  UpdateWebhookDto,
} from "@/types/api";

interface Organisation {
  id: string;
  libelle: string;
  web_site: string;
  description?: string;
  [key: string]: unknown;
}

interface ApiKey {
  id: string;
  title: string;
  description?: string;
  key: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface Webhook {
  id: string;
  link: string;
  title?: string;
  createdAt?: string;
  [key: string]: unknown;
}

interface OrganisationsState {
  organisation: Organisation | null;
  apiKeys: ApiKey[];
  webhooks: Webhook[];
  isLoading: boolean;
  error: string | null;
  fetchMyOrganisation: () => Promise<void>;
  createOrganisation: (data: CreateOrganisationDto) => Promise<void>;
  updateOrganisation: (id: string, data: UpdateOrganisationDto) => Promise<void>;
  deleteOrganisation: (id: string) => Promise<void>;
  generateApiKey: (
    organisation: string,
    data: GenerateApiKeyOrganisationDto
  ) => Promise<void>;
  fetchApiKeys: (organisation: string) => Promise<void>;
  createWebhook: (
    organisation: string,
    data: CreateWebhookDto
  ) => Promise<void>;
  fetchWebhooks: (organisation: string) => Promise<void>;
  updateWebhook: (
    organisation: string,
    webhookId: string,
    data: UpdateWebhookDto
  ) => Promise<void>;
  deleteWebhook: (organisation: string, webhookId: string) => Promise<void>;
  clearError: () => void;
}

export const useOrganisationsStore = create<OrganisationsState>(
  (set, get) => ({
    organisation: null,
    apiKeys: [],
    webhooks: [],
    isLoading: false,
    error: null,

    fetchMyOrganisation: async () => {
      set({ isLoading: true, error: null });
      try {
        const organisation = await organisationsController.getMyOrganisation();
        set({
          organisation: organisation as Organisation,
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to fetch organisation";
        set({ isLoading: false, error: errorMessage });
      }
    },

    createOrganisation: async (data) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.createOrganisation(data);
        await get().fetchMyOrganisation();
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to create organisation";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    updateOrganisation: async (id, data) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.updateOrganisation(id, data);
        await get().fetchMyOrganisation();
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to update organisation";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    deleteOrganisation: async (id) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.deleteOrganisation(id);
        set({ organisation: null, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to delete organisation";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    generateApiKey: async (organisation, data) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.generateApiKey(organisation, data);
        await get().fetchApiKeys(organisation);
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to generate API key";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchApiKeys: async (organisation) => {
      set({ isLoading: true, error: null });
      try {
        const response = await organisationsController.listApiKeys(organisation);
        const keys = Array.isArray(response)
          ? response
          : (response as { data?: ApiKey[]; keys?: ApiKey[] })?.data ||
            (response as { data?: ApiKey[]; keys?: ApiKey[] })?.keys ||
            [];
        set({ apiKeys: keys, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch API keys";
        set({ isLoading: false, error: errorMessage });
      }
    },

    createWebhook: async (organisation, data) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.createWebhook(organisation, data);
        await get().fetchWebhooks(organisation);
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to create webhook";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    fetchWebhooks: async (organisation) => {
      set({ isLoading: true, error: null });
      try {
        const response = await organisationsController.getWebhooks(
          organisation
        );
        const hooks = Array.isArray(response)
          ? response
          : (response as { data?: Webhook[]; webhooks?: Webhook[] })?.data ||
            (response as { data?: Webhook[]; webhooks?: Webhook[] })
              ?.webhooks ||
            [];
        set({ webhooks: hooks, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch webhooks";
        set({ isLoading: false, error: errorMessage });
      }
    },

    updateWebhook: async (organisation, webhookId, data) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.updateWebhook(
          organisation,
          webhookId,
          data
        );
        await get().fetchWebhooks(organisation);
        set({ isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update webhook";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    deleteWebhook: async (organisation, webhookId) => {
      set({ isLoading: true, error: null });
      try {
        await organisationsController.deleteWebhook(organisation, webhookId);
        set({
          webhooks: get().webhooks.filter((w) => w.id !== webhookId),
          isLoading: false,
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete webhook";
        set({ isLoading: false, error: errorMessage });
        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },
  })
);

