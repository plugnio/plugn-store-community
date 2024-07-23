import {Country} from './country';

export class DeliveryZone {
    delivery_zone_id: string;
    store_uuid: string;
    country_id: any;
    business_location_id: any;
    delivery_time: string;
    time_unit: string;
    delivery_fee: number;
    min_charge: number;
    delivery_zone_tax: number;
    country: Country;
}
