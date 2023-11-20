import supabase from "../../supabase";

function simpleExpSmoothing(order_list) {
  let predictions = {};
  let alpha = 0.1
  const DATA_LIMIT = 3

  // Loop through each product's sales data
  for (let productId in order_list) {
    let sales = order_list[productId];
    let salesValues = sales.map(entry => entry.qty_ordered);
    let smoothedValues = [salesValues[0]]; // Initialize with first value

    if(salesValues.length > DATA_LIMIT){
    // Apply exponential smoothing
    for (let i = 1; i < salesValues.length; i++) {
      let smoothedValue = alpha * salesValues[i] + (1 - alpha) * smoothedValues[i - 1];
      smoothedValues.push(smoothedValue);
    }

    // Predict future sales
    let lastSmoothedValue = smoothedValues[smoothedValues.length - 1];

    lastSmoothedValue = alpha * lastSmoothedValue + (1 - alpha) * smoothedValues[smoothedValues.length - 1];
    
    predictions[productId] = Math.round(lastSmoothedValue);
    }
  }

  return predictions;
}


export async function GET() {

    const { data: materials, error } = await supabase
      .from("MD_RAW_MATERIALS")
      .select("id, qty_available");
  
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const currentStock = materials.reduce((result, item) => {
        result[item.id] = item.qty_available;
        return result;
    }, {});
    

    const suggestedRestock = { ...currentStock }; // Making a shallow copy of currentStock

    // Iterate through the keys of suggestedRestock and set their values to 0
    Object.keys(suggestedRestock).forEach(key => {
        suggestedRestock[key] = 'N/A';
    });


    // GET PRODUCTS 
    const { data: products, error: product_error } = await supabase
    .from("MD_PRODUCTS")
    .select("id, name, created_at, status");


    if (product_error) {
        return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }

    const product_list = products.map(item => item.id);


    // GET all orders of all products
    const { data: orders, error: error1 } = await supabase
    .from("DETAILED_ORDERS")
    .select("*");

    if (error1) {
        return new Response(JSON.stringify({ error1 }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
        });
    }

    // Organize products into an object
    const order_list = {};

    orders.forEach(order => {
    const { date, product, qty_ordered } = order;

    if (!order_list[product]) {
        order_list[product] = [];
    }

    order_list[product].push({ date, qty_ordered });
    });

    
    // Impelement Sales Prediction Algorithm (P1 PROCESS)
    let predicted_sales = {};
    predicted_sales = simpleExpSmoothing(order_list)

    const predicted_products = Object.keys(predicted_sales);

    // Calculate Needed Materials (P2 PROCESS)
    const { data: ingredients, error: error2 } = await supabase
    .from("ML_PRODUCT_FORMULA")
    .select("product_id, material_id, qty_needed")
    .eq("status", "TRUE")
    .in('product_id', predicted_products)

    if (error2) {
      return new Response(JSON.stringify({ error2 }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    console.log(ingredients)

    const productFormula = ingredients.reduce((result, item) => {
      if (!result[item.product_id]) {
        result[item.product_id] = [];
      }

      result[item.product_id].push({ [item.material_id]: item.qty_needed});
      return result;
    }, {});
    

    //APPLY the predicted sales to the materials needed for each product 
    // Loop through each product_id in predicted_sales
    for (const productId in predicted_sales) {
      if (productFormula[productId]) { // Check if the productId exists in data
        const multiplier = predicted_sales[productId]; // Get the multiplier from predicted_sales

        // Loop through each object in the array for the productId in data
        productFormula[productId].forEach((obj) => {
          for (const materialId in obj) {
            obj[materialId] *= multiplier; // Multiply each value by the multiplier
          }
        });
      }
    }


    const forecastedRestock = {};

    // Loop through each product ID in the data object
    for (const productId in productFormula) {
      // Loop through each object in the array for the current product ID
      productFormula[productId].forEach((obj) => {
        for (const materialId in obj) {
          if (!forecastedRestock[materialId]) {
            forecastedRestock[materialId] = 0;
          }
          forecastedRestock[materialId] += obj[materialId]; // Sum quantities for each material ID
        }
      });
    }



    //GET THE DIFFERENCE BETWEEN forecastedRestock and currentStock, then update the values in suggestedRestock
    console.log("forecasted Restock", forecastedRestock)
    console.log("Current Stock", currentStock)
    console.log("Suggested Restock", suggestedRestock)

    for (const productId in suggestedRestock){
        if (forecastedRestock[productId]){
            if(currentStock[productId] >= forecastedRestock[productId]){
              suggestedRestock[productId] = "Stock is Sufficient"
            }
            else{
              suggestedRestock[productId] = forecastedRestock[productId] - currentStock[productId]
            }
        }
    }


    const json = {
      data: suggestedRestock,
    };
  
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  