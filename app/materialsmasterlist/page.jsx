import Navbar from "../components/Navbar";
import supabase from "../supabase";

async function getMasterlist() {
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
      materials: masterlist,
    };

    return json;
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

const MaterialsMasterlist = async () => {
  const masterlist = await getMasterlist();
  console.log(masterlist);
  return (
    <div>
      <Navbar userType={"Stock Controller"} />
      <div className="w-full min-h-screen p-4 flex flex-col items-center gap-4">
        <h1>Materials Masterlist</h1>
        <div className="w-[50%] flex flex-col items-center justify-center gap-4">
          {masterlist.materials.map((material) => (
            <div className="w-[70%] p-2 flex justify-between items-center bg-slate-300">
              <p className="w-[40%]">{material.name}</p>
              <div className="w-[60%] flex flex-col gap-2">
              {material.variants.map((variant) => (
                <div className="flex items-center justify-between">
                    <p>{variant.name}</p>
                    {variant.status === true ? <button className="bg-slate-400 p-1 drop-shadow-sm">Deactivate</button> : <button>Activate</button>}
                </div>

              ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialsMasterlist;
