import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {


    const { data: detailedReport, error } = await supabase
    .from("DETAILED_REJORDERS")
    .select()
    .gte('created_at', start_date) 
    .lt('created_at', end_date)
    .in('name', selectedOptions)

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    detailedReport: detailedReport,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}