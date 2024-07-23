import { Area } from "./Area";
import { City } from "./city";
import { Country } from "./country";

export class CustomerAddress {
    address_id: number;
    customer_id: number;
    area_id: number;
    city_id : number;
    country_id : number;
    
    unit_type: string;
    
    house_number : number;
    floor  : number;
    apartment: string;
    building : string;
    block : string;
    street : string;
    avenue : string;
    office : string;
    postalcode : string;
    address_1 : string;
    address_2: string;
    
    special_directions: string;
    
    delivery_instructions: string;

    created_at: string;
    updated_at: string;
    area: Area;
    city: City;
    country: Country;
}