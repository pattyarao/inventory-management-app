import supabase from "../../supabase";

export async function GET() {
  const { data: materials, error } = await supabase
  .from("MD_RAW_MATERIALS")
  .select("id, qty_available, name, REF_METRIC(id, metric_unit)")
  .eq("status", "TRUE")  

  const { data: variants, error2 } = await supabase
  .from("MD_MATVARIATION")
  .select("*")
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

  // const json = {
  //   materials: materials,
  // };

  // old code that returns only the materials 
  // return new Response(JSON.stringify(json), {
  //   status: 200,
  //   headers: { "Content-Type": "application/json" },
  // });
}

// POST function
export async function POST(variantPurchases, directPurchases, user_id) {
  try {
    // First, create a record in TD_PURCHASES
    const { data: purchaseData, error: purchaseError } = await supabase
      .from("TD_PURCHASES")
      .upsert([{ user_id: user_id }])
      .select()

    if (purchaseError) {
      return { error: purchaseError };
    }

    // Ensure that purchaseData is not null before proceeding
    if (!purchaseData || purchaseData.length === 0) {
      return { error: "Failed to insert the purchase record." };
    }

    // Get the ID of the newly inserted purchase
    const purchaseId = purchaseData[0].id;

    // Next, perform queries for variant purchases
    try {
      const variantUpsertData = variantPurchases.map((purchase) => ({
        purchase_id: purchaseId,
        material_id: purchase.material_id,
        variation_id: purchase.variation_id,
        qty_purchased: purchase.qty_purchased,
      }));

      const { data: variantData, error: variantError } = await supabase
        .from("TD_PURCHASEITEMSVAR") // Check the table name
        .upsert(variantUpsertData);

      if (variantError) {
        return { error: variantError };
      }
    } catch (error) {
      return { error: error.message };
    }

    // Perform queries for direct purchases
    try {
      const directPurchaseUpsertData = directPurchases.map((directPurchase) => ({
        purchase_id: purchaseId,
        material_id: directPurchase.material_id,
        qty_purchased: directPurchase.qty_purchased,
        amt: directPurchase.amt,
      }));

      const { data: directPurchaseData, error: directPurchaseError } = await supabase
        .from("TD_PURCHASEITEMS") // Check the table name
        .upsert(directPurchaseUpsertData);

      if (directPurchaseError) {
        return { error: directPurchaseError };
      }
    } catch (error) {
      return { error: error.message };
    }

    // You can continue with more queries or return a success status as needed.
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}

export async function PATCH(purchases) {
  try {
    // Create an array of objects for updating multiple rows
    const updates = purchases.map((purchase) => ({
      id: purchase.id,
      qty_available: purchase.qty_available,
    }));

    // Use .upsert() to update multiple rows
    const { error } = await supabase
      .from('MD_RAW_MATERIALS')
      .upsert(updates)

    if (error) {
      return { error };
    }

    // If there's no error, the updates were successful
    return { success: true };
  } catch (error) {
    return { error: error.message };
  }
}