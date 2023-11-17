"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";

//icons
import { IoIosArrowForward } from "react-icons/io";


const MaterialMasterlist = () => {
  const [masterlist, setMasterlist] = useState([]);
  const [error, setError] = useState(null);
  const [isMasterlistChanged, setChangeMasterlist] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  useEffect(() => {
    async function getMaterialsMasterlist() {
      try {
        const response = await fetch("/api/masterlist", {
          cache: "no-store",
        });
        const { materials, error } = await response.json();
        console.log(materials);

        if (error) {
          setError(error);
        } else {
          setMasterlist(materials);
        }
      } catch (error) {
        setError(error.message);
      }
    }
    getMaterialsMasterlist();
  }, [isMasterlistChanged]);
  return (
    <div className="w-full">
      <Navbar userType={"Stock Controller"} />
      <div className="w-full p-4 flex flex-col gap-4">
        <h1 className="top-0 sticky bg-slate-400 p-4 rounded-md text-2xl font-black">Materials Masterlist</h1>
        <div className="w-full flex gap-4">
          <div className="w-[40%] h-[60vh] bg-slate-200 top-0 sticky flex flex-col gap-2 p-4 rounded-md overflow-y-auto">
            {masterlist &&
              masterlist.map((material) => (
                <div
                  key={material.id}
                  className="bg-slate-300 p-2 flex justify-between items-center"
                  onClick={(e) => setSelectedMaterial(material)}
                >
                  <p>{material.name}</p>
                  <IoIosArrowForward />

                </div>
              ))}
          </div>
          <div className="w-full bg-slate-200 rounded-md">
          {selectedMaterial ? (
              <div className="w-full flex flex-col gap-2 p-2">
                {selectedMaterial.variants.length > 0 ? selectedMaterial.variants.map((variant) => (
                  <div key={variant.id} className="bg-slate-300 flex justify-between p-2 rounded-md">
                    <p>{variant.name}</p>
                    {variant.status === true ? (<button className="w-[100px] bg-slate-100 p-0.5 rounded-md">Deactivate</button>) : <button className="w-[100px] bg-slate-100 p-0.5 rounded-md">Activate</button>}
                  </div>
                )): <p>There are no materials for {selectedMaterial.name}</p>}
              </div>
            ) : (
              <p>Select a material</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaterialMasterlist;

// import { useRouter } from "next/navigation";
// import Navbar from "../components/Navbar";
// import supabase from "../supabase";
// import UpdateVariantButton from "../components/UpdateVariantButton"

// async function getMasterlist() {
//   try {
//     const { data: materials, materialsError } = await supabase
//       .from("MD_RAW_MATERIALS")
//       .select("*");

//     if (materialsError) {
//       return new Response(JSON.stringify({ error }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const { data: variants, variantsError } = await supabase
//       .from("MD_MATVARIATION")
//       .select("*");

//     if (variantsError) {
//       return new Response(JSON.stringify({ error }), {
//         status: 500,
//         headers: { "Content-Type": "application/json" },
//       });
//     }

//     const masterlist = materials.map((material) => {
//       const materialVariants = variants.filter(
//         (variant) => variant.material_id === material.id
//       );
//       return {
//         ...material,
//         variants: materialVariants,
//       };
//     });

//     const json = {
//       materials: masterlist,
//     };

//     return json;
//   } catch (error) {
//     return new Response(JSON.stringify({ error }), {
//       status: 500,
//       headers: { "Content-Type": "application/json" },
//     });
//   }
// }

// const MaterialsMasterlist = async () => {
//   const masterlist = await getMasterlist();
//   console.log(masterlist);

//   return (
//     <div>
//       <Navbar userType={"Stock Controller"} />
//       <div className="w-full min-h-screen p-4 flex flex-col gap-4">
//         <h1 className="w-full top-0 sticky font-black text-3xl bg-slate-300 p-2 rounded-md">Materials Masterlist</h1>
//         <div className="w-[30%] h-[60vh] top-0 sticky bottom-4 p-4 flex flex-col justify-start gap-4 bg-slate-400 rounded-md overflow-y-auto">
//           {masterlist.materials.map((material) => (
//             <div className="w-full p-2 flex flex-col gap-1.5 justify-center items-start bg-slate-300 rounded-md hover:bg-white/70">
//               <p className="w-full text-xl font-bold">{material.name}</p>
//               <div className="w-[60%] flex flex-col gap-2">
//                 {material.variants.length > 0 ? (
//                   material.variants.map((variant) => (
//                     <div className="p-1 flex items-center justify-between bg-white rounded-md drop-shadow-md">
//                       <p>{variant.name}</p>
//                       {variant.status === true ? (
//                         <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
//                           Deactivate
//                         </button>
//                       ) : (
//                         <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
//                           Activate
//                         </button>
//                       )}
//                     </div>
//                   ))
//                 ) : (
//                   <p>There are no variants for this material.</p>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MaterialsMasterlist;
