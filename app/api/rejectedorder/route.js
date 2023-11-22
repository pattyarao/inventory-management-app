import supabase from "../../supabase";

// POST function
export async function POST(orders, user_id) {
  try {
    // First, create a record in TD_PURCHASES
    const { data: orderData, error: orderError } = await supabase
      .from("TD_REJECTEDORDER")
      .upsert([{ user_id: user_id }])
      .select()

    if (orderError) {
      return { error: orderError };
    }

    // Ensure that purchaseData is not null before proceeding
    if (!orderData || orderData.length === 0) {
      return { error: "Failed to insert the order record." };
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
        return { error: orderItemError };
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


