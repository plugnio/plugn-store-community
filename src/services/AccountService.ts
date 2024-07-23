import axios from "@/services/AxiosService";


export async function getAccount() {
    const response = await axios.get('/account');
    return response.data;
}

export async function updateAccount(params) {
    const response = await axios.patch('/account', params);
    return response.data;
}

export async function deleteAccount() {
    const response = await axios.delete('/account');
    return response.data;
}