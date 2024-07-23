import axios from "@/services/AxiosService";

export async function getVouchers(): Promise<any> {
    const response = await axios.get('/vouchers');
    return response.data;
}

