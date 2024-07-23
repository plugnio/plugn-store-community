import axios from "@/services/AxiosService";

export async function getStripeInitParams(order_uuid: string): Promise<any> {
    const response = await axios.get('/payment/stripe/client-secret?order_uuid=' + order_uuid);
    return response.data;
}
