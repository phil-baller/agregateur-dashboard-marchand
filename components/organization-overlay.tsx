"use client";

import { useState, useEffect } from "react";
import { useOrganisationsStore } from "@/stores/organisations.store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Building2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export const OrganizationOverlay = () => {
  const {
    organisations,
    organisation,
    hasOrganisation,
    createOrganisation,
    isLoading,
    error,
    clearError,
  } = useOrganisationsStore();
  const [libelle, setLibelle] = useState("");
  const [webSite, setWebSite] = useState("");
  const [description, setDescription] = useState("");
  const [mounted, setMounted] = useState(false);

  // Ensure we're on the client side and inject styles for high z-index
  useEffect(() => {
    setMounted(true);
    
    // Inject styles to ensure overlay and content have high z-index
    const styleId = "organization-overlay-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        [data-slot="dialog-overlay"] {
          z-index: 9998 !important;
        }
        [data-slot="dialog-content"] {
          z-index: 9999 !important;
        }
      `;
      document.head.appendChild(style);
    }
    
    return () => {
      // Cleanup: remove style on unmount
      const styleElement = document.getElementById(styleId);
      if (styleElement) {
        styleElement.remove();
      }
    };
  }, []);

  // Don't render if organization already exists
  if (hasOrganisation() || organisation || organisations.length > 0) {
    return null;
  }

  if (!mounted) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!libelle.trim()) {
      toast.error("Organization name is required");
      return;
    }

    if (!webSite.trim()) {
      toast.error("Website is required");
      return;
    }

    try {
      await createOrganisation({
        libelle: libelle.trim(),
        web_site: webSite.trim(),
        description: description.trim() || undefined,
      });
      toast.success("Organization created successfully!");
      // Form will be cleared and overlay will disappear automatically
      // as the store updates and the layout re-renders
      setLibelle("");
      setWebSite("");
      setDescription("");
    } catch (error) {
      // Error is already handled by the store/API
      console.error("Failed to create organization:", error);
    }
  };

  return (
    <Dialog open={true} modal={true}>
        <DialogContent 
          showCloseButton={false} 
          className="sm:max-w-[600px]"
          onEscapeKeyDown={(e) => e.preventDefault()}
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
        >
        <DialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <DialogTitle className="text-2xl">
            Create Your Organization
          </DialogTitle>
          <DialogDescription className="text-base">
            Before you can access the merchant dashboard, you need to create
            an organization. This will be used to manage your payments,
            transfers, and other merchant activities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="libelle">
              Organization Name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="libelle"
              placeholder="Enter organization name"
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="web_site">
              Website <span className="text-destructive">*</span>
            </Label>
            <Input
              id="web_site"
              type="url"
              placeholder="https://example.com"
              value={webSite}
              onChange={(e) => setWebSite(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Enter organization description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <DialogFooter>
            <Button
              type="submit"
              disabled={isLoading || !libelle.trim() || !webSite.trim()}
              className="w-full sm:w-auto"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Organization"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

