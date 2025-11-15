"use client";

import * as React from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2 } from "lucide-react";

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  country_id: string;
  code_phone?: string;
  [key: string]: unknown;
}

interface DeleteBeneficiaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  beneficiary: Beneficiary | null;
  onConfirm: () => Promise<void>;
  isDeleting?: boolean;
}

export const DeleteBeneficiaryDialog = ({
  open,
  onOpenChange,
  beneficiary,
  onConfirm,
  isDeleting = false,
}: DeleteBeneficiaryDialogProps) => {
  const [deleteConfirmationText, setDeleteConfirmationText] = React.useState("");

  const handleOpenChange = (newOpen: boolean) => {
    if (!isDeleting) {
      onOpenChange(newOpen);
      if (!newOpen) {
        setDeleteConfirmationText("");
      }
    }
  };

  const handleConfirm = async () => {
    if (deleteConfirmationText.trim().toLowerCase() !== "delete") {
      return;
    }
    await onConfirm();
    setDeleteConfirmationText("");
  };

  const confirmationText = beneficiary?.name || beneficiary?.id || "";

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
            <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <AlertDialogTitle className="text-xl">Delete Beneficiary</AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            This action cannot be undone. This will permanently delete the beneficiary
            <strong className="font-semibold"> "{confirmationText}"</strong>.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="delete-confirmation" className="text-sm font-medium">
              Type <span className="font-mono text-destructive">delete</span> to confirm:
            </Label>
            <Input
              id="delete-confirmation"
              placeholder="Type 'delete' to confirm"
              value={deleteConfirmationText}
              onChange={(e) => setDeleteConfirmationText(e.target.value)}
              disabled={isDeleting}
              className="font-mono"
              autoFocus
            />
          </div>
          <div className="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3">
            <p className="text-sm text-yellow-800 dark:text-yellow-200">
              <strong>Warning:</strong> This action will immediately remove the beneficiary
              from your account. Any transfers or payments associated with this beneficiary
              will remain, but you will need to recreate the beneficiary to use it again.
            </p>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDeleting || deleteConfirmationText.trim().toLowerCase() !== "delete"}
            className="bg-destructive text-white hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete Beneficiary
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

