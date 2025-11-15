"use client";

import { useEffect, useState, Suspense } from "react";
import { useBeneficiariesStore } from "@/stores/beneficiaries.store";
import { useCountriesStore } from "@/stores/countries.store";
import { useAuthStore } from "@/stores/auth.store";
import { useOrganisationsStore } from "@/stores/organisations.store";
import { BeneficiariesTable } from "@/components/shared/beneficiaries-table";
import { CreateBeneficiaryDialog } from "@/components/shared/create-beneficiary-dialog";
import { DeleteBeneficiaryDialog } from "@/components/shared/delete-beneficiary-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTableSkeleton } from "@/components/data-table/data-table-skeleton";
import { Plus, User } from "lucide-react";
import { toast } from "sonner";
import type { CreateBeneficiaireDto, UpdateBeneficiaireDto } from "@/types/api";

interface Beneficiary {
  id: string;
  name: string;
  phone: string;
  country_id: string;
  code_phone?: string;
  [key: string]: unknown;
}

export default function BeneficiariesPage() {
  const {
    beneficiaries,
    isLoading,
    pagination,
    fetchMyBeneficiaries,
    fetchBeneficiariesByOrganisation,
    createBeneficiary,
    updateBeneficiary,
    deleteBeneficiary,
  } = useBeneficiariesStore();
  const { countries, fetchCountries } = useCountriesStore();
  const { isAuthenticated } = useAuthStore();
  const { organisation } = useOrganisationsStore();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBeneficiary, setSelectedBeneficiary] = useState<Beneficiary | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCountries();
      if (organisation?.id) {
        fetchBeneficiariesByOrganisation(organisation.id, { page: 1, size: 10 });
      } else {
        fetchMyBeneficiaries({ page: 1, size: 10 });
      }
    }
  }, [isAuthenticated, organisation?.id, fetchMyBeneficiaries, fetchBeneficiariesByOrganisation, fetchCountries]);

  const fetchBeneficiaries = async () => {
    if (organisation?.id) {
      await fetchBeneficiariesByOrganisation(organisation.id, {
        page: pagination?.page || 1,
        size: pagination?.size || 10,
      });
    } else {
      await fetchMyBeneficiaries({
        page: pagination?.page || 1,
        size: pagination?.size || 10,
      });
    }
  };

  const handleCreateBeneficiary = async (data: CreateBeneficiaireDto) => {
    setIsCreating(true);
    try {
      await createBeneficiary(data);
      await fetchBeneficiaries();
      setIsCreateDialogOpen(false);
    } catch (error) {
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateBeneficiary = async (id: string, data: UpdateBeneficiaireDto) => {
    setIsUpdating(true);
    try {
      await updateBeneficiary(id, data);
      await fetchBeneficiaries();
      setIsCreateDialogOpen(false);
      setSelectedBeneficiary(null);
    } catch (error) {
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsCreateDialogOpen(true);
  };

  const handleDeleteBeneficiary = (beneficiary: Beneficiary) => {
    setSelectedBeneficiary(beneficiary);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBeneficiary) return;

    setIsDeleting(true);
    try {
      await deleteBeneficiary(selectedBeneficiary.id);
      await fetchBeneficiaries();
      toast.success("Beneficiary deleted successfully");
      setIsDeleteDialogOpen(false);
      setSelectedBeneficiary(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to delete beneficiary";
      toast.error(errorMessage);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateClick = () => {
    setSelectedBeneficiary(null);
    setIsCreateDialogOpen(true);
  };

  const handlePaginationChange = (page: number, size: number) => {
    if (organisation?.id) {
      fetchBeneficiariesByOrganisation(organisation.id, { page, size });
    } else {
      fetchMyBeneficiaries({ page, size });
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header Section */}
      <div className="flex flex-col items-center justify-center gap-4 rounded-lg bg-primary/10 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-primary/20">
          <div className="flex h-12 w-12 items-center justify-center rounded bg-primary/30">
            <User className="h-6 w-6 text-primary" />
          </div>
        </div>
        <h1 className="text-3xl font-bold">Manage Beneficiaries</h1>
        <p className="max-w-2xl text-muted-foreground">
          Create and manage your beneficiaries for quick transfers and payments.
          Save recipient information for faster transactions.
        </p>
        <Button size="lg" onClick={handleCreateClick}>
          <Plus className="mr-2 h-4 w-4" />
          Create new beneficiary
        </Button>
      </div>

      {/* Beneficiaries Table */}
      <Card>
        <CardHeader>
          <CardTitle>Beneficiaries</CardTitle>
          <CardDescription>
            View and manage your saved beneficiaries
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <DataTableSkeleton columnCount={4} rowCount={5} />
          ) : (
            <Suspense
              fallback={<DataTableSkeleton columnCount={4} rowCount={5} />}
            >
              <BeneficiariesTable
                data={Array.isArray(beneficiaries) ? beneficiaries : []}
                isLoading={isLoading}
                onEdit={handleEditBeneficiary}
                onDelete={handleDeleteBeneficiary}
                pagination={pagination}
                onPaginationChange={handlePaginationChange}
              />
            </Suspense>
          )}
        </CardContent>
      </Card>

      {/* Create/Update Beneficiary Dialog */}
      <CreateBeneficiaryDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        countries={countries}
        beneficiary={selectedBeneficiary}
        onCreateBeneficiary={handleCreateBeneficiary}
        onUpdateBeneficiary={handleUpdateBeneficiary}
        isLoading={isCreating || isUpdating}
      />

      {/* Delete Confirmation Dialog */}
      <DeleteBeneficiaryDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        beneficiary={selectedBeneficiary}
        onConfirm={handleDeleteConfirm}
        isDeleting={isDeleting}
      />
    </div>
  );
}

