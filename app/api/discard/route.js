import supabase from "../../supabase";
import { CONVERTMETRIC } from "../helper/route"; 


// split list into materials and variants
// normalize unit into g or mL
// for materials, clean data and post to db
// for variants, process into material data and post to db

function createPostData(discardedList, user_id) {
    const masterlistData = [];
    const variantsAuditTrailData = [];
    const materialsAuditTrailData = [];
    const timestamp = new Date().toISOString();

    discardedList.forEach((discarded) => {
        var totalMaterialAmount = 0; // total amount to discard from the masterlist
        var totalPartialAmount = 0; // total amount of partial discards from variants

        // create audit trail data
        discarded.variants.forEach((variant) => {
            totalMaterialAmount += (variant.quantity * variant.finalAmount) + variant.finalPartialAmount; // TODO: normalize unit into g or mL
            totalPartialAmount += variant.finalPartialAmount
            console.log("variant total material amount composition", variant.quantity, variant.finalAmount, variant.finalPartialAmount)


            // determine if item is a variant or material
            if ( variant.id === discarded.id ) { 
                materialsAuditTrailData.push({
                    created_at: timestamp,
                    material_id: variant.id,
                    expired_qty: variant.finalAmount, // depends if there can still be a quantity assigned to a material
                    user_id: user_id,
                    reason_id: variant.reason_id,
                })
            }
            else {
                variantsAuditTrailData.push({
                    created_at: timestamp,
                    var_id: variant.id,
                    qty: variant.quantity,
                    user_id: user_id,
                    reason_id: variant.reason_id,
                })
            }

        })

        // record partial amount from variant discard for each material
        if (totalPartialAmount > 0) {
            materialsAuditTrailData.push({
                created_at: timestamp,
                material_id: discarded.id,
                expired_qty: totalPartialAmount, 
                user_id: user_id,
                reason_id: "780d38a5-93ee-479b-90a8-8799d05c66f0",
            })
        }

        console.log("total partial discard amount", totalPartialAmount)

        console.log("total material amount", totalMaterialAmount)

        // create masterlist data
        masterlistData.push({
            id: discarded.id,
            amount: totalMaterialAmount,
            qty_available: discarded.qty_available
        })
    })


    return { masterlistData, materialsAuditTrailData, variantsAuditTrailData }
}

export async function POST(discardedList, user_id) {

    console.log("POST PARAM: ", discardedList)

    const { masterlistData, materialsAuditTrailData, variantsAuditTrailData } = createPostData(discardedList, user_id);

    console.log("POST TEST: ", masterlistData, materialsAuditTrailData, variantsAuditTrailData);

    try {
        // post audit trails
        if (materialsAuditTrailData.length > 0) {
            const { data: result1, error: error1 } = await supabase
            .from("TD_DISCARD")
            .insert(materialsAuditTrailData)

            if (error1) {
                console.error('Supabase operation 1 error:', error1);
            } else {
                console.log('Supabase operation 1 result:', result1);
            }
        }

        if (variantsAuditTrailData.length > 0) {
            const { data: result2, error: error2 } = await supabase
            .from("TD_DISCARDVAR")
            .insert(variantsAuditTrailData)

            if (error2) {
                console.error('Supabase operation 2 error:', error2);
            } else {
                console.log('Supabase operation 2 result:', result2);
            }
        }

        // update masterlist
        masterlistData.forEach( async (masterlist) => {
            const { data, error } = await supabase
                .from("MD_RAW_MATERIALS")
                .update({qty_available: masterlist.qty_available - masterlist.amount})
                .eq("id", masterlist.id)
        })
    } catch (error) {
        console.log(error);
    }
}

export async function GET() {
    const { data: materials, error } = await supabase
        .from("MD_RAW_MATERIALS")
        .select("id, qty_available, name, REF_METRIC(id, metric_unit)")
        .eq("status", "TRUE")
        
  
    const { data: variants, error2 } = await supabase
        .from("MD_MATVARIATION")
        .select("*, MD_RAW_MATERIALS(*)")
        .eq("status", "TRUE")
        
  
    // new code that returns a complete list of material and variants
    if (!error && !error2) {
      const mergedlist = [
        ...materials,
        ...variants
      ]
  
      const sortedMergedList = [...mergedlist].sort((a, b) => a.name.localeCompare(b.name));


      const json = {
        materials: sortedMergedList
      };
  
      console.log('material list: ', mergedlist)
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    
    if (error) {
      console.log(error)
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}

export async function NEWREASON(reason) {
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