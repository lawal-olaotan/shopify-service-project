import { Request, Response } from "express";
// import { client} from '../utils/store'
import { UseShopify} from '../services/shopify.ts'
import dotenv from "dotenv"
dotenv.config();
import CryptoUtil from "../utils/crypto";
import {getCustomerOrderByOrderId, removeCustomerByOrderId} from "../services/store.ts";
import {customerOrderDetails} from "../interface/order.ts";
import {deleteSchedule} from "../services/event.ts";


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
        const size = options[0].values
        const color = options[1].values

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
        const {size, color, orderId }  = request.body;

        let orderItem = await checkOrderItem(orderId as string)

        if(!orderItem) return response.status(400).json({ok:false})

        const { order_number, line_items, shipping_address, customer_id, billing_address, templateSent} = orderItem as customerOrderDetails;

        const {product_id}= line_items[0]
        const productPayload = await shopify.getProduct(product_id);
        const {variants} = productPayload.product; 

        // TODO: change parameter position
        const variantId = findVariantId(variants,color,size);

        await shopify.createOrder(billing_address,shipping_address,customer_id,variantId).then(

            async()=> {
                await removeCustomerByOrderId(Number(orderId));
                if(templateSent === 'confirmation'){
                    const scheduledName = `followup-email-${order_number}`
                    await deleteSchedule(scheduledName);
                }
            })

        return response.status(200).json({ok:true});
    
    }catch(error){
        console.log(error.message);
        response.status(500).json({ok:false})
    }
}

export const lookUp = async (request:Request,response:Response) => {
    try{

        const {orderId, orderEmail}  = request.body;
        const orderDetails = await getCustomerOrderByOrderId(Number(orderId));
        if(!orderDetails) return response.status(400).json({ok:false})

        const {email} = orderDetails
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
     const ORDER_ID_LENGTH = 4;
     let order_number = orderId;
    if(orderId.length >  ORDER_ID_LENGTH){
        const crypto = CryptoUtil();
        order_number = crypto.decrypt(orderId as any) as string;
    }

    let orderItem = await getCustomerOrderByOrderId(Number(order_number));
    if(!orderItem) return false

    return orderItem;

}

const checkVariant = (variantOption:string, userOption:string) => variantOption === userOption


