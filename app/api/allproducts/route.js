import supabase from "../../supabase";

export async function GET() {
  const { data: products, error } = await supabase
    .from("MD_PRODUCTS")
    .select("*");

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
