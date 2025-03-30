import { Request, Response } from "express";
import { extractItemsWithoutSize } from "../helpers/skuChecker"
import {createEmailSchedule} from "../services/event.ts";
import dotenv from "dotenv"



dotenv.config();
/**
 * 
 * @param request 
 * @param response 
 */
export const orderController = async (request:Request,response:Response) => {
    try{

        const orderItem = request.body;
        const {line_items,email,shipping_address,order_number, billing_address, customer} = orderItem

        const sizingKitItems = extractItemsWithoutSize(line_items)

        if(!sizingKitItems.length) return response.status(200).json({ok:true})

        orderItem.line_items = sizingKitItems;

        const customerOrder = {
            order_number,
            email,
            shipping_address,
            billing_address,
            line_items,
            customer_id:customer.id,
            customer_name:customer.first_name
        }
        await createEmailSchedule(customerOrder);
        response.status(200).json({ok:true});

    }catch(error){
        console.log(error)
        response.status(500).json(error)
    }
}

