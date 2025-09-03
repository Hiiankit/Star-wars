"use client";
import React, { useState, useEffect, useCallback } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table";
import { Input } from "@/components/ui/input";

// ----------------- Config & Helpers -----------------
const SWAPI_BASE =
  process.env.NEXT_PUBLIC_SWAPI_BASE ?? "https://swapi.py4e.com/api/";

// replaces any absolute swapi.dev URLs with our base mirror
function normalizeSwapiUrl(url?: string | null): string {
  if (!url) return `${SWAPI_BASE}people/`;
  return url.replace(/^https?:\/\/swapi\.dev\/api\//, SWAPI_BASE);
}

async function assertOk(res: Response, url: string) {
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`HTTP ${res.status} ${res.statusText} for ${url} ${text.slice(0, 120)}`);
  }
}

// ----------------- Types & Table -----------------
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
  { accessorKey: "height", header: "Height" },
  { accessorKey: "mass", header: "Mass" },
  { accessorKey: "gender", header: "Gender" },
  { accessorKey: "hair_color", header: "Hair Color" },
];

// ----------------- Data Fetching -----------------
const fetchPersonDetails = async (person: any): Promise<Peoples> => {
  const films = await Promise.all(
    (person.films ?? []).map(async (filmUrl: string) => {
      const url = normalizeSwapiUrl(filmUrl); // <- normalize film URLs too
      const res = await fetch(url, { cache: "no-store" });
      await assertOk(res, url);
      const filmData = await res.json();
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
};

const fetchPeopleData = async (
  url: string
): Promise<{ results: Peoples[]; next?: string; previous?: string }> => {
  const finalUrl = normalizeSwapiUrl(url);
  const response = await fetch(finalUrl, { cache: "no-store" });
  await assertOk(response, finalUrl);

  const result = await response.json();

  const detailedResults: Peoples[] = await Promise.all(
    (result.results ?? []).map(fetchPersonDetails)
  );

  return {
    results: detailedResults,
    next: normalizeSwapiUrl(result.next),       // <- normalize pagination
    previous: normalizeSwapiUrl(result.previous),
  };
};

// ----------------- Component -----------------
export default function People() {
  const [data, setData] = useState<{
    results: Peoples[];
    next?: string;
    previous?: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [paginationUrl, setPaginationUrl] = useState(`${SWAPI_BASE}people/`);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = searchQuery
          ? `${SWAPI_BASE}people/?search=${encodeURIComponent(searchQuery)}`
          : paginationUrl;

        console.log("Fetching:", apiUrl);
        const result = await fetchPeopleData(apiUrl);
        console.log("API response:", result);
        setData(result);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        console.error("Error fetching data:", msg);
        setError(msg); // show the real reason
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

  return (
    <div className="bg-cover bg-center h-screen bg-[url('./swtfa11.jpg')] bg-black bg-blur-sm">
      <div className="container mx-auto py-1 ">
        <h1 className="text-2xl text-yellow-200 font-semibold">People</h1>
        <div className="flex items-center py-3 ">
          <Input
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs bg-transparent backdrop-blur-sm text-white"
          />
        </div>

        {error && <p className="text-red-500 whitespace-pre-wrap">{error}</p>}

        <div className="text-white backdrop-blur-md ">
          <DataTable columns={columns} data={data?.results ?? []} loading={loading} />

          {!searchQuery && data && (
            <div className="flex items-center justify-end space-x-2 pt-2">
              <Button
                className="bg-transparent backdrop-blur-sm"
                variant="outline"
                size="sm"
                onClick={handlePrevious}
                disabled={!data.previous}
              >
                Previous
              </Button>
              <Button
                className="bg-transparent backdrop-blur-sm hover:bg-none"
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
    </div>
  );
}
