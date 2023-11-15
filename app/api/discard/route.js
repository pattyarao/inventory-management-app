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
                console.error('Supabase operation 1 error:', error1.message);
            } else {
                console.log('Supabase operation 1 result:', result1);
            }
        }

        if (variantsAuditTrailData.length > 0) {
            const { data: result2, error: error2 } = await supabase
            .from("TD_DISCARDVAR")
            .insert(variantsAuditTrailData)

            if (error2) {
                console.error('Supabase operation 2 error:', error2.message);
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

    // try {

    //     // filter discard list

    //     const materials = discardedList.filter((discarded) => !discarded.material_id);
    //     const variants = discardedList.filter((discarded) => discarded.material_id);
    //     const timestamp = new Date().toISOString();

    //     console.log("POST TEST: ", materials, variants, timestamp, user_id);

    //     if (materials.length > 0) {
    //         // format material
    //         const materialsData = materials.map((material) => ({
    //             created_at: timestamp,
    //             material_id: material.id,
    //             expired_qty: material.amount, // TODO: not yet normalized into one unit
    //             user_id: user_id,
    //             reason_id: material.reason,
    //         }));

    //         console.log("material post data", materialsData)

    //         // post material audit trail
    //         try {
    //             const { discardData, discardError } = await supabase
    //                 .from("TD_DISCARD")
    //                 .upsert(materialsData)
    //                 .select()

    //             // update material quantity in the masterlist
    //             if (!discardError) {
    //                 updateMaterials(materials)
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             return { error: error.message };
    //         }
    //     }

    //     if (variants.length > 0) {
    //         // format variant
    //         const variantsData = variants.map((variant) => ({
    //             created_at: timestamp,
    //             var_id: variant.id,
    //             qty: variant.quantity,
    //             user_id: user_id,
    //             reason_id: variant.reason,
    //         }));
    
            
    //         console.log("variants post data", variantsData)

    //         // post variant audit trail
    //         try {
    //             const { variantDiscardData, variantError } = await supabase
    //                 .from("TD_DISCARDVAR")
    //                 .upsert(variantsData)
    //                 .select()
                
    //             // update material quantity in the masterlist
    //             console.log(variantDiscardData, variantError)
    //             if (!variantError) {
    //                 // updateMaterialfromVariants(variants)
    //                 console.log(variantDiscardData)
    //             }
    //         } catch (error) {
    //             console.log(error);
    //             return { error: error.message };
    //         }
    //     }
        
        
    // } catch (error) {
    //     console.log(error);
    // }
}

