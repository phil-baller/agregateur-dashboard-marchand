"use client";

import { useEffect, useState } from "react";
import { useOrganisationsStore } from "@/stores/organisations.store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Building2,
  Key,
  Loader2,
  Plus,
  Copy,
  Check,
  Edit,
  ChevronDown,
  Webhook,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type {
  UpdateOrganisationDto,
  GenerateApiKeyOrganisationDto,
  CreateWebhookDto,
  UpdateWebhookDto,
} from "@/types/api";

interface ApiKeyData {
  key: string;
  secret: string;
}

export default function SettingsPage() {
  const {
    organisation,
    apiKeys,
    webhooks,
    isLoading,
    fetchMyOrganisations,
    updateOrganisation,
    generateApiKey,
    fetchApiKeys,
    createWebhook,
    fetchWebhooks,
    updateWebhook,
    deleteWebhook,
  } = useOrganisationsStore();

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCreateApiKeyDialogOpen, setIsCreateApiKeyDialogOpen] = useState(false);
  const [isShowApiKeyDialogOpen, setIsShowApiKeyDialogOpen] = useState(false);
  const [isCreateWebhookDialogOpen, setIsCreateWebhookDialogOpen] = useState(false);
  const [isDeleteWebhookDialogOpen, setIsDeleteWebhookDialogOpen] = useState(false);
  const [newApiKeyData, setNewApiKeyData] = useState<ApiKeyData | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [copiedSecretId, setCopiedSecretId] = useState<string | null>(null);
  const [expandedApiKeys, setExpandedApiKeys] = useState<Set<string>>(new Set());
  const [selectedApiKeyId, setSelectedApiKeyId] = useState<string | null>(null);
  const [webhookToDelete, setWebhookToDelete] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [apiKeyWebhooks, setApiKeyWebhooks] = useState<Record<string, typeof webhooks>>({});

  // Form states
  const [description, setDescription] = useState("");
  const [apiKeyTitle, setApiKeyTitle] = useState("");
  const [apiKeyDescription, setApiKeyDescription] = useState("");
  const [webhookLink, setWebhookLink] = useState("");
  const [webhookTitle, setWebhookTitle] = useState("");

  useEffect(() => {
    fetchMyOrganisations();
  }, [fetchMyOrganisations]);

  useEffect(() => {
    if (organisation?.id) {
      fetchApiKeys(organisation.id);
      setDescription(organisation.description || "");
    }
  }, [organisation?.id, fetchApiKeys]);

  // Update webhooks when store webhooks change for the selected API key
  useEffect(() => {
    if (selectedApiKeyId) {
      setApiKeyWebhooks((prev) => ({
        ...prev,
        [selectedApiKeyId]: webhooks,
      }));
    }
  }, [webhooks, selectedApiKeyId]);

  const handleUpdateOrganisation = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organisation?.id) {
      toast.error("No organization selected");
      return;
    }

    try {
      const updateData: UpdateOrganisationDto = {
        description: description.trim() || undefined,
      };

      await updateOrganisation(organisation.id, updateData);
      toast.success("Organization information updated successfully");
      setIsEditDialogOpen(false);
      await fetchMyOrganisations();
    } catch (error) {
      console.error("Failed to update organization:", error);
    }
  };

  const handleCreateApiKey = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!organisation?.id) {
      toast.error("No organization selected");
      return;
    }

    if (!apiKeyTitle.trim()) {
      toast.error("API key title is required");
      return;
    }

    try {
      const apiKeyData: GenerateApiKeyOrganisationDto = {
        title: apiKeyTitle.trim(),
        description: apiKeyDescription.trim() || undefined,
      };

      const response = await generateApiKey(organisation.id, apiKeyData);

      // Extract key and secret from response.data
      let apiKeyValue: string | null = null;
      let apiSecretValue: string | null = null;

      if (response && typeof response === "object") {
        // Check for response.data structure
        if ("data" in response) {
          const data = (response as { data?: ApiKeyData }).data;
          if (data) {
            apiKeyValue = data.key || null;
            apiSecretValue = data.secret || null;
          }
        }
        // Fallback to direct key/secret
        else if ("key" in response && typeof response.key === "string") {
          apiKeyValue = response.key;
        }
        if ("secret" in response && typeof response.secret === "string") {
          apiSecretValue = response.secret;
        }
      }

      setIsCreateApiKeyDialogOpen(false);
      setApiKeyTitle("");
      setApiKeyDescription("");

      if (apiKeyValue && apiSecretValue) {
        setNewApiKeyData({ key: apiKeyValue, secret: apiSecretValue });
        setIsShowApiKeyDialogOpen(true);
        toast.success("API key created successfully");
      } else {
        toast.success("API key created successfully");
        await fetchApiKeys(organisation.id);
      }
    } catch (error) {
      console.error("Failed to create API key:", error);
    }
  };

  const handleCopyApiKey = (key: string, keyId: string, type: "key" | "secret") => {
    navigator.clipboard.writeText(key);
    if (type === "key") {
      setCopiedKeyId(keyId);
      setTimeout(() => setCopiedKeyId(null), 2000);
    } else {
      setCopiedSecretId(keyId);
      setTimeout(() => setCopiedSecretId(null), 2000);
    }
    toast.success(`${type === "key" ? "API key" : "Secret"} copied to clipboard`);
  };

  const handleToggleApiKey = async (apiKeyId: string) => {
    const newExpanded = new Set(expandedApiKeys);
    if (newExpanded.has(apiKeyId)) {
      newExpanded.delete(apiKeyId);
    } else {
      newExpanded.add(apiKeyId);
      // Fetch webhooks when expanding
      setSelectedApiKeyId(apiKeyId);
      try {
        await fetchWebhooks(apiKeyId);
      } catch (error) {
        console.error("Failed to fetch webhooks:", error);
      }
    }
    setExpandedApiKeys(newExpanded);
  };

  const handleOpenCreateWebhookDialog = (apiKeyId: string) => {
    setSelectedApiKeyId(apiKeyId);
    setWebhookLink("");
    setWebhookTitle("");
    setIsCreateWebhookDialogOpen(true);
  };

  const handleCreateWebhook = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedApiKeyId) {
      toast.error("No API key selected");
      return;
    }

    if (!webhookLink.trim()) {
      toast.error("Webhook URL is required");
      return;
    }

    try {
      const webhookData: CreateWebhookDto = {
        link: webhookLink.trim(),
        title: webhookTitle.trim() || undefined,
      };

      await createWebhook(selectedApiKeyId, webhookData);
      toast.success("Webhook created successfully");
      setIsCreateWebhookDialogOpen(false);
      setWebhookLink("");
      setWebhookTitle("");
      await fetchWebhooks(selectedApiKeyId);
    } catch (error) {
      console.error("Failed to create webhook:", error);
    }
  };

  const handleDeleteWebhook = async () => {
    if (!selectedApiKeyId || !webhookToDelete) {
      return;
    }

    try {
      await deleteWebhook(selectedApiKeyId, webhookToDelete.id);
      toast.success("Webhook deleted successfully");
      setIsDeleteWebhookDialogOpen(false);
      setWebhookToDelete(null);
      await fetchWebhooks(selectedApiKeyId);
    } catch (error) {
      console.error("Failed to delete webhook:", error);
    }
  };

  if (!organisation) {
    return (
      <div className="flex flex-col gap-6 p-6">
        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
            <CardDescription>Manage your organization settings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <p className="text-muted-foreground">No organization found</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 animate-fade-in">
      <Tabs defaultValue="company" className="w-full">
        <TabsList>
          <TabsTrigger value="company">
            <Building2 className="mr-2 h-4 w-4" />
            Company Information
          </TabsTrigger>
          <TabsTrigger value="api-keys">
            <Key className="mr-2 h-4 w-4" />
            API Keys
          </TabsTrigger>
        </TabsList>

        {/* Company Information Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Company Information
                  </CardTitle>
                  <CardDescription>
                    View and update your organization details
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-muted-foreground">Organization Name</Label>
                  <p className="mt-1 text-sm font-medium">{organisation.libelle}</p>
                </div>
                {organisation.web_site && (
                  <div>
                    <Label className="text-muted-foreground">Website</Label>
                    <p className="mt-1 text-sm font-medium">{organisation.web_site}</p>
                  </div>
                )}
                <div className="md:col-span-2">
                  <Label className="text-muted-foreground">Description</Label>
                  <p className="mt-1 text-sm font-medium">
                    {organisation.description || "No description provided"}
                  </p>
                </div>
                {organisation.createdAt && (
                  <div>
                    <Label className="text-muted-foreground">Created At</Label>
                    <p className="mt-1 text-sm font-medium">
                      {new Date(organisation.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Keys Tab */}
        <TabsContent value="api-keys" className="space-y-6">
          <Card className="animate-slide-up">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    API Keys
                  </CardTitle>
                  <CardDescription>
                    Manage your API keys for programmatic access
                  </CardDescription>
                </div>
                <Button
                  onClick={() => setIsCreateApiKeyDialogOpen(true)}
                  disabled={isLoading}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create API Key
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoading && apiKeys.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : apiKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Key className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground mb-2">No API keys found</p>
                  <p className="text-sm text-muted-foreground">
                    Create your first API key to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {apiKeys.map((apiKey) => (
                    <Collapsible
                      key={apiKey.id}
                      open={expandedApiKeys.has(apiKey.id)}
                      onOpenChange={() => handleToggleApiKey(apiKey.id)}
                    >
                      <div className="rounded-lg border">
                        <CollapsibleTrigger className="w-full">
                          <div className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
                            <div className="flex-1 min-w-0 text-left">
                              <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-medium truncate">{apiKey.title}</h4>
                                {apiKey.createdAt && (
                                  <span className="text-xs text-muted-foreground">
                                    {new Date(apiKey.createdAt).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {apiKey.description && (
                                <p className="text-sm text-muted-foreground truncate">
                                  {apiKey.description}
                                </p>
                              )}
                            </div>
                            <ChevronDown
                              className={`h-4 w-4 shrink-0 transition-transform ${
                                expandedApiKeys.has(apiKey.id) ? "rotate-180" : ""
                              }`}
                            />
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t p-4 space-y-4">
                            {/* API Key Display */}
                            {apiKey.key ? (
                              <div className="space-y-2">
                                <Label>API Key</Label>
                                <div className="flex items-center gap-2">
                                  <code className="flex-1 text-xs bg-muted px-2 py-1 rounded break-all">
                                    {apiKey.key}
                                  </code>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      handleCopyApiKey(apiKey.key!, apiKey.id, "key")
                                    }
                                    className="shrink-0"
                                  >
                                    {copiedKeyId === apiKey.id ? (
                                      <Check className="h-4 w-4 text-green-600" />
                                    ) : (
                                      <Copy className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <p className="text-xs text-muted-foreground">
                                API key is hidden for security reasons
                              </p>
                            )}

                            {/* Webhooks Section */}
                            <div className="space-y-3 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                  <Webhook className="h-4 w-4" />
                                  Webhooks
                                </Label>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleOpenCreateWebhookDialog(apiKey.id)}
                                  disabled={isLoading}
                                >
                                  <Plus className="mr-2 h-3 w-3" />
                                  Add Webhook
                                </Button>
                              </div>

                              {(apiKeyWebhooks[apiKey.id] || []).length === 0 ? (
                                <p className="text-sm text-muted-foreground">
                                  No webhooks configured for this API key
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {(apiKeyWebhooks[apiKey.id] || [])
                                    .filter((w) => w.id) // Ensure we have valid webhooks
                                    .map((webhook) => (
                                      <div
                                        key={webhook.id}
                                        className="flex items-center justify-between rounded-md border p-3"
                                      >
                                        <div className="flex-1 min-w-0">
                                          {webhook.title && (
                                            <p className="font-medium text-sm truncate">
                                              {webhook.title}
                                            </p>
                                          )}
                                          <p className="text-xs text-muted-foreground truncate">
                                            {webhook.link}
                                          </p>
                                        </div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => {
                                            setSelectedApiKeyId(apiKey.id);
                                            setWebhookToDelete({
                                              id: webhook.id,
                                              title: webhook.title,
                                            });
                                            setIsDeleteWebhookDialogOpen(true);
                                          }}
                                          className="ml-2 shrink-0 text-destructive hover:text-destructive"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      </div>
                                    ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Organization Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Edit Company Information</DialogTitle>
            <DialogDescription className="text-base">
              Update your organization details
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateOrganisation} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="org-name">Organization Name</Label>
              <Input
                id="org-name"
                value={organisation.libelle}
                disabled
                className="bg-muted"
              />
              <p className="text-xs text-muted-foreground">
                Organization name cannot be changed
              </p>
            </div>

            {organisation.web_site && (
              <div className="space-y-2">
                <Label htmlFor="org-website">Website</Label>
                <Input
                  id="org-website"
                  value={organisation.web_site}
                  disabled
                  className="bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Website cannot be changed
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                placeholder="Enter organization description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isLoading}
                rows={4}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Create API Key Dialog */}
      <Dialog
        open={isCreateApiKeyDialogOpen}
        onOpenChange={setIsCreateApiKeyDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Create API Key</DialogTitle>
            <DialogDescription className="text-base">
              Generate a new API key for programmatic access to your organization
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateApiKey} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="api-key-title">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="api-key-title"
                placeholder="e.g., Production API Key"
                value={apiKeyTitle}
                onChange={(e) => setApiKeyTitle(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="api-key-description">Description (Optional)</Label>
              <Textarea
                id="api-key-description"
                placeholder="Enter a description for this API key"
                value={apiKeyDescription}
                onChange={(e) => setApiKeyDescription(e.target.value)}
                disabled={isLoading}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateApiKeyDialogOpen(false);
                  setApiKeyTitle("");
                  setApiKeyDescription("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !apiKeyTitle.trim()}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create API Key"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Show New API Key Dialog */}
      <Dialog
        open={isShowApiKeyDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsShowApiKeyDialogOpen(false);
            setNewApiKeyData(null);
            if (organisation?.id) {
              fetchApiKeys(organisation.id);
            }
          }
        }}
      >
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 dark:bg-green-900/20">
              <Key className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <DialogTitle className="text-2xl">API Key Created</DialogTitle>
            <DialogDescription className="text-base">
              Your API key and secret have been generated. Please copy them now as
              they will not be shown again.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label>API Key</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted px-3 py-2 rounded break-all">
                  {newApiKeyData?.key}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newApiKeyData?.key) {
                      navigator.clipboard.writeText(newApiKeyData.key);
                      toast.success("API key copied to clipboard");
                    }
                  }}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Secret Key</Label>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-muted px-3 py-2 rounded break-all">
                  {newApiKeyData?.secret}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    if (newApiKeyData?.secret) {
                      navigator.clipboard.writeText(newApiKeyData.secret);
                      toast.success("Secret key copied to clipboard");
                    }
                  }}
                  className="shrink-0"
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>Important:</strong> Store both the API key and secret securely.
                You will not be able to view the secret again. If you lose it, you'll
                need to generate a new API key, which will discard the previous one.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              onClick={() => {
                setIsShowApiKeyDialogOpen(false);
                setNewApiKeyData(null);
                if (organisation?.id) {
                  fetchApiKeys(organisation.id);
                }
              }}
            >
              I've copied both keys
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Webhook Dialog */}
      <Dialog
        open={isCreateWebhookDialogOpen}
        onOpenChange={setIsCreateWebhookDialogOpen}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Webhook className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">Create Webhook</DialogTitle>
            <DialogDescription className="text-base">
              Add a webhook endpoint for this API key
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreateWebhook} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-link">
                Webhook URL <span className="text-destructive">*</span>
              </Label>
              <Input
                id="webhook-link"
                type="url"
                placeholder="https://example.com/webhook"
                value={webhookLink}
                onChange={(e) => setWebhookLink(e.target.value)}
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-title">Title (Optional)</Label>
              <Input
                id="webhook-title"
                placeholder="e.g., Payment Notifications"
                value={webhookTitle}
                onChange={(e) => setWebhookTitle(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateWebhookDialogOpen(false);
                  setWebhookLink("");
                  setWebhookTitle("");
                }}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || !webhookLink.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Webhook"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Webhook Alert Dialog */}
      <AlertDialog
        open={isDeleteWebhookDialogOpen}
        onOpenChange={(open) => {
          if (!isLoading) {
            setIsDeleteWebhookDialogOpen(open);
            if (!open) {
              setWebhookToDelete(null);
            }
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Webhook</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this webhook
              {webhookToDelete?.title && (
                <> ({webhookToDelete.title})</>
              )}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWebhook}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
