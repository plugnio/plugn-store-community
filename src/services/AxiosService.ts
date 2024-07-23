import axios from 'axios';
import store from "@/store";
import router from '@/router';

//https://axios-http.com/docs/req_config

/*if(store.state.store && store.state.store.is_sandbox) {
    axios.defaults.baseURL = "https://api.dev.plugn.io/v2";
} else {
    axios.defaults.baseURL = process.env.VUE_APP_ENDPOINT;
}*/

axios.defaults.baseURL = process.env.VUE_APP_ENDPOINT;

axios.defaults.headers.patch['Content-Type'] = 'application/x-www-form-urlencoded'; 
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Add a request interceptor
axios.interceptors.request.use((config) => {  
    if(store.state.user && !config.headers['Authorization'])
        config.headers['Authorization'] = 'Bearer ' + store.state.user.token;

    if(store.state.store)    
        config.headers['Store-Id'] = store.state.store.restaurant_uuid;

    config.headers['Language'] = store.state.language?store.state.language.code: null;
    config.headers['Currency'] = store.state.currency_pref;

    config.headers['Mixpanel-Distinct-ID'] = store.state.mixpanel_distinct_id;

    return config;
});

axios.interceptors.response.use(async (response) => {
    return response;
}, err => handleAxiosError(err));

export async function handleAxiosError(err) {
 
    const response = err.response;//? err.response: err.request;

    const errMsg = response.status ? `${response.status} - ${response.statusText}` : 'Server error';

    // Handle Bad Requests
    // This error usually appears when agent attempts to handle an 
    // account that he's been removed from assigning
    if (response.status === 400) {
        router.push('/404');   
    }

    // Handle No Internet Connection Error

    if (response.status == 0 || response.status == 504) {
        router.push('/no-internet');  
    }
    
    if(!navigator.onLine) {
        router.push('/no-internet');  
    }

    // Handle Expired Session Error
    if (response.status === 401) { 
        store.commit('logout', {
            reason: 'Session expired, please log back in.'
        });
        router.push('/home'); 
    }

    // Handle internal server error - 500  
    if (response.status === 500) {

        router.push('/500');   
    }

    // Handle page not found - 404 error 
    if (response.status === 404) {
        if(store.state.store) {
            router.push('/404');   
        } else {
            router.push('/no-store');   
        }
    }

    /*if (error.status === 418) {
        eventService.error418$.next();
        return empty();
    }

    if (error.status === 419) {
        eventService.error419$.next();
        return empty();
    }

    if (error.status === 420) {
        eventService.error420$.next();
        return empty();
    }

    if (error.status === 427) {
        eventService.error427$.next();
        return empty();
    }*/

    //console.error(JSON.stringify(response));

    return Promise.reject(err);//errMsg

}
export default axios;