import axios, { handleAxiosError } from "@/services/AxiosService";
import store from "@/store";

/**
 * @param params 
 * @returns 
 */
export async function applyBankDiscount(params: any): Promise<any> {
    const response = await axios.get('/order/apply-bank-discount/?restaurant_uuid=' + params.restaurant_uuid + '&phone_number=' + params.phone_number + '&bank_name=' + params.bank_name);
    return response.data;
}

/**
 * load promo code data
 */
export async function loadPromoCodeData(params: any): Promise<any> {
    const response = await axios.get('/order/apply-promo-code?restaurant_uuid=' + params.restaurant_uuid + '&phone_number=' + params.phone_number + '&code=' + params.code);
    return response.data;
}

/**
 * apply voucher
 * @param params 
 * @returns 
 */
export async function applyPromoCodeData(params: any): Promise<any> {
    let url = '/order/apply-promo-code/' + params.order_uuid + '?restaurant_uuid=' + 
        params.restaurant_uuid + '&code=' + params.code;

    if(!store.state.isLogin && store.state.customerInfo && store.state.customerInfo.phone_number) {
        url += '&phone_number=' + store.state.customerInfo.phone_number;
    }
        
    const response = await axios.post(url, {});
    return response.data;
}

/**
 * save cart details
 * @param params 
 * @returns 
 */
export async function placeAnOrder(params: any): Promise<any> {
    const response = await axios.post('/order/' + store.state.store.restaurant_uuid, params);
    return response.data;
}

/**
 * initialize order without payment, to set payment form by order id + showing actual order total in confirm page
 * @param params 
 * @returns 
 */
export async function placeDummyOrder(params: any): Promise<any> {
    const response = await axios.post('/order/init-order/' + store.state.store.restaurant_uuid, params);
    return response.data;
}

/**
 * save order instructions
 * @param order_uuid 
 * @param order_instruction 
 * @returns 
 */
export async function saveInstruction(order_uuid: string, order_instruction: string): Promise<any> {
    const response = await axios.post('/order/instruction/' + order_uuid, {
        order_instruction: order_instruction
    });
    return response.data;
}

/**
 * Get order details
 */
export async function getOrderDetail(order_uuid: string): Promise<any> {
    const url = '/order/order-details/' + order_uuid + '/' + store.state.store.restaurant_uuid +
    '?expand=area,area.city,state,country,voucher,orderStatusInEnglish,orderStatusInArabic,orderItems,orderItems.itemImage,orderItems.orderItemExtraOptions,businessLocation,pickupLocation,payment';
    const response = await axios.get(url);
    return response.data;
}

/**
 * list orders
 * @param page 
 * @returns 
 */
export async function getOrders(page: number): Promise<any> {
    const url = '/order?expand=orderStatusInEnglish,orderStatusInArabic,orderItems,orderItems.itemImage&page='
        + page + '&restaurant_uuid=' + store.state.store.restaurant_uuid;
    const response = await axios.get(url)
    //.catch(err => handleAxiosError(err));
    return response; 
}

/**
 * add item to customer's cart
 */
export async function addItemToTheCart(params: any, order_uuid: string): Promise<any> {
    const response = await axios.post('/order/item/' + order_uuid, params);
    return response.data;
}

/**
 * add extra option to customer's cart
 */
export async function addExtraOptionToTheCart(params: any, order_item_id: string): Promise<any> {
    const response = await axios.post('/order/extra-option/' + order_item_id, params);
    return response.data;
} 

export async function downloadInvoice(order_uuid: string): Promise<any> {
    const response = await axios.get('/order/download-invoice/' + order_uuid);
    return response.data;
} 