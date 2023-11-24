import supabase from "../../supabase";

export async function GET() {
  const { data: materials, error } = await supabase
    .from("MD_RAW_MATERIALS")
    .select("id, metric_id, qty_available, status, name, REF_METRIC(metric_unit)");

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
