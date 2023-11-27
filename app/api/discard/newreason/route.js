import supabase from "../../../supabase"

export async function POST(reason) {
    // post manual count data
    const { data: response, error: error } = await supabase
    .from('REF_REASON')
    .insert({reason: reason})
    .select()

    console.log('supabase return response: ', response, error)

    if (error) {
      console.log(error)
      return new Response(JSON.stringify(error), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const json = {newReason: response}

    console.log(JSON.stringify(json))
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}