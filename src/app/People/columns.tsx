'use client'
import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import {ArrowUpDown} from 'lucide-react'
import { Button } from "@/components/ui/button";

export type Peoples = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  hair_color: string;
};

export const columns: ColumnDef<Peoples>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
  },
  {
    accessorKey: "height",
    header: "Height",
  },
  {
    accessorKey: "mass",
    header: "Mass",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "hair_color",
    header: "Hair Color",
  },
];