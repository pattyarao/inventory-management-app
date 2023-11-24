import supabase from "../../supabase";

export async function GET() {
    const { data: metrics, error } = await supabase
    .from("REF_SUBMETRIC")
    .select("*")

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    metrics: metrics,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST function
export async function POST(newUnit) {
  
  
      // Next, perform queries for variant purchases
      try {
        const unitList =  ({
          metric_id: newUnit.metric_id,
          name: newUnit.name,
          abbreviation: newUnit.abbreviation,
          ratio: newUnit.ratio,
          status: true
        });
  
        const { data: unitData, error: unitError } = await supabase
          .from("REF_SUBMETRIC") // Check the table name
          .upsert(unitList);
  
        if (unitError) {
          return { error: unitError };
        }
      } catch (error) {
        return { error: error.message };
      }
      // You can continue with more queries or return a success status as needed.
      return { success: true };
   
  }
