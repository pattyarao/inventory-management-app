import supabase from "../../supabase";

export async function GET(role) {
  const { data: employees, error } = await supabase
    .from("MD_PROFILES")
    .select("*")
    .order("status", { ascending: false })
    .order("user_type", { ascending: true });

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    employees: employees,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
