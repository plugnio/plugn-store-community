import { Item } from "./Item";

export class OrderItem {
    order_item_id: number;
    order_uuid: string;
    restaurant_uuid: string;
    item_uuid: string;
    item_variant_uuid: string;
    item_name: string;
    item_name_ar: string;
    item_price: number;
    qty: number;
    customer_instruction: string;
    order_item_created_at: string;
    order_item_updated_at: string;
    item: Item;
    currency: any;
    itemImage: any;
    extraOptions: any;
    orderItemExtraOptions: any;
}
