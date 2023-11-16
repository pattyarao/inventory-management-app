import supabase from "../../supabase";

function checkDiscrepancy(discrepancyList) {
    const availableAmountList = []
    const discrepancyData = []
    // fetch the list of available amount for each material passed
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
            
        }
    })

    return discrepancyData
}
    


async function createPostData(manualcountList, user_id) {
    const discrepancyList = []
    const timestamp = new Date().toISOString()
    const macountData = {
        created_at: timestamp,
        user_id: user_id
    }
    manualcountList.map((material) => {

        // get sum of material amount for every variant
        // store to array
        var materialtotalamount = 0
        material.variants.map((variant) => {
            materialtotalamount += variant.amount * variant.quantity
        })

        discrepancyList.push({id: material.id, totalamount: materialtotalamount})
    })

    const discrepancyData = checkDiscrepancy(discrepancyList)

    
    return { macountData, discrepancyData }
}

export async function GET() {
    // returns all materials and the recorded variants

    const { data, error } = await supabase
        .from('MD_RAW_MATERIALS')
        .select("*, variations:MD_MATVARIATION(*)")
        .eq('status', true)
        .eq('variations.status', true)

    if (error){
        console.log(error)
    }
    else {
        const json = {
            materials: data
        };
    
        console.log('manual count material list: ', data)
        return new Response(JSON.stringify(json), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    }
}

export async function POST(manualcountList, user_id) {

    const { macountData, discrepancyData } = createPostData(manualcountList, user_id)
}