import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {

    const { data, error } = await supabase
    .rpc('summary_material', {start_date, end_date})
    .in('material_name', selectedOptions)

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    data: data,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}