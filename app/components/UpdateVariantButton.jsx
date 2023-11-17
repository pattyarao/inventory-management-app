'use client'
import supabase from "../supabase";

const UpdateVariantButton = ({variant}) => {
    console.log(variant)
    const updateMaterial = async (variant_id, status) => {
        const { error } = await supabase
          .from("MD_MATVARIATION")
          .update({ status: status })
          .eq("id", variant_id);
        console.log("status")
    
        if (error) {
          console.log("oops something went wrong!");
          throw Error("There is an error.");
        }
        
      };
  return (
    <>
    {variant.status === true ? (
                        <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
                          Deactivate
                        </button>
                      ) : (
                        <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
                          Activate
                        </button>
                      )}
    </>
  )
}

export default UpdateVariantButton