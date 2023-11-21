import supabase from "../../supabase";


export async function GET() {
  const { data: variants, error } = await supabase
    .from("MD_MATVARIATION")
    .select("*")
    .eq("status", "TRUE");

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    variants: variants,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST function
export async function POST(variants) {
  try {
    const { data, error } = await supabase
      .from("MD_MATVARIATION")
      .upsert([{
        material_id: variants.material_id,
        amt: variants.amt,
        name: variants.name,
        status: "TRUE"
      }]);

    if (error) {
      return { error };
    }

    return { newVariant: data[0] }; // Assuming data is an array with the newly inserted variant
  } catch (error) {
    return { error: error.message };
  }
}
