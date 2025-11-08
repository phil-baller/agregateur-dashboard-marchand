import { apiGet, apiPost, apiPatch, apiDelete } from "@/lib/api/base";
import type {
  CreateOrganisationDto,
  UpdateOrganisationDto,
  GenerateApiKeyOrganisationDto,
  CreateWebhookDto,
  UpdateWebhookDto,
} from "@/types/api";

export const organisationsController = {
  createOrganisation: async (
    data: CreateOrganisationDto
  ): Promise<{ message: string }> => {
    return apiPost("/api/organisations", data);
  },

  getMyOrganisation: async (): Promise<unknown> => {
    return apiGet("/api/organisations/me");
  },

  generateApiKey: async (
    organisation: string,
    data: GenerateApiKeyOrganisationDto
  ): Promise<unknown> => {
    return apiPost(`/api/organisations/${organisation}/api-key`, data);
  },

  listApiKeys: async (organisation: string): Promise<unknown> => {
    return apiGet(`/api/organisations/${organisation}/api-key`);
  },

  updateOrganisation: async (
    id: string,
    data: UpdateOrganisationDto
  ): Promise<{ message: string }> => {
    return apiPatch(`/api/organisations/${id}`, data);
  },

  deleteOrganisation: async (id: string): Promise<{ message: string }> => {
    return apiDelete(`/api/organisations/${id}`);
  },

  createWebhook: async (
    organisation: string,
    data: CreateWebhookDto
  ): Promise<{ message: string }> => {
    return apiPost(`/api/organisations/${organisation}/webhooks`, data);
  },

  getWebhooks: async (organisation: string): Promise<unknown> => {
    return apiGet(`/api/organisations/${organisation}/webhooks`);
  },

  updateWebhook: async (
    organisation: string,
    webhookId: string,
    data: UpdateWebhookDto
  ): Promise<{ message: string }> => {
    return apiPatch(
      `/api/organisations/${organisation}/webhooks/${webhookId}`,
      data
    );
  },

  deleteWebhook: async (
    organisation: string,
    webhookId: string
  ): Promise<{ message: string }> => {
    return apiDelete(
      `/api/organisations/${organisation}/webhooks/${webhookId}`
    );
  },
};

