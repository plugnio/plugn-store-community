import axios from "@/services/AxiosService";
 
export async function getPaymentMethodOptions(): Promise<any> {
    const response = await axios.get('/payment');
    return response.data;
}

