import { ExtraOption } from "./extra_option";
import { Option } from "./item_option";

export class ItemVariantOption {
    item_variant_option_uuid: string;
    item_variant_uuid: string;
    item_uuid: string;
    option_id: number;
    extra_option_id: number;
    created_at: string;
    updated_at: string;
    option: Option;
    extraOption: ExtraOption;
}
