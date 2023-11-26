"use client";

import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import withAuthentication from "../auth";
//icons
import { IoIosArrowForward } from "react-icons/io";
import { FiSearch } from "react-icons/fi";
import Loader from "../components/Loader";
import useUpdateVariantStatus from "../../hooks/useUpdateVariantStatus";

const MaterialMasterlist = ({userType, userInfo}) => {
  const { updateVariantStatus } = useUpdateVariantStatus();
  const [masterlist, setMasterlist] = useState([]);
  const [error, setError] = useState(null);
  const [isMasterlistChanged, setChangeMasterlist] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState("");
  const [isChanged, setIsChanged] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleChangeVariantStatus = async (id) => {
    //function
    await updateVariantStatus(id, setSelectedMaterial, selectedMaterial);
    setChangeMasterlist((old) => !old);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredMaterials = masterlist.filter((material) =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  if (!userType) {
    return (
      <Loader/>
    );
  }
  return (
    <div className="w-full">
      <Navbar userType={userType} email={userInfo.email} />
      <div className="w-full p-4 flex flex-col gap-4">
        <div className="w-full top-0 sticky bg-slate-400 p-4 rounded-md flex justify-between">
          <h1 className="text-2xl font-black">
            Materials Masterlist
          </h1>
          <div className="w-[300px] flex items-center justify-between p-1 rounded-md bg-white">
            <input type="text" placeholder="Search Material Variant..." value={searchTerm} onChange={handleSearchChange} className="bg-inherit focus:outline-none"/>
            <FiSearch className="text-slate-400" />
          </div>
        </div>
        <div className="w-full flex gap-4">
          <div className="w-full h-[60vh] bg-slate-200 top-0 sticky flex flex-col gap-2 p-4 rounded-md overflow-y-auto">
            {filteredMaterials &&
              filteredMaterials?.map((material) => (
                <div
                  key={material.id}
                  className="bg-slate-300 p-2 flex flex-col gap-2 justify-between items-start"
                  onClick={(e) => setSelectedMaterial(material)}
                >
                  <p className="font-black text-xl">{material.name}</p>

                  <div className="w-full flex flex-col gap-2">
                    {material.variants.length > 0 ? (
                      material.variants.map((variant) => (
                        <div
                          key={variant.id}
                          className="bg-slate-400 flex justify-between p-2 rounded-md"
                        >
                          <div className="flex flex-col gap-2">
                            <p className="text-white font-bold drop-shadow-md">
                              {variant.name}
                            </p>
                            {variant.status === true ? (
                              <p className="w-fit bg-green-300 p-0.5 text-xs rounded-sm">
                                Status: Active
                              </p>
                            ) : (
                              <p className="w-fit bg-red-300 p-0.5 text-xs rounded-sm">
                                Status: Inactive
                              </p>
                            )}
                          </div>
                          {variant.status === true ? (
                            <button
                              className="w-[100px] bg-slate-100 p-0.5 rounded-md drop-shadow-md"
                              onClick={() =>
                                handleChangeVariantStatus(variant.id)
                              }
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              className="w-[100px] bg-slate-100 p-0.5 rounded-md drop-shadow-md"
                              onClick={() =>
                                handleChangeVariantStatus(variant.id)
                              }
                            >
                              Activate
                            </button>
                          )}
                        </div>
                      ))
                    ) : (
                      <p>There are no variants for {material.name}</p>
                    )}
                  </div>
                </div>
              ))}
          </div>
          {/* <div className="w-full bg-slate-200 rounded-md">
          {selectedMaterial ? (
              <div className="w-full flex flex-col gap-2 p-2">
                {selectedMaterial.variants.length > 0 ? selectedMaterial.variants.map((variant) => (
                  <div key={variant.id} className="bg-slate-300 flex justify-between p-2 rounded-md">
                    <p>{variant.name}</p>
                    {variant.status === true ? (<button className="w-[100px] bg-slate-100 p-0.5 rounded-md" onClick={() => handleChangeVariantStatus(variant.id)}>Deactivate</button>) : <button className="w-[100px] bg-slate-100 p-0.5 rounded-md" onClick={() => handleChangeVariantStatus(variant.id)}>Activate</button>}
                  </div>
                )): <p>There are no materials for {selectedMaterial.name}</p>}
              </div>
            ) : (
              <p>Select a material</p>
            )}
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default withAuthentication(MaterialMasterlist, ['Stock Controller']);

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
