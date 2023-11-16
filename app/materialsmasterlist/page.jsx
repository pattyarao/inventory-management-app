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
        <h1 className="w-full font-black text-3xl">Materials Masterlist</h1>
        <div className="w-full flex flex-col items-center justify-center gap-4">
          {masterlist.materials.map((material) => (
            <div className="w-full p-2 flex flex-col gap-1.5 justify-center items-start bg-slate-300 rounded-md">
              <p className="w-[20%] text-xl font-bold">{material.name}</p>
              <div className="w-[60%] flex flex-col gap-2">
              { material.variants.length > 0 ? material.variants.map((variant) => (
                <div className="p-1 flex items-center justify-between bg-white rounded-md drop-shadow-md">
                    <p>{variant.name}</p>
                    {variant.status === true ? <button className="bg-slate-400 p-1 rounded-md bg-gray-200">Deactivate</button> : <button className="bg-slate-400 p-1 rounded-md bg-gray-200">Activate</button>}
                </div>

              )) : <p>There are no variants for this material.</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MaterialsMasterlist;
