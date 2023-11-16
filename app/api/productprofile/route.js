import supabase from "../../supabase";

export async function GET() {
    const { data: ingredients, error } = await supabase
    .from("ML_PRODUCT_FORMULA")
    .select("product_id, material_id, qty_needed, MD_RAW_MATERIALS(id, REF_METRIC(id, metric_unit))")
    .eq("status", "TRUE")

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    ingredients: ingredients,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

