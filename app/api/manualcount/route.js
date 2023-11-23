import supabase from "../../supabase";

function checkDiscrepancy(discrepancyList, macount_id) {
    const availableAmountList = []
    const discrepancyData = []
    // fetch the list of available amount for each material passed
    // fetch available amount from MD_RAW_MATERIALS

    // sort by id

    // sort discrepancy list by id

    // compare available amount to discrepancy list

    discrepancyList.map( async (material) => {
        const { data, error } = await supabase
            .from('MD_RAW_MATERIALS')
            .select('qty_available')
            .eq('id', material.id)

        if (error) {
            console.log(error)
            return;
        }

        availableAmountList.push(
            {
                id: material.id,
                qty_available: data.quantity_available
            }
        )
    })

    // compare available amount to discrepancy list
    discrepancyList.map((item, index) => {
        if (!(item.totalamount === availableAmountList[index].qty_available)) {
            discrepancyData.push({
                material_id: item.id,
                qty_disc: availableAmountList[index].qty_available - item.totalamount,
                macount_id: macount_id
            })
        }
    })

    return discrepancyData
}
    


async function createPostData(manualcountList, macount_id) {
    const discrepancyList = []
    
    manualcountList.map((material) => {

        // get sum of material amount for every variant
        // store to array
        var materialtotalamount = 0
        material.variants.map((variant) => {
            materialtotalamount += (variant.amt * variant.quantity) + variant.amount
        })

        discrepancyList.push({id: material.id, totalamount: materialtotalamount})
    })

    const discrepancyData = checkDiscrepancy(discrepancyList, macount_id)

    
    return discrepancyData
}

export async function GET() {
    // returns all materials and the recorded variants

    const { data: materials, error } = await supabase
        .from('MD_RAW_MATERIALS')
        .select("*, variants:MD_MATVARIATION(*)")
        .eq('status', true)
        .eq('variants.status', true)

    if (error){
        return new Response(JSON.stringify({ error: 'Failed to fetch materials' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    // insert material as variant to material list
    const updatedMaterials = materials.map((material) => {
        const updatedVariants = material.variants.map((variant) => ({
            ...variant,
            amount: 0,
            quantity: 0,
        }));
    
        // Add a new variant to the updatedVariants array
        updatedVariants.push({
            id: material.id,
            name: material.name,
            amount: 0,
            quantity: 1,
        });
    
        return {
            ...material,
            variants: updatedVariants,
        };
    });
    
    // Now updatedMaterials contains the modified array of materials
    

    const json = {
        materials: updatedMaterials
    };

    console.log('manual count material list: ', updatedMaterials)
    return new Response(JSON.stringify(json), {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}

export async function POST(manualcountList, user_id) {

    console.log('manual count in POST: ', manualcountList)
    console.log('user id in POST: ', user_id)


    // create manual count data
    const macountData = {
        created_at: new Date().toISOString(),
        user_id: user_id
    }

    console.log('macountData: ', macountData)

    
    // // post manual count data
    // const { data, error } = await supabase
    //     .from('TD_MANUALCOUNT')
    //     .insert(macountData)
    //     .select()
    
    // if (error) {
    //     console.log(error)
    //     return;
    // }

    // // create discrepancy data
    // let macount_id = data[0].id
    // const discrepancyData  = createPostData(manualcountList, macount_id)

    return new Response('post success', {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}