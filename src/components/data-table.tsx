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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

//Defines PersonData for the structure of each person
interface PersonData {
  name: string;
  height: string;
  mass: string;
  gender: string;
  hair_color: string;
  films: string[];
}

interface DataTableProps<TData extends PersonData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  loading: boolean;
}

//DataTable Component
export function DataTable<TData extends PersonData, TValue>({
  columns,
  data,
  loading,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 1,
    pageSize: 10,
  });
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState<PersonData | null>(null); // State for selected person

  // Memoized filtered data based on the search query
  const filteredData = React.useMemo(() => {
    return data.filter((item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleRowClick = (person: PersonData) => {
    setSelectedPerson(person);
    setIsSheetOpen(true);
  };

  return (
    <>
      <div className="rounded-md border relative">
        {loading && (
          <div className="h-8 w-8 absolute border-[4px] rounded-full border-white border-r-yellow-400 animate-spin top-[50%] left-[50%]  "></div>
        )}
        <Table className={`${loading ? "opacity-50" : ""}`}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead className="text-white" key={header.id}>
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
                  onClick={() => handleRowClick(row.original)} // Pass the row's data to the handler
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
                ></TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedPerson && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetContent className="bg-transparent backdrop-blur-md border-none backdrop-grayscale">
            <SheetHeader>
              <SheetTitle className="text-white flex justify-center items-center text-yellow-300">
                {selectedPerson.name}
              </SheetTitle>
              <SheetDescription>
                <p className="text-white py-5 flex flex-col justify-center items-center text-lg text-yellow-500 ">
                  Films
                  <ul className="pt-5 text-yellow-100  ">
                    {selectedPerson.films.map((film, index) => (
                      <li key={index}>
                        <a
                          className="text-white text-sm flex flex-col items-center py-1 my-2 px-2 rounded-lg border-2 border-gray-500 hover:bg-gray-700"
                          href={`https://www.google.com/search?q=${encodeURIComponent(
                            film
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {film}
                        </a>
                      </li>
                    ))}
                  </ul>
                </p>
              </SheetDescription>
            </SheetHeader>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}
