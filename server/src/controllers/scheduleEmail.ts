import { Request, Response } from "express";
import { Mailer } from "../helpers/sendEmail";
import dotenv from "dotenv"

import { extractItemsWithoutSize } from "../helpers/skuChecker"
// import { scheduleEmails } from "../utils/bull";
import CryptoUtil from "../utils/crypto";
import {getCustomerDetailsByEncryptionId, getCustomerOrderByOrderId, saveCustomerOrderInfo} from '../services/store'

dotenv.config();
/**
 *
 * @param request
 * @param response
 */
export const scheduleEmail = async (request:Request,response:Response) => {
    try{
        const { order_number, email,name,template} = request.body;
        const resultItems = await getCustomerOrderByOrderId(order_number);

        if(!resultItems) return response.status(200).json({ok:true})

        const title = template === 'confirmation' ? '🌟 Your Synqlux Ring Sizing Kit is on its Way!🌟' : "🌟 Have You Received Your Sizing Kit Yet? Let's Get Your Perfect Fit! 🌟";



        const cryptoUtil = CryptoUtil();
        const orderId = cryptoUtil.encrypt(order_number);
        // schedule email to client so they can update ringsize
        const emailPayload = {email,name,orderId,title,template};

        const mailer = Mailer()
        mailer.sendEmail(emailPayload)

        response.status(200).json({ok:true});

    }catch(error){
        console.log(error)
        response.status(500).json(error)
    }
}

