import { Request, Response } from "express";
import { client} from '../utils/store'
import { Mailer } from "../helpers/sendEmail";
import dotenv from "dotenv"
dotenv.config();
import { extractItemsWithoutSize } from "../helpers/skuChecker"
import { scheduleEmails } from "../utils/bull";
import CryptoUtil from "../utils/crypto";
/**
 * 
 * @param request 
 * @param response 
 */
export const orderController = async (request:Request,response:Response) => {
    try{

        
        const orderItem = request.body;
        const {line_items,email,shipping_address,order_number} = orderItem

        const sizingKitItems = extractItemsWithoutSize(line_items)
        if(!sizingKitItems.length) return response.status(200).json({ok:true})
        orderItem.line_items = sizingKitItems;
        
        // store user order Id as key and JSON containing 
        await client.set(`${order_number}`,JSON.stringify(orderItem))
        const cryptoUtil = CryptoUtil(); 
        const orderId = cryptoUtil.encrypt(order_number)

        // schedule email to client so they can update ringsize 
        const emailPayload = {email,name:shipping_address.first_name,orderId,title:'🌟 Your Synqlux Ring Sizing Kit is on its Way!🌟',template:'email'};

        await scheduleEmails(emailPayload)
        response.status(200).json({ok:true});

    }catch(error){
        console.log(error)
        response.status(500).json(error)
    }
}

