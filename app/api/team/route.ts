import { createTeam, getTeam } from "@/app/db/queries";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const teams = await getTeam();
    return new Response(JSON.stringify(teams), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Error fetching teams", error }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { name, phone_number, role_id, email } = body;
    if (!name || !phone_number || !role_id || !email) {
      return new NextResponse(JSON.stringify({ message: 'Missing required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    await createTeam(body);

    return new NextResponse(JSON.stringify({ message: 'Team created successfully' }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new NextResponse(JSON.stringify({ message: 'Error creating team', error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
