import supabase from "../../../supabase";
import { NextResponse } from "next/server";
import fetch from 'node-fetch';

async function getPrediction(inputjson, key) {
  try {
    
    const flaskAPIResponse = await fetch(process.env.ML_API_URL + key, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(inputjson),
    });

    if (!flaskAPIResponse.ok) {
      throw new Error('Failed to fetch data from Flask API');
    }

    const predicted_sales = await flaskAPIResponse.json();
    return predicted_sales;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}




export async function GET(request, {params}) {
    const {id} = params
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

    //MODAL MAPPING DRAFT: get models in the future

    const inputjson = {
      data: order_list,
    };

    // if (id === "cf357686-8ee1-4b42-b0a1-1996c8a14298") {

    //   // const flaskAPIResponse = await fetch('http://127.0.0.1:5000/holtadd', {
    //   //   method: 'POST',
    //   //   headers: {
    //   //     'Content-Type': 'application/json',
    //   //   },
    //   //   body: JSON.stringify(inputjson),
    //   // });
    
    //   // if (!flaskAPIResponse.ok) {
    //   //   throw new Error(flaskAPIResponse);
    //   // }
    
    //   // predicted_sales = await flaskAPIResponse.json();
    //   // console.log('Predicted sales:', predicted_sales);
    //   console.log("hello", process.env.ML_API_URL)
    //   try {
    //     predicted_sales = await getPrediction(inputjson, 'holtadd');
    //     console.log('Predicted sales:', predicted_sales);
    //     // Handle the predicted sales data here
    //   } catch (error) {
    //     console.error('Error calling Flask API:', error);
    //   }

    //   // predicted_sales = getPrediction(inputjson, 'holtadd')
        
    //   // predicted_sales = additiveDoubleExpSmoothing(order_list);
    // } else if (id === "7532bc26-b259-43d6-b967-3ac12da76c4e") {
    //   predicted_sales = multiplicativeDoubleExpSmoothing(order_list);
    // } else if (id === "87b7eca6-73e0-46c4-a5b4-27901bc9dd9c") {
    //   predicted_sales = additiveTripleExponentialSmoothing(order_list);
    // } else if (id === "dd5852ac-8e7e-4e46-b24b-633461f276e1") {
    //   predicted_sales = multiplicativeTripleExponentialSmoothing(order_list);
    // } else if (id === "7d41c496-f85e-499c-82f5-82b31835c8e2") {
    //   predicted_sales = movingAverage(order_list);
    // } else if (id === "9533d69e-e579-4aa3-8c27-428cc6f8fff6") {
    //   predicted_sales = simpleExpSmoothing(order_list);
    // }

    try {
      predicted_sales = await getPrediction(inputjson, id);
      console.log('Predicted sales:', predicted_sales);
      // Handle the predicted sales data here
    } catch (error) {
      console.error('Error calling Flask API:', error);
    }


    // predicted_sales = movingAverage(order_list)

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

    console.log("FORECASTED: ", forecastedRestock)

    //GET THE DIFFERENCE BETWEEN forecastedRestock and currentStock, then update the values in suggestedRestock
    // console.log("forecasted Restock", forecastedRestock)
    // console.log("Current Stock", currentStock)
    // console.log("Suggested Restock", suggestedRestock)

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
    
    return NextResponse.json(json, {status:200});
  }
  

  

//   PREDICTION PSEUDO CODE
// - Select an Algorithm 
// - GET current material stock levels set it as an object called "currentStock" DONE
// - Copy "currentStock" and store it to "suggestedRestock" DONE
// - GET all IDs of products on MD_PRODUCTS (product_list = MD
// - Check if each product has sufficient data to do the predictions
// 	product_data = GET product transactions from TD_ORDERITEMS WHERE product_id = product
// 	IF product_data.length >= row requirement: P1,P2
// 	ELSE: Set product element in the "suggestedRestock" object as "NA" 

// - P1 (PROCESS 1): 
// 	- input product_data to model
// 	- train the model based on product data 
// 	- get forecasted product sales 
// 	- return predicted_sales
// 	- PROCEED TO P2 
// - P2 (PROCESS 2):
// 	- GET formula of product FROM ML_PRODUCT_FORMULA store it in "temp_formula"
// 	- for each material in temp_formula: material = material * predicted_sales
// 	- for each material in temp_formula, add it to each of the material in "suggestedRestock"

// - FINALLY
// 	- comparedStock = suggestedRestock - currentStock
// 	- return comparedStock



// PREDICTION PIPELINE 
// 1. Check if each product suffices 
// 	IF ATLEAST ONE product satisfies, THEN PROCEED
// 	OTHERWISE, END PROCESS 
// 2. Input the data into the machine learning API 
// 3. Train the data 
// 4. Make a prediction for the next day of sales 
// 5. Send predictions