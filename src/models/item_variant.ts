import { ItemVariantOption } from "./item_variant_option";

export class ItemVariant {
    item_variant_uuid: string;
    item_uuid: string;
    stock_qty: number;
    track_quantity: boolean;
    sku: string;
    barcode: string;
    price: number;
    compare_at_price: number;
    weight: number; 
    created_at: string;
    updated_at: string;
    itemVariantOptions: ItemVariantOption[];
}