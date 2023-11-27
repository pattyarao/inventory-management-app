import supabase from "../../supabase";
import { NextResponse } from "next/server";

// POST function
export async function POST(orders, user_id) {
  try {
    // First, create a record in TD_PURCHASES
    const { data: orderData, error: orderError } = await supabase
      .from("TD_REJECTEDORDER")
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
        rejorder_id: orderId,
        material_id: order.id,
        insufficient_qty: order.qty_available,
      }));

      const { data: orderItemData, error: orderItemError } = await supabase
        .from("TD_REJECTEDORDERITEMS") // Check the table name
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


