import { Request, Response } from "express";
import { LineItem } from "../interface";
import { client} from '../utils/cache'
import { Mailer } from "../helpers/sendEmail";
import { extractItemsWithoutSize } from "../helpers/skuChecker"

/**
 * 
 * @param request 
 * @param response 
 */
export const orderController = async (request:Request,response:Response) => {
    try{

        const mailer = Mailer()
        const orderItem = request.body;

        const {line_items,email,shipping_address,order_number} = orderItem

        const sizingKitItems = extractItemsWithoutSize(line_items)
        if(!sizingKitItems.length) return response.status(200).json({ok:true})
        orderItem.line_items = sizingKitItems
        
        // store user order Id as key and JSON containing 
        await client.set(`${order_number}`,JSON.stringify(orderItem))

        // send email to client so they can update ringsize to client
        const emailPayload = {email,name:shipping_address.first_name,orderId:order_number}

        mailer.sendEmail(emailPayload)
        response.status(200).json();

    }catch(error){
        response.status(500).json({message:"Internal Server Error"})
    }
}

