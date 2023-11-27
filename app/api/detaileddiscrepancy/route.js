import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {

    const { data: detailedReport, error } = await supabase
    .from("DETAILED_DISCREPANCY")
    .select()
    .gte('transaction_date', start_date) 
    .lt('transaction_date', end_date)
    .in('material_name', selectedOptions)

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