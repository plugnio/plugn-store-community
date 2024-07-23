import { ExtraOption } from "./extra_option";

export class Option {
    option_id: number; 
    item_uuid: string; 
    min_qty: any; 
    max_qty: any; 
    is_required: boolean;
    option_name: string;
    option_name_ar: string;
    option_type: number;    
    extraOptions: ExtraOption[];
}