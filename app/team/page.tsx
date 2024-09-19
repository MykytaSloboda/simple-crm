"use client";

import useSWR, { mutate } from "swr";
import { DataGrid, GridColDef, GridRowModel } from "@mui/x-data-grid";
import type { Team } from "@/app/lib/definition";

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const patchFetcher = async (url: string, data: object) => {
  const res = await fetch(url, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error('Error updating data');
  }
  return await res.json();
};

const columns: GridColDef[] = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    editable: true,
  },
  {
    field: "phone_number",
    headerName: "Phone number",
    width: 150,
    editable: true,
  },
  {
    field: "email",
    headerName: "Email",
    width: 150,
    editable: true,
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    editable: true,
  },
];

export default function Team() {
  const { data: teams = [], error } = useSWR<Team[]>("/api/team", fetcher);

  if (error) return <p>Error loading teams</p>;
  if (!teams) return <p>Loading...</p>;

  const handleRowEditStop = async (newRow: GridRowModel) => {
    try {
      const id = newRow.id;
      if (!id) {
        throw new Error('ID is required');
      }

      const updatedData = { 
        id: newRow.id,
        name: newRow.name, 
        phone_number: newRow.phone_number,
        email: newRow.email,
        role: newRow.role,
      };

      await patchFetcher(`/api/team/${id}`, updatedData);
      mutate("/api/team");
    } catch (error) {
      console.error('Error updating row:', error);
    }
  };
  

  return (
    <div className="container my-auto">
      <DataGrid
        rows={teams}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        checkboxSelection
        disableRowSelectionOnClick
        processRowUpdate={handleRowEditStop}
        onProcessRowUpdateError={(error) => console.error(error)}
      />
    </div>
  );
}
