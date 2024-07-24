"use client";
import * as React from "react";
import { useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  SortingState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import SheetComponent from "@/app/sheet/sheetcomp";

// Define the DataTable component with generics for data and value types
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]; // Column definitions for the table
  data: TData[]; // Data to display in the table
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // State for sorting
  const [sorting, setSorting] = useState<SortingState>([]);
  // State for column filters
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  // State for pagination
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  // State for search query
  const [searchQuery, setSearchQuery] = useState("");
  // State to manage the sheet component visibility
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Memoized filtered data based on the search query
  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      (item as { name: string }).name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // Initialize React Table with various hooks and configurations
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      pagination,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <>
      {/* Table UI component */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                  onClick={() => {
                    setIsSheetOpen(true); // Open the sheet when a row is clicked
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading...
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {/* Sheet component for additional details or actions */}
      <SheetComponent
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        title="Are you absolutely sure?"
        description="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      />
    </>
  );
}
