import axios from "@/services/AxiosService";
 
export async function getCityList(): Promise<any> {
    const response = await axios.get('/city');
    return response;
}