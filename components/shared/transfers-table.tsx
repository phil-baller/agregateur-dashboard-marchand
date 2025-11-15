"use client";

import { useMemo } from "react";
import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/data-table/data-table";
import { useDataTable } from "@/hooks/use-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye } from "lucide-react";
interface Transfer {
  id: string;
  amount: number;
  reference?: string;
  status?: string;
  createdAt?: string;
  beneficiary?: {
    id: string;
    name?: string | null;
    phone?: string;
    [key: string]: unknown;
  };
  service_mobile?: {
    id: string;
    name?: string;
    country?: string;
    code_prefix?: string;
    api_endpoint?: string | null;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

interface TransfersTableProps {
  data: Transfer[];
  onView?: (transfer: Transfer) => void;
  onRowClick?: (transfer: Transfer) => void;
  isLoading?: boolean;
  pagination?: {
    page: number;
    size: number;
    total: number;
  };
  onPaginationChange?: (page: number, size: number) => void;
}

const statusColors: Record<string, string> = {
  INIT: "bg-gray-100 text-gray-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  COMPLETE: "bg-green-100 text-green-800",
  FAILED: "bg-red-100 text-red-800",
};

export const TransfersTable = ({
  data,
  onView,
  onRowClick,
  isLoading = false,
  pagination,
  onPaginationChange,
}: TransfersTableProps) => {
  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        accessorKey: "reference",
        header: "Reference",
        cell: ({ row }) => (
          <div className="font-medium font-mono text-sm">
            {row.original.reference || row.original.id.slice(-8)}
          </div>
        ),
      },
      {
        accessorKey: "beneficiary",
        header: "Recipient",
        cell: ({ row }) => (
          <div className="font-medium">
            {row.original.beneficiary?.name || "-"}
          </div>
        ),
      },
      {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => (
          <div>{row.original.beneficiary?.phone || "-"}</div>
        ),
      },
      {
        accessorKey: "amount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = row.original.amount;
          return (
            <div className="font-medium">
              {typeof amount === "number"
                ? new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "XOF",
                  }).format(amount)
                : amount}
            </div>
          );
        },
      },
      {
        accessorKey: "service_mobile",
        header: "Service",
        cell: ({ row }) => (
          <Badge variant="secondary">
            {row.original.service_mobile?.name || row.original.service_mobile?.code_prefix || "-"}
          </Badge>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.original.status || "INIT";
          return (
            <Badge
              variant="outline"
              className={statusColors[status] || statusColors.INIT}
            >
              {status}
            </Badge>
          );
        },
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return "-";
          return new Date(date as string).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          });
        },
      },
      {
        id: "actions",
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="h-8 w-8 p-0"
                onClick={(e) => e.stopPropagation()}
              >
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {(onView || onRowClick) && (
                <DropdownMenuItem 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (onRowClick) {
                      onRowClick(row.original);
                    } else if (onView) {
                      onView(row.original);
                    }
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Details
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [onView, onRowClick]
  );

  const pageCount = pagination
    ? Math.ceil(pagination.total / pagination.size)
    : Math.ceil(data.length / 10);

  const { table } = useDataTable({
    data,
    columns,
    pageCount,
    initialState: {
      pagination: pagination
        ? {
            pageIndex: pagination.page - 1,
            pageSize: pagination.size,
          }
        : undefined,
    },
  });

  const prevPaginationRef = React.useRef({
    pageIndex: pagination ? pagination.page - 1 : 0,
    pageSize: pagination?.size || 10,
  });
  
  React.useEffect(() => {
    if (!onPaginationChange || !pagination) return;
    
    const currentPageIndex = table.getState().pagination.pageIndex;
    const currentPageSize = table.getState().pagination.pageSize;
    const prevPageIndex = prevPaginationRef.current.pageIndex;
    const prevPageSize = prevPaginationRef.current.pageSize;
    
    if (
      (currentPageIndex !== prevPageIndex || currentPageSize !== prevPageSize) &&
      (currentPageIndex + 1 !== pagination.page || currentPageSize !== pagination.size)
    ) {
      onPaginationChange(currentPageIndex + 1, currentPageSize);
      prevPaginationRef.current = { pageIndex: currentPageIndex, pageSize: currentPageSize };
    }
  }, [table.getState().pagination.pageIndex, table.getState().pagination.pageSize, onPaginationChange, pagination]);

  const handleRowClick = (transfer: Transfer) => {
    if (onRowClick) {
      onRowClick(transfer);
    } else if (onView) {
      onView(transfer);
    }
  };

  return (
    <DataTable
      table={table}
      onRowClick={handleRowClick}
    />
  );
};

