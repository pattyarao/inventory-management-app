import supabase from "../../supabase";

function checkDiscrepancy(discrepancyList, availableAmountList, macount_id) {
    const discrepancyData = []


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

    console.log('discrepancyData: ', discrepancyData)

    return discrepancyData
}
    


function createDiscrepancyList(manualcountList) {
    const discrepancyList = []
    const availableList = []
    manualcountList.map((material) => {

        // get sum of material amount for every variant
        // store to array
        var materialtotalamount = 0
        material.variants.map((variant) => {
            console.log('variant amount: ', variant.amt, variant.quantity, variant.amount)
            materialtotalamount += (variant.amt * variant.quantity) + variant.amount
        })

        availableList.push({id: material.id, qty_available: material.qty_available})
        discrepancyList.push({id: material.id, totalamount: materialtotalamount})
    })

    console.log('discrepancyList: ', discrepancyList)
    console.log('availableList: ', availableList)
    
    return { discrepancyList, availableList }
}

function PATCH(discrepancyList) {
    discrepancyList.forEach(async (item) => {
        const { data: response, error } = await supabase
            .from('MD_RAW_MATERIALS')
            .update({ qty_available: item.totalamount })
            .eq('id', item.id)
    })
}

export async function GET() {
    // returns all materials and the recorded variants

    const { data: materials, error } = await supabase
        .from('MD_RAW_MATERIALS')
        .select("*, variants:MD_MATVARIATION(*)")
        .eq('status', true)
        .eq('variants.status', true)
        .order('name', { ascending: true });

    if (error){
        return new Response(JSON.stringify({ error: 'Failed to fetch materials' }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

    // get all unique material id from TD_PURCHASEITEMS
    const { data: purchaseItems, error2 } = await supabase
        .from('distinct_purchaseitems')
        .select('*')

    console.log('purchaseItems: ', purchaseItems)

    const updatedMaterials = materials.map((material) => {
        
        const updatedVariants = material.variants.map((variant) => ({
            ...variant,
            amount: 0,
            quantity: 0,
        }));
    
        // Add a generic variant to the variants array if material id is in purchaseItems
        if (purchaseItems.some((item) => item.material_id === material.id)) {
            updatedVariants.push({
                id: material.id,
                name: material.name,
                amount: 0,
                quantity: 0,
                amt: 0,
            });
        }
    
        return {
            ...material,
            variants: updatedVariants,
        };
    }).filter((material) => material.variants.length > 0); // remove materials with no variants
    

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

    
    // post manual count data
    try {
        const { data: response1, error: error1 } = await supabase
            .from('TD_MACOUNT')
            .insert(macountData)
            .select()

        console.log('supabase return response: ', response1, error1)
        // create discrepancy data
    
        let macount_id = response1[0].id
        console.log('macount_id: ', macount_id)

        const { discrepancyList, availableList }  = createDiscrepancyList(manualcountList)
        const discrepancyPostData = checkDiscrepancy(discrepancyList, availableList, macount_id)

        console.log('discrepancyPostData: ', discrepancyPostData)

        const { data: response2, error: error2 } = await supabase
            .from('TD_DISCREPANCY')
            .insert(discrepancyPostData)
            .select()

        console.log('post completed', response2)

        // patch masterlist with new qty_available
        const patchResponse = PATCH(discrepancyList)
        console.log(patchResponse)

    } catch (error) {
        console.log(error)
        return new Response('post failure', {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }


    return new Response('post success', {
        status: 200,
        headers: { "Content-Type": "application/json" },
    });
}