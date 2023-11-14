import supabase from "../../supabase";
import { CONVERTMETRIC } from "../helper/route"; 


// split list into materials and variants
// normalize unit into g or mL
// for materials, clean data and post to db
// for variants, process into material data and post to db

function updateMaterials(materialList) {

    // update material quantity in the masterlist
    materialList.forEach(async (material) => {
        const { error } = await supabase
            .from("MD_RAW_MATERIALS")
            .update({
                qty_available: material.qty_available - material.amount,
            })
            .eq("id", material.id);

        // console.log("update material data: ", material)
    })
}

export async function POST(discardedList, user_id, metricList) {

    try {

        // filter discard list
        const materials = discardedList.filter((discarded) => !discarded.material_id);
        const variants = discardedList.filter((discarded) => discarded.material_id);
        const timestamp = new Date().toISOString();

        console.log("POST TEST: ", materials, variants, timestamp, user_id);

        // format material
        const materialsData = materials.map((material) => ({
            created_at: timestamp,
            material_id: material.id,
            expired_qty: material.amount, // TODO: not yet normalized into one unit
            user_id: user_id,
            reason_id: material.reason,
        }));
    
        console.log("material post data", materialsData)

        // post material audit trail
        try {
            const { discardData, discardError } = await supabase
                .from("TD_DISCARD")
                .upsert(materialsData)
                .select()

            // update material quantity in the masterlist
            if (!discardError) {
                updateMaterials(materials)
            }
        } catch (error) {
            console.log(error);
            return { error: error.message };
        }

        
    } catch (error) {
        console.log(error);
    }

    

    // format variantExpired
    // const variantExpiredUpsertData = variantExpired.map((variantExpired) => ({
    //     user_id: user_id,
    //     var_id: variantExpired.variation_id,
    //     qty: variantExpired.qty_expired,
    //     reason_id: variantExpired.reason_id,
    // }));

    // post expired
    

    // post variantExpired
    // try {
    //     const { data: variantDiscardData, error: variantDiscardError } = await supabase
    //         .from("TD_DISCARDVAR")
    //         .upsert(variantExpiredUpsertData)
    //         .select();
    // } catch (error) {
    //     console.log(error);
    //     return { error: error.message };
    // }
}

