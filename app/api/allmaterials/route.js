import supabase from "../../supabase";

export async function GET() {
  const { data: materials, error } = await supabase
    .from("MD_RAW_MATERIALS")
    .select("*");

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    materials: materials,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
