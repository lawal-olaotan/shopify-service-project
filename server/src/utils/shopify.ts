
import {createAdminRestApiClient} from '@shopify/admin-api-client';
import dotenv from "dotenv"
dotenv.config();


export const UseShopify = () => {


    const shopify = createAdminRestApiClient({
            storeDomain:process.env.SHOPIFY_NAME as string,
            apiVersion: '2024-01',
            accessToken: process.env.SHOPIFY_TOKEN as string,
    })
    

    const getProduct = async (productId:number)  => {
        try{
            const productPayload = await shopify.get(`products/${productId}`)
            if(productPayload.ok) return await productPayload.json()
        }catch(error){
            console.log(error)
            throw new Error()
        }
    }

    const createOrder= async (billing_address:any,shipping_address:any,customerId:number,variantId:number) => {
        try{
            let order = {
                line_items:[{
                    variant_id:variantId,
                    quantity: 1,
                }],
                customer: {id: customerId},
                billing_address,
                shipping_address,
                financial_status:'paid',
                fulfillment_status:'unfulfilled',
                send_receipt: false,
                send_fulfillment_receipt: false,
                discount_codes:
                [
                    {
                        code: process.env.DISCOUNT_CODE_SHIPPING,
                        amount:100,
                        type:'percentage',

                    },
                    {
                        code: process.env.DISCOUNT_CODE_RING,
                        amount:100,
                        type:'percentage',
                    }
                ],
            }
            const orderResponse = await shopify.post('orders',{data:{order: order}})
            if(orderResponse.ok) return await orderResponse.json()
        }catch(error){
            console.log(error)
            throw new Error()
        }
    }

    return {
        getProduct,
        createOrder
    }
        

    

}