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

        // create audit trail data
        discarded.variants.forEach((variant) => {
            totalMaterialAmount += variant.quantity * variant.amount; // TODO: normalize unit into g or mL

            console.log("variant", variant)


            // determine if item is a variant or material
            if ( variant.id === discarded.id ) { // the item is a material
                materialsAuditTrailData.push({
                    created_at: timestamp,
                    material_id: variant.id,
                    expired_qty: variant.amount, // depends if there can still be a quantity assigned to a material
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

export async function POST(discardedList, user_id, metricList) {

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
  
      const json = {
        materials: mergedlist
      };
  
      console.log('material list: ', mergedlist)
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // old code that returns only materials
    if (error) {
      console.log(error)
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}