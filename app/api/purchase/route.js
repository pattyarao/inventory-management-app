import supabase from "../../supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data: materials, error } = await supabase
  .from("MD_RAW_MATERIALS")
  .select("id, qty_available, name, REF_METRIC(id, metric_unit)")
  .eq("status", "TRUE") 

if (error) {
  return new Response(JSON.stringify({ error }), {
    status: 500,
    headers: { "Content-Type": "application/json" },
  });
}

const json = {
  materials: materials,
};

return new Response(JSON.stringify(json), {
  status: 200,
  headers: { "Content-Type": "application/json" },
});
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
      return NextResponse.json( { error: purchaseError }, {status: 500});
    }

    // Ensure that purchaseData is not null before proceeding
    if (!purchaseData || purchaseData.length === 0) {
      return NextResponse.json( { error: "Failed to insert the purchase record." }, {status: 500});
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
        return NextResponse.json( {error: variantError }, {status: 500});
      }
    } catch (error) {
      return NextResponse.json({error: error.message}, {status: 500});
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
        return NextResponse.json( {error: directPurchaseError }, {status: 500});
      }
    } catch (error) {
      return NextResponse.json({error: error.message}, {status: 500});
    }

    // You can continue with more queries or return a success status as needed.
    return NextResponse.json({ success: true }, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
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
      return NextResponse.json({error: error.message}, {status: 500});
    }

    // If there's no error, the updates were successful
    return NextResponse.json({ success: true }, {status: 200});
  } catch (error) {
    return NextResponse.json({error: error.message}, {status: 500});
  }
}