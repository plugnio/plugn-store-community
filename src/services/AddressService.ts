import axios, { handleAxiosError } from "@/services/AxiosService";


export async function getAddresses(page: number) {
    const response = await axios.get('/addresses?page=' + page + '&expand=area,city,state,country');
    //.catch((err: any) => handleAxiosError(err));
    return response;
}

export async function getAddress(address_id: number) {
    const response = await axios.get('/addresses/' + address_id + '?expand=area,city,state,country');
    return response.data;
}

export async function addAddress(params) {
    const response = await axios.post('/addresses', params);
    return response.data;
}

export async function updateAddress(address_id: string, params) {
    const response = await axios.patch('/addresses/' + address_id, params);
    return response.data;
}

export async function deleteAddress(address_id: string) {
    const response = await axios.delete('/addresses/' + address_id);
    return response.data;
}