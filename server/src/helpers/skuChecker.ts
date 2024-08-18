import { LineItem } from "../interface";
import dotenv from "dotenv"
dotenv.config();

/**
* 
*/

export const extractItemsWithoutSize = (line_items:LineItem[])=> {

   const ringSizingSku = process.env.RINGSIZESKU // admin should be to change this string in future through an admin interface
   let sizingKitOrderItems: Array<LineItem> = [];

  line_items.filter((item:LineItem) => {
       const sku = item.sku as string
       if(sku.split('-').reverse()[0] === ringSizingSku) sizingKitOrderItems.push(item)
   })

   return sizingKitOrderItems
}