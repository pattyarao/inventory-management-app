import supabase from "../../supabase";

export async function GET() {
  const { data: models, error } = await supabase
    .from("ML_MODELS")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    models: models,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
