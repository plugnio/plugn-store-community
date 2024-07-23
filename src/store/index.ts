import { Preferences } from '@capacitor/preferences';
import { createStore } from 'vuex'
import mutations, { STORAGE_KEY } from './mutations'
import actions from './actions'
import getters from './getters'
import plugins from './plugins'


const { value } = await Preferences.get({ key: STORAGE_KEY });

const storedState = value? JSON.parse(value) : {};
 
export default createStore({
  state: {
    is_cookie_accepted: storedState.is_cookie_accepted,
    user: storedState.user,
    isLogin: storedState.isLogin,
    language: storedState.language,
    currency_pref: storedState.currency_pref || "KWD",
    currency_label: storedState.currency_label  || "KWD",
    utm_id: storedState.utm_id,
    restaurant_uuid: storedState.restaurant_uuid,
    store: null,
    cart: storedState.cart || {},
    cartTotal: 0,
    cartLength: 0,
    shippingMethod: storedState.shippingMethod || {},
    deliveryTime: storedState.deliveryTime || {},
    toast: null, 
    
    //for guest customer
    customerAddress: storedState.customerAddress || {},
    customerInfo: storedState.customerInfo || {},
    giftDetails: storedState.giftDetails,
    order: null,
    currency: null,
    appleAuthLoading: false,
    businessLocations: [],
    vouchers:[],

    appUpdateAvailable: false,

    mixpanel_distinct_id: null
  },
  actions,
  mutations,
  getters,
  plugins  
});


/*
export default createStore({
  state () {
    return {
    
    }
  }, 
  getters,
  actions,
  mutations, 
});*/