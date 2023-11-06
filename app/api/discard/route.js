import supabase from "../../supabase";

export async function POST(expired, variantExpired, user_id) {

    // format expired
    const expiredUpsertData = expired.map((expired) => ({
        user_id: user_id,
        material_id: expired.material_id,
        expired_qty: expired.qty_expired,
        reason_id: expired.reason_id,
    }));

    // format variantExpired
    const variantExpiredUpsertData = variantExpired.map((variantExpired) => ({
        user_id: user_id,
        var_id: variantExpired.variation_id,
        qty: variantExpired.qty_expired,
        reason_id: variantExpired.reason_id,
    }));

    // post expired
    try {
        const { data: discardData, error: discardError } = await supabase
            .from("TD_DISCARD")
            .upsert(expiredUpsertData)
            .select();
        

    } catch (error) {
        console.log(error);
        return { error: error.message };
    }

    // post variantExpired
    try {
        const { data: variantDiscardData, error: variantDiscardError } = await supabase
            .from("TD_DISCARDVAR")
            .upsert(variantExpiredUpsertData)
            .select();
    } catch (error) {
        console.log(error);
        return { error: error.message };
    }
}
