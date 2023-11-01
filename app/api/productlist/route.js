import supabase from "../../supabase";



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

  {/*export async function POST(newProduct) {
      try {
        const productResponse = await supabase
          .from('MD_PRODUCTS')
          .upsert([
            {
              name: newProduct.name,
              status: true,
            },
          ])
          .select();
        if (productResponse.error) {
          return new Response(JSON.stringify({ error: productResponse.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
        if (productResponse.data && productResponse.data.length > 0) {
        const product_id = productResponse.data[0].id;
        const existingMaterials = [];
        const newMaterials = [];
        for (const material of newProduct.materials) {
          const {name, amount, unit} = material;
          const {data : existingMaterialData} = await supabase
            .from('MD_RAW_MATERIALS')
            .select('id')
            .eq('name', name);

          if (existingMaterialData.length > 0) {
            const material_id = existingMaterialData[0].id;
            existingMaterials.push(material_id);
          } else {
            const {data: newMaterialData, error: newMaterialError} = await supabase
              .from('MD_RAW_MATERIALS')
              .upsert([
                {
                  name: name,
                  qty_available: 0,
                  status: true,
                  metric_id: '0df0ab18-3bac-43ff-b556-a723ebdbcdb9',
                },
              ]);

            if (newMaterialError) {
              return {error: 'Error adding new material'};
            }

            if (newMaterialData && newMaterialData.length > 0) {
              const material_id = newMaterialData[0].id;
              newMaterials.push(material_id);
            } else {
              console.error("Error: No material data found for", name);
            }
          }
        }

        const materialList = [...existingMaterials, ...newMaterials];
        const materialData = materialList.map((material_id) => ({
          product_id,
          material_id,
          qty_needed: newProduct.materials[index].amount,
          status:true,
        }));

        const formulaResponse = await supabase
          .from('ML_PRODUCT_FORMULA')
          .upsert(materialData);

        if (formulaResponse.error) {
          return new Response(JSON.stringify({ error: formulaResponse.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }

        return new Response(
          JSON.stringify({ success: "Product and materials added successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(JSON.stringify({ error: "No product data found" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
  }*/}

  export async function POST(newProduct) {
    try {
      const productResponse = await supabase
        .from('MD_PRODUCTS')
        .upsert([
          {
            name: newProduct.name,
            status: true,
          },
        ])
        .select();
      if (productResponse.error) {
        return new Response(JSON.stringify({ error: productResponse.error }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
      if (productResponse.data && productResponse.data.length > 0) {
        const product_id = productResponse.data[0].id;
        const newMaterials = [];
        
        for (const material of newProduct.materials) {
          const { name, amount, unit } = material;
          const { data: existingMaterialData } = await supabase
            .from('MD_RAW_MATERIALS')
            .select('id')
            .eq('name', name);

            let material_id;
  
          if (existingMaterialData.length > 0) {
            material_id = existingMaterialData[0].id; 
          } else {
            const { data: newMaterialData, error: newMaterialError } = await supabase
              .from('MD_RAW_MATERIALS')
              .upsert([
                {
                  name: name,
                  qty_available: 0,
                  status: true,
                  metric_id: '0df0ab18-3bac-43ff-b556-a723ebdbcdb9',
                },
              ])
              .select();
  
            if (newMaterialError) {
              return new Response(JSON.stringify({ error: 'Error adding new material' }), {
                status: 500,
                headers: { "Content-Type": "application/json" },
              });
            }
  
            if (newMaterialData && newMaterialData.length > 0) {
              material_id = newMaterialData[0].id;             
              console.log("Material ID is: ", material_id)
              
            } else {
              console.error("Error: No material data found for", name);
            }
          }
          newMaterials.push({
            product_id,
            material_id,
            qty_needed: amount,
            status: true,
          });
        }

        
  
        const formulaResponse = await supabase
          .from('ML_PRODUCT_FORMULA')
          .upsert(newMaterials);
  
        if (formulaResponse.error) {
          return new Response(JSON.stringify({ error: formulaResponse.error }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
          });
        }
  
        return new Response(
          JSON.stringify({ success: "Product and materials added successfully" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(JSON.stringify({ error: "No product data found" }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
