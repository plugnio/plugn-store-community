import { PaymentMethod } from "./payment_method";

export class RestaurantPaymentMethod {
    restaurant_uuid: string;
    payment_method_id: number;
    paymentMethod: PaymentMethod;
}