import supabase from "../../supabase";

export async function GETMETRIC() {
    const {data: metric, error} = await supabase
        .from ("REF_METRIC")
        .select("*")
    
    if (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    const json = {
        metric: metric
        };
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function GETREASON() {
    const {data: reason, error} = await supabase
        .from ("REF_REASON")
        .select("*")
    
    if (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }
    const json = {
        reason: reason
      };
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function CONVERTMETRIC(amt, unit, metricList) {
    const metric = metricList.filter((metric) => metric.id === unit);
}