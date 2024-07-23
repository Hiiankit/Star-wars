"use client";

import React, { useEffect, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";

export type Peoples = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  hair_color: string;
};

const columns: ColumnDef<Peoples>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
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

export default function People() {
  const [data, setData] = useState<{
    results: Peoples[];
    next?: string;
    previous?: string;
  } | null>(null);
  const [url, setUrl] = useState("https://www.swapi.tech/api/people");

  useEffect(() => {
    fetch(url)
      .then((response) => response.json())
      .then(async (data) => {
        const detailedResults = await Promise.all(
          data.results.map(async (person: any) => {
            const personData = await fetch(person.url).then((res) =>
              res.json()
            );
            const properties = personData.result.properties;
            return {
              name: properties.name,
              height: properties.height,
              mass: properties.mass,
              gender: properties.gender,
              hair_color: properties.hair_color,
            };
          })
        );
        setData({
          results: detailedResults,
          next: data.next,
          previous: data.previous,
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, [url]);

  const handlePrevious = () => {
    if (data?.previous) setUrl(data.previous);
  };

  const handleNext = () => {
    if (data?.next) setUrl(data.next);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">People</h1>
      {data ? (
        <div>
          <DataTable columns={columns} data={data.results} />
          <div className="flex items-center justify-end space-x-2 py-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!data.previous}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!data.next}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}
