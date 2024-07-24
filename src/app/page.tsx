"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

export type Peoples = {
  name: string;
  height: string;
  mass: string;
  gender: string;
  hair_color: string;
  films: string[];
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
  const [searchQuery, setSearchQuery] = useState("");
  const [paginationUrl, setPaginationUrl] = useState(
    "https://swapi.dev/api/people/"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Construct the URL based on the search query or pagination
        let apiUrl = searchQuery
          ? `https://swapi.dev/api/people/?search=${searchQuery}`
          : paginationUrl;

        console.log(`Fetching data from URL: ${apiUrl}`); // Log the URL

        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Network response was not ok");

        const result = await response.json();
        console.log("API response:", result); // Log the API response

        // Process the results
        const detailedResults: Peoples[] = await Promise.all(
          result.results.map(async (person: any) => {
            const films = await Promise.all(
              person.films.map(async (filmUrl: string) => {
                const filmResponse = await fetch(filmUrl);
                const filmData = await filmResponse.json();
                return filmData.title;
              })
            );
            return {
              name: person.name,
              height: person.height,
              mass: person.mass,
              gender: person.gender,
              hair_color: person.hair_color,
              films,
            };
          })
        );

        setData({
          results: detailedResults,
          next: result.next,
          previous: result.previous,
        });
      } catch (error) {
        console.error("Error fetching data:", error); // Log the error
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [paginationUrl, searchQuery]);

  const handlePrevious = useCallback(() => {
    if (data?.previous) setPaginationUrl(data.previous);
  }, [data]);

  const handleNext = useCallback(() => {
    if (data?.next) setPaginationUrl(data.next);
  }, [data]);

  const handleSearch = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    []
  );

  // Filtered data based on search query
  const filteredData = searchQuery
    ? data?.results.filter((person) =>
        person.name.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : data?.results || [];

  return (
    <div className="container mx-auto py-5">
      <h1 className="text-2xl font-bold">People</h1>
      <div className="flex items-center py-3">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-xs"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      <div>
        <DataTable columns={columns} data={filteredData} />
        {!searchQuery && data && (
          <div className="flex items-center justify-end space-x-2 pt-2">
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
        )}
      </div>
    </div>
  );
}
