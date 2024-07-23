"use client"

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
export type People = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  hair_color: string;
};

export const columns: ColumnDef<People>[] = [
  {
    accessorKey: "name",
    header: "Name",
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
