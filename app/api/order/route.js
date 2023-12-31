import supabase from "../../supabase";
import { NextResponse } from "next/server";

export async function GET() {
    const { data: products, error } = await supabase
    .from("MD_PRODUCTS")
    .select("*")
    .eq("status", "TRUE")
    .order("name", { ascending: true }); 

  if (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const json = {
    products: products,
  };

  return new Response(JSON.stringify(json), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

// POST function
export async function POST(orders, user_id) {
  try {
    // First, create a record in TD_PURCHASES
    const { data: orderData, error: orderError } = await supabase
      .from("TD_ORDER")
      .upsert([{ user_id: user_id }])
      .select()

    if (orderError) {
      return NextResponse.json( { error: orderError }, {status: 500});
    }

    // Ensure that purchaseData is not null before proceeding
    if (!orderData || orderData.length === 0) {
      return NextResponse.json( { error: "Failed to insert the order record." }, {status: 500});
    }

    // Get the ID of the newly inserted purchase
    const orderId = orderData[0].id;

    // Next, perform queries for variant purchases
    try {
      const ordersData = orders.map((order) => ({
        order_id: orderId,
        product: order.product_id,
        qty_ordered: order.qty_ordered,
      }));

      const { data: orderItemData, error: orderItemError } = await supabase
        .from("TD_ORDERITEMS") // Check the table name
        .upsert(ordersData);

      if (orderItemError) {
        return NextResponse.json( {error: orderItemError }, {status: 500});
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
