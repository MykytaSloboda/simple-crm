import { updateTeam } from "@/app/db/queries";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const data = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const updatedTeam = await updateTeam(+id, data);

    if (updatedTeam) {
      return NextResponse.json(updatedTeam, { status: 200 });
    } else {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating user", error },
      { status: 500 }
    );
  }
}
