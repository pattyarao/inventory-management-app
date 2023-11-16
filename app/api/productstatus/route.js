import supabase from "../../supabase";

export async function GET() {
  const { data: products, error } = await supabase
    .from("MD_PRODUCTS")
    .select("id, name, created_at, status");

  console.log("Products fetched:", products);

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    products: products,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

export async function PATCH(id, newStatus) {
    try {
        const {data, error} = await supabase
            .from('MD_PRODUCTS')
            .update({status: newStatus})
            .eq('id', id);
        if (error) {
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }
        return data;
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
}