import supabase from "../../supabase";

export async function GET() {
  try {
    const { data: materials, materialsError } = await supabase
      .from("MD_RAW_MATERIALS")
      .select("*");

    if (materialsError) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: variants, variantsError } = await supabase
      .from("MD_MATVARIATION")
      .select("*");

    if (variantsError) {
      return new Response(JSON.stringify({ error }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const masterlist = materials.map((material) => {
      const materialVariants = variants.filter(
        (variant) => variant.material_id === material.id
      );
      return {
        ...material,
        variants: materialVariants,
      };
    });

    const json = {
        materials: masterlist, // Use the merged masterlist instead of the raw materials
      };
  
      return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
