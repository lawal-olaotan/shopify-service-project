import { Request, Response } from "express";
import { client} from '../utils/cache'
import { UseShopify} from '../utils/shopify'
import dotenv from "dotenv"
dotenv.config();


/**
 * 
 * @param request 
 * @param response 
 */
export const getOrderItem = async (request:Request,response:Response) => {
    try{
        const shopify = UseShopify()
        const {orderId} = request.query;

        let orderItem = await client.get(`${orderId}`) as any
        orderItem = JSON.parse(orderItem);

        const { line_items} = orderItem
        const {product_id,variant_title,title}= line_items[0]

        // get product item 
        const productPayload = await shopify.getProduct(product_id)
        const { image, options } = productPayload.product

        //TODO: this should be improved in the future
        const size = options[0].values
        const color = options[1].values

        // get product variance 
        response.status(200).json({image:image.src,size,color,value:variant_title,title,orderId}); 

    }catch(error){
        response.status(500).json({message:"Internal Server Error"})
    }
}
/**
 * 
 * @param request 
 * @param response 
 */
export const createOrder = async (request:Request,response:Response) => {
    try{
        const shopify = UseShopify()
        const {size, color, orderId }  = request.body;
        
        let orderItem = await client.get(orderId) as any 
        
        if(!orderItem) return response.status(400).json({ok:false})

            orderItem = JSON.parse(orderItem);
        const { line_items, shipping_address, customer, billing_address} = orderItem

        const {product_id}= line_items[0]
        const productPayload = await shopify.getProduct(product_id)

        const {variants} = productPayload.product
        const variantId = findVariantId(variants,size,color)

        await shopify.createOrder(billing_address,shipping_address,customer.id,variantId)

        // removes item from redis client
        await client.del(orderId)
        response.status(200).json({ok:true});
    
    }catch(error){
        console.log(error)
        response.status(500).json({message:"Internal Server Error"})
    }
}


const findVariantId = (variants:any, size:string,color:string) => {
    const choosedLineItem = variants.filter((variant:any) => checkVariant(variant.option1,size) && checkVariant(variant.option2,color)); 

    // TODO: based 
    return choosedLineItem[0].id
}



const checkVariant = (variantOption:string, userOption:string) => variantOption === userOption


