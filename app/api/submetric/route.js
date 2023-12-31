import supabase from "../../supabase";
import { NextResponse } from "next/server";

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
          .from("REF_SUBMETRIC")
          .upsert(unitList);
  
        if (unitError) {
          return NextResponse.json( { error: unitError }, {status: 500});
        }
      } catch (error) {
        return NextResponse.json({error: error.message}, {status: 500});
      }

      return NextResponse.json({ success: true }, {status: 200});
   
  }
