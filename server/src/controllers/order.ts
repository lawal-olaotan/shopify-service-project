import { Request, Response } from "express";
import { client} from '../utils/store'
import { UseShopify} from '../utils/shopify'
import dotenv from "dotenv"
dotenv.config();
import CryptoUtil from "../utils/crypto";


/**
 * @param request 
 * @param response 
 */
export const getOrderItem = async (request:Request,response:Response) => {
    try{
        const {orderId} = request.query;
        const shopify = UseShopify();
        const orderItem = await checkOrderItem(orderId as string)
        if(!orderItem) return response.status(400).json({ok:false})
        
        const { line_items } = orderItem as any
        const {product_id,variant_title,title}= line_items[0]

        // // get product item 
        const productPayload = await shopify.getProduct(product_id)
        const { image, options } = productPayload.product

        //TODO: change this 
        const size = options[1].values
        const color = options[0].values

        // // get product variance 
        response.status(200).json({image:image.src,size,color,value:variant_title,title,orderId}); 

    }catch(error){
        console.log(error)
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
        const crypto = CryptoUtil();
        const {size, color, orderId }  = request.body;

        const order_number = crypto.decrypt(orderId as string)
        let orderItem = await client.get(`${order_number}`) as any
        orderItem = JSON.parse(orderItem);

        if(!orderItem) return response.status(400).json({ok:false})

        const { line_items, shipping_address, customer, billing_address} = orderItem

        const {product_id}= line_items[0]
        const productPayload = await shopify.getProduct(product_id)

        const {variants} = productPayload.product; 

        // TODO: change parameter postion
        const variantId = findVariantId(variants,size,color);

        await shopify.createOrder(billing_address,shipping_address,customer.id,variantId)
        .then(async()=> {await client.del(`${order_number}`)})

        return response.status(200).json({ok:true});
    
    }catch(error){
        response.status(500).json({ok:false})
    }
}

export const lookUp = async (request:Request,response:Response) => {
    try{

        const {orderId, orderEmail}  = request.body;
        // TODO: decrypt orderId to lookup for order
        let orderItem = await client.get(orderId) as any 
        if(!orderItem) return response.status(400).json({ok:false})

        const {email} = JSON.parse(orderItem);
        if(email !== orderEmail) return response.status(400).json({ok:false})

        response.status(200).json({ok:true});
    }catch(error){
        console.log(error)
        response.status(500).json({message:"Internal Server Error"})
    }
}

const findVariantId = (variants:any, size:string,color:string) => {
    const choosedLineItem = variants.filter((variant:any) => checkVariant(variant.option2,size) && checkVariant(variant.option1,color)); 
    // TODO: based 
    return choosedLineItem[0].id
}

const checkOrderItem = async(orderId:string) => {
    const crypto = CryptoUtil();
    const order_number = crypto.decrypt(orderId as any)
    let orderItem = await client.get(`${order_number}`) as any
    if(!orderItem.length) return false

    return JSON.parse(orderItem);
        
}

const checkVariant = (variantOption:string, userOption:string) => variantOption === userOption


