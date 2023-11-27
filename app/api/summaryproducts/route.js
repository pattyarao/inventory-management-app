import supabase from "../../supabase";

export async function GET(start_date, end_date, selectedOptions) {
  try {
    const { data, error } = await supabase
      .rpc('summary_product', { start_date, end_date })
      .in('product_name', selectedOptions);

    if (error) {
      throw error;
    }

    if (Array.isArray(data)) {
      const json = {
        data: data,
      };

      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Handle the case where data is not an array
      throw new Error("RPC response data is not an array");
    }
  } catch (error) {
    // Handle other errors, e.g., network issues, Supabase client setup, etc.
    console.error("Error fetching summary product:", error);

    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
