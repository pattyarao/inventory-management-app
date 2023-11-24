"use client"

const MaterialVariantsList = ({materialVariants}) => {
    return ( 
        <div>
            {materialVariants.length > 0 ? (materialVariants.map((variant) => (
                <div>
                    <p>{variant.name}</p>
                    {variant.status === true ? (
                        <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
                          Deactivate
                        </button>
                      ) : (
                        <button className="bg-slate-400 p-1 rounded-md bg-gray-200" onClick={() => updateMaterial(variant.id, !variant.status)}>
                          Activate
                        </button>
                      )}
                </div>
            ))) : <p>There are no variants for this material.</p>}
        </div>
     );
}
 
export default MaterialVariantsList;