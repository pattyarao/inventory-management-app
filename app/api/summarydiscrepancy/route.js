import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {
  try {
    const { data, error } = await supabase
      .rpc('summary_discrepancy', { start_date, end_date })
      .in('name', selectedOptions);

    if (error) {
      throw error;
    }

    const json = {
      data: data,
    };

    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Handle other errors, e.g., network issues, Supabase client setup, etc.
    console.error("Error fetching summary discrepancy:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
