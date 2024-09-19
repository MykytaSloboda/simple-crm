"use client";

import useSWR, { mutate } from "swr";
import { DataGrid, GridColDef, GridRowModel, GridRowSelectionModel } from "@mui/x-data-grid";
import type { Team } from "@/app/lib/definition";
import Link from "next/link";
import { useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const patchFetcher = async (url: string, data: object) => {
  const res = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error("Error updating data");
  }
  return await res.json();
};

const deleteFetcher = async (url: string) => {
  const res = await fetch(url, {
    method: "DELETE",
  });
  if (!res.ok) {
    throw new Error("Error deleting data");
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
  },
];

export default function Team() {
  const { data: teams = [], error } = useSWR<Team[]>("/api/team", fetcher);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  if (error) return <p>Error loading teams</p>;
  if (!teams) return <p>Loading...</p>;

  const handleRowEditStop = async (newRow: GridRowModel) => {
    try {
      const id = newRow.id;
      if (!id) {
        throw new Error("ID is required");
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
      console.error("Error updating row:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      for (const id of selectedRows) {
        await deleteFetcher(`/api/team/${id}`);
      }
      setSelectedRows([]);
      mutate("/api/team");
    } catch (error) {
      console.error("Error deleting rows:", error);
    }
  };

  return (
    <div className="container">
      <div className="flex gap-4 flex-wrap">
        <button>
          <Link
            href="/new-member"
            className="bg-blue-400 hover:bg-blue-500 active:bg-blue-700 text-white uppercase p-5 float-right rounded-lg my-5 duration-150 transition-colors"
          >
            New member
          </Link>
        </button>

        <button
          onClick={handleDeleteSelected}
          className="bg-red-400 hover:bg-red-500 active:bg-red-700 disabled:!bg-gray-500 disabled:opacity-75 text-white uppercase p-5 float-right rounded-lg my-5 duration-150 transition-colors"
          disabled={!selectedRows.length}
        >
          Delete Selected
        </button>
      </div>

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
        onRowSelectionModelChange={(newSelection: GridRowSelectionModel) => setSelectedRows(newSelection)}
      />
    </div>
  );
}
