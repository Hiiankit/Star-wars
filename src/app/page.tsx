import { People, columns } from "../app/People/columns";
import { DataTable } from "../app/People/data-table";

async function getData(): Promise<People[]> {
  const res = await fetch('https://swapi.dev/api/people');
  const data = await res.json();
  return data.results.map((person: any) => ({
    name: person.name,
    height: person.height,
    mass: person.mass,
    gender: person.gender,
    hair_color: person.hair_color,
  }));
}

export default async function Page() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
