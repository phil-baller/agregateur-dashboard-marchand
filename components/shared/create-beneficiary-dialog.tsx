"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { CreateBeneficiaireDto, UpdateBeneficiaireDto, CountryResponseDto } from "@/types/api";

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  country_id: string;
  code_phone?: string;
  [key: string]: unknown;
}

interface CreateBeneficiaryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  countries: CountryResponseDto[];
  beneficiary?: Beneficiary | null;
  onCreateBeneficiary: (data: CreateBeneficiaireDto) => Promise<void>;
  onUpdateBeneficiary?: (id: string, data: UpdateBeneficiaireDto) => Promise<void>;
  isLoading?: boolean;
}

interface BeneficiaryFormData {
  name: string;
  phone: string;
  country_id: string;
  code_phone?: string;
}

export const CreateBeneficiaryDialog = ({
  open,
  onOpenChange,
  countries,
  beneficiary,
  onCreateBeneficiary,
  onUpdateBeneficiary,
  isLoading = false,
}: CreateBeneficiaryDialogProps) => {
  const isEditMode = !!beneficiary;

  const form = useForm<BeneficiaryFormData>({
    defaultValues: {
      name: beneficiary?.name || "",
      phone: beneficiary?.phone || "",
      country_id: beneficiary?.country_id || "",
      code_phone: beneficiary?.code_phone || "",
    },
    mode: "onChange",
  });

  React.useEffect(() => {
    if (open) {
      if (beneficiary) {
        form.reset({
          name: beneficiary.name || "",
          phone: beneficiary.phone || "",
          country_id: beneficiary.country_id || "",
          code_phone: beneficiary.code_phone || "",
        });
      } else {
        form.reset({
          name: "",
          phone: "",
          country_id: "",
          code_phone: "",
        });
      }
    }
  }, [open, beneficiary, form]);

  const handleSubmit = async (data: BeneficiaryFormData) => {
    if (!data.country_id) {
      form.setError("country_id", {
        type: "required",
        message: "Country is required",
      });
      return;
    }

    try {
      if (isEditMode && beneficiary && onUpdateBeneficiary) {
        await onUpdateBeneficiary(beneficiary.id, {
          name: data.name,
        });
        toast.success("Beneficiary updated successfully");
      } else {
        await onCreateBeneficiary({
          name: data.name,
          phone: data.phone,
          country_id: data.country_id,
          code_phone: data.code_phone,
        });
        toast.success("Beneficiary created successfully");
      }
      handleClose();
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : isEditMode
            ? "Failed to update beneficiary"
            : "Failed to create beneficiary";
      toast.error(errorMessage);
    }
  };

  const handleClose = () => {
    form.reset();
    onOpenChange(false);
  };

  const selectedCountry = countries.find(
    (c) => c.id === form.watch("country_id")
  );

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditMode ? "Update Beneficiary" : "Create New Beneficiary"}
          </DialogTitle>
          <DialogDescription>
            {isEditMode
              ? "Update the beneficiary information"
              : "Enter the beneficiary details to create a new beneficiary"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter beneficiary name"
              {...form.register("name", {
                required: "Name is required",
              })}
            />
            {form.formState.errors.name && (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            )}
          </div>

          {!isEditMode && (
            <>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  {...form.register("phone", {
                    required: "Phone number is required",
                  })}
                />
                {form.formState.errors.phone && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.phone.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country_id">Country *</Label>
                <Select
                  value={form.watch("country_id")}
                  onValueChange={(value) => {
                    form.setValue("country_id", value, { shouldValidate: true });
                    const country = countries.find((c) => c.id === value);
                    if (country) {
                      form.setValue("code_phone", country.code_phone || "");
                    }
                  }}
                  disabled={countries.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={
                        countries.length === 0
                          ? "No countries available"
                          : "Select country"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.length === 0 ? (
                      <div className="px-2 py-1.5 text-sm text-muted-foreground">
                        No countries available
                      </div>
                    ) : (
                      countries.map((country) => (
                        <SelectItem key={country.id} value={country.id}>
                          {country.libelle} {country.code_phone && `(+${country.code_phone})`}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                {form.formState.errors.country_id && (
                  <p className="text-sm text-destructive">
                    {form.formState.errors.country_id.message}
                  </p>
                )}
              </div>

              {selectedCountry && (
                <div className="space-y-2">
                  <Label htmlFor="code_phone">Country Code</Label>
                  <Input
                    id="code_phone"
                    type="text"
                    placeholder="Country code"
                    value={selectedCountry.code_phone || ""}
                    disabled
                  />
                  <p className="text-xs text-muted-foreground">
                    Country code is automatically set based on selected country
                  </p>
                </div>
              )}
            </>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditMode ? "Updating..." : "Creating..."}
                </>
              ) : (
                isEditMode ? "Update" : "Create"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

