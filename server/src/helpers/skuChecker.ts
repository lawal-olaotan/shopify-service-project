import { LineItem } from "../interface/order.ts";
import dotenv from "dotenv"
dotenv.config();

/**
* 
*/

export const extractItemsWithoutSize = (line_items:LineItem[])=> {

  
   let sizingKitOrderItems: Array<LineItem> = [];

  line_items.filter((item:LineItem) => {
       const orderTitle = item.variant_title?.includes("DONT KNOW")
       if(orderTitle) sizingKitOrderItems.push(item)
   })

   return sizingKitOrderItems
}