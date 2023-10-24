import supabase from "../../supabase";

{/*export async function GET() {
  const { data: products, error } = await supabase
    .from("MD_PRODUCTS")
    .select("id, name, created_at, status");

  console.log("Products fetched:", products);

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
}*/}

{/*export async function GET() {
    const { data: products, error } = await supabase
      .from("MD_PRODUCTS")
      .select("id, name, created_at, status");
  
    if (error) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  
    // Fetch materials for each product
    const productsWithMaterials = await Promise.all(
      products.map(async (product) => {
        const { data: materials, error: materialsError } = await supabase
          .from("ML_PRODUCT_FORMULA")
          .select("material_id, qty_needed, status")
          .eq("product_id", product.id);
  
        if (materialsError) {
          return product; // If there's an error, return the product without materials
        }
  
        return { ...product, materials }; // Include materials in the product object
      })
    );
  
    const json = {
      products: productsWithMaterials,
    };
  
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }*/}

  export async function GET() {
    const { data: products, error } = await supabase
      .from("MD_PRODUCTS")
      .select("id, name, created_at, status");
  
    if (error) {
      // Handle error
    }
  
    // Fetch materials for each product using appropriate joins
    const productData = await Promise.all(
      products.map(async (product) => {
        const { data: materials, error: materialsError } = await supabase
          .from("ML_PRODUCT_FORMULA")
          .select("material_id, qty_needed")
          .eq("product_id", product.id); // Fetch materials for the product
  
        if (materialsError) {
          // Handle error
          console.error("Error fetching materials:", materialsError);
        }

        console.log("Materials for product", product.id, ":", materials);
  
        // Fetch material details and metric units
        const materialsWithDetails = await Promise.all(
          materials.map(async (material) => {
            const { data: materialDetails, error: materialDetailsError } = await supabase
              .from("MD_RAW_MATERIALS")
              .select("id, name, metric_id")
              .eq("id", material.material_id);
  
            if (materialDetailsError) {
              // Handle error
              console.error("Error fetching material details:", materialDetailsError);
            }

            console.log("Material details for material", material.material_id, ":", materialDetails);
  
            const { data: metricDetails, error: metricDetailsError } = await supabase
              .from("REF_METRIC")
              .select("metric_unit")
              .eq("id", materialDetails[0].metric_id); // Assuming metric_id exists in MD_RAW_MATERIALS
  
            if (metricDetailsError) {
              // Handle error
              console.error("Error fetching metric unit:", metricDetailsError);
            }

            console.log("Metric unit for material", material.material_id, ":", metricDetails);
  
            return {
              ...material,
              materialName: materialDetails[0].name,
              metricUnit: metricDetails[0].metric_unit,
            };
          })
        );
  
        return {
          ...product,
          materials: materialsWithDetails,
        };
      })
    );
  
    const json = {
      products: productData,
    };
  
    return new Response(JSON.stringify(json), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
