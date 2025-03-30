import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {DeleteCommand, DynamoDBDocumentClient, QueryCommand} from "@aws-sdk/lib-dynamodb";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { customerOrderDetails } from "../interface/order"
import { awsAuthObject } from "./aws"
import dotenv from "dotenv"
import CryptoUtil from "../utils/crypto.ts";
dotenv.config();

const dbClient = new DynamoDBClient(awsAuthObject);
const dbDocClient = DynamoDBDocumentClient.from(dbClient);
const TableName = process.env.TABLE_NAME

export const saveCustomerOrderInfo = async(orderDetails:customerOrderDetails) => {

    const params = new PutCommand({
        TableName,
        Item: {
            ...orderDetails,
        }
    });
    try{
        await dbDocClient.send(params);
    }catch(error){
        console.log(error);
        throw new Error(error);

    }

}

export const getCustomerOrderByOrderId = async(order_number:number) => {

    const params = new QueryCommand({
        TableName,
        KeyConditionExpression: "order_number = :oid",
        ExpressionAttributeValues: {
            ":oid": order_number,
        },
    });

    try {
        const result = await dbDocClient.send(params);
        const dbItems = result.Items;
        if(!dbItems.length) return false;
        return JSON.parse(dbItems[0].toString());
    } catch (error) {
        console.error("Error querying item:", error);
    }
}

export const removeCustomerByOrderId = async(order_number:number) => {
    const params = new DeleteCommand({
        TableName,
        Key: {
            order_number
        },
    });

    try {
        await dbDocClient.send(params);
        console.log(`✅ Deleted item with sessionId: ${order_number}`);
    } catch (error) {
        console.error("❌ Error deleting item:", error);
    }
}

export const getCustomerDetailsByEncryptionId = async(orderId:string) => {
    const crypto = CryptoUtil();
    const order_number = crypto.decrypt(orderId as any);

    let orderItem = await getCustomerOrderByOrderId(Number(order_number));
    if(!orderItem) return false

 return orderItem;

}

