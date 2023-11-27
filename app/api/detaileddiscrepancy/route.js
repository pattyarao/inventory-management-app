import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {
  try {
    const { data: detailedReport, error } = await supabase
      .from("DETAILED_DISCREPANCY")
      .select()
      .gte('transaction_date', start_date) 
      .lt('transaction_date', end_date)
      .in('material_name', selectedOptions);

    if (error) {
      throw error;
    }

    if (Array.isArray(detailedReport)) {
      const json = {
        detailedReport: detailedReport,
      };

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Handle the case where detailedReport is not an array
      throw new Error("detailedReport is not an array");
    }
  } catch (error) {
    // Handle other errors, e.g., network issues, Supabase client setup, etc.
    console.error("Error fetching detailed report:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
