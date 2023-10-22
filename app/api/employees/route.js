import supabase from "@/app/supabase";
import {NextRequest, NextResponse} from "next/server";

export async function GET(request) {
  const { data: employees, error } = await supabase
    .from("MD_PROFILES")
    .select("*");

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    name: employees[0].first_name,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
