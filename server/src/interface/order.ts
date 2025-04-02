export interface LineItem {
    id: number;
    admin_graphql_api_id: string;
    attributed_staffs: {
      id: string;
      quantity: number;
    }[];
    current_quantity: number;
    fulfillable_quantity: number;
    fulfillment_service: string;
    fulfillment_status: string | null; // Assuming fulfillment_status can be null
    gift_card: boolean;
    grams: number;
    name: string;
    price: string;
    price_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
    product_exists: boolean;
    product_id: number;
    properties: any[]; // Assuming properties can be any type of array
    quantity: number;
    requires_shipping: boolean;
    sku: string;
    taxable: boolean;
    title: string;
    total_discount: string;
    total_discount_set: {
      shop_money: {
        amount: string;
        currency_code: string;
      };
      presentment_money: {
        amount: string;
        currency_code: string;
      };
    };
    variant_id: number;
    variant_inventory_management: string;
    variant_title: string | null; // Assuming variant_title can be null
    vendor: string | null; // Assuming vendor can be null
    tax_lines: any[]; // Assuming tax_lines can be any type of array
    duties: any[]; // Assuming duties can be any type of array
    discount_allocations: any[]; // Assuming discount_allocations can be any type of array
}

export interface customerOrderDetails {
    order_number: number;
    email: string;
    shipping_address: Address;
    billing_address:Address;
    line_items: LineItem[];
    customer_id:number
    customer_name:string
    templateSent:string
}


export interface Address {
    first_name:string,
    address1: string,
    phone: string,
    city: string,
    zip: string,
    province: string;
    country: string;
    last_name: string,
    address2?: string|null ,
    company: string|null,
    latitude: null | string,
    longitude: null | string,
    "name": string,
    "country_code": string,
    "province_code": string
}

export interface MailItem{
    email:string
    name:string
    orderId:number | string
    title:string
    template:string
}