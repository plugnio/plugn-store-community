import { ItemCategory } from "./ItemCategory";
import { ItemImage } from "./ItemImage"
import { Option } from "./item_option";
import { ItemVariant } from "./item_variant";

export class Item {
    item_uuid: string;
    restaurant_uuid : string;
    item_name: string;
    item_name_ar: string;
    item_description: string;
    item_description_ar: string;
    sort_number: number;
    item_type: number;
    stock_qty: number;
    prep_time: number;
    prep_time_unit: number;
    item_price: number;
    sku: string;
    barcode: string;
    track_quantity: number;
    itemImages: ItemImage[];
    unit_sold: number;
    item_image: string;
    compare_at_price: number;
    item_status: number;
    item_created_at: string;
    item_updated_at: string;
    itemCategories: ItemCategory[];
    categoryItems: ItemCategory[];
    options: Option[];
    extraOptions: any;
    itemVariants: ItemVariant[];
}
