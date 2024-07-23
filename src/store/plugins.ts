import { createLogger } from 'vuex'
import { STORAGE_KEY } from './mutations'
import { Preferences } from '@capacitor/preferences';

const localStoragePlugin = store => {
  store.subscribe((mutation, { 
        cart, 
        cartTotal,
        cartLength,

        user,
        language,
        is_cookie_accepted,
        currency_pref,
        currency_label,
        utm_id,
        restaurant_uuid,
        isLogin,
        shippingMethod,
        customerAddress,
        customerInfo
    }) => {

      Preferences.set({
        key: STORAGE_KEY,
        value: JSON.stringify({
          user: user,
          isLogin: isLogin,
          language: language,
          is_cookie_accepted: is_cookie_accepted,
          currency_pref: currency_pref,
          currency_label: currency_label,
          utm_id: utm_id,
          restaurant_uuid: restaurant_uuid,
          shippingMethod: shippingMethod,
          customerAddress: customerAddress,
          customerInfo: customerInfo,
          
          cart: cart,
          cartTotal: cartTotal,
          cartLength: cartLength,
        }),
      });
  })
}

export default process.env.NODE_ENV !== 'production'
  ? [createLogger(), localStoragePlugin]
  : [localStoragePlugin];