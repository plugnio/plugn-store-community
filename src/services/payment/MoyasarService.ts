import axios from "@/services/AxiosService";

export async function getMoyasarInitParams(order_uuid: string): Promise<any> {
    const response = await axios.get('/payment/moyasar?order_uuid=' + order_uuid);
    return response.data;
}