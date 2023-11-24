// Import necessary modules
import supabase from "../../../supabase";
import { NextResponse } from "next/server";

export async function PATCH(request) {
    try {
        const url = request.url;
        const id = url.slice(url.lastIndexOf('/') + 1);

        if (!id) {
            return NextResponse.error("Missing 'id' parameter in the request.");
        }

        console.log(id);

        const { data, error: err1 } = await supabase
        .from("MD_PROFILES")
        .select("*")
        .eq('id', id);
    
        if (err1) {
          return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        const currentStatus = data[0].status;
      const newStatus = !currentStatus;

        // Perform the Supabase operation here
        const { error: err2 } = await supabase
            .from('MD_PROFILES')
            .update({ status: newStatus}) 
            .eq('id', id);

        // Check for an error and handle it if necessary
        if (err2) {
            return new Response(JSON.stringify({ error }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
            });
        }

        return new Response(JSON.stringify("SUCCESS"), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        // Handle unexpected errors here and return an appropriate response
        console.error("An error occurred:", error);
        return NextResponse.error(error);
    }
}
