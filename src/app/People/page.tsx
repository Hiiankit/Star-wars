import { Peoples, columns } from "./columns";
import { DataTable } from "@/components/data-table";

async function getPeoples(): Promise<Peoples[]> {
  const peoples: Peoples[] = [];
  let nextPage = 'https://swapi.dev/api/people';

  while (nextPage) {
    const res = await fetch(nextPage);
    const data = await res.json();
    peoples.push(...data.results);
    nextPage = data.next;
  }

  return peoples;
}

export default async function Page() {
  const data = await getPeoples();

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data}/>
    </div>
  );
}