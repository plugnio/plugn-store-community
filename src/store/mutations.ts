import { trackEvent } from "@/services/AnalyticsService";
import mixpanel from 'mixpanel-browser';
import { inject } from "vue";
import { useI18n } from "vue-i18n";

export const STORAGE_KEY = 'plugn-store'

export default {
    acceptCookie(state) {
        state.is_cookie_accepted = true;
    },
    logout(state) {
        state.customerInfo = null;
        state.isLogin = false;
        state.user = null;

        mixpanel.reset();
    },
    unVerifiedToken(state, data) {
        state.unVerifiedToken = data;
    },
    updateUser(state, data) {
        state.user.name = data.name;
    },
    login(state, data) {
 
        //trackEvent('UserAction', 'Customer Logged In', data.name);

        //login_method

        state.isLogin = true;

        state.user = {
            token: data.token, 
            name: data.name, 
        };  

        if (data.currency_pref) {
            state.currency_pref = data.currency_pref;
            state.currency_label = data.currency_label;
        }

        // set language pref if user have valid language code saved in DB
        /* todo : set laguage 
        if (data.language_pref) {
          setLanguagePref$.next(data.language_pref);
        }
    
        // Log User )In by Triggering Event that Access Token has been Set
    
        userLogin$.next({ 'redirect': data.redirect });*/

    },
    setLanguagePref(state, language) {
        state.language = language;
    },
    setCurrencyPref(state, data: any) {

        state.store.currencies.forEach(element => {
            if (element.code == data.code) {
                state.currency = element;
            }
        });

        if (!state.currency) {
            state.currency = state.store.currency;
        }
        
        state.currency_pref = state.currency.code;
        state.currency_label = state.currency.title;
    },
    setStore(state, store) {
        state.store = store; 
        state.restaurant_uuid = store.restaurant_uuid;
    },
    setBusinessLocation(state, locations) {
        state.businessLocations = locations;
    },
    updateCategory(state, { categoryIndex, category} ) {
        state.store.categories[categoryIndex] = category;
    },
    updateCategories(state, categories) {
        state.store.categories = categories;
    },
    setVouchers(state, vouchers) {
        state.vouchers = vouchers;
    },
    setCustomerAddress(state, customerAddress) {
        state.customerAddress = customerAddress;
    },
    setCustomerInfo(state, customerInfo) {
        state.customerInfo = customerInfo;
    },
    setGiftDetails(state, details) {
        state.giftDetails = details;
    },
    addToCart(state, { variant, item, qty = 1, extraOptions = [] }) {
     
        //item_added_to_cart

         // Track Event via Analytics
        if(item.item_type == 1) {
            trackEvent('UserAction', 'add-to-cart', "Item name", item.item_name, item.item_price, item.item_uuid);
        } else {
            trackEvent('UserAction', 'add-to-cart', "Item name", item.item_name, variant.price, item.item_uuid);
        }

        /*for (let i = 0; i < state.cart.length; i++) {

            if(
                state.cart[i].item_uuid == item.item_uuid && 
                state.cart[i].extraOptions == item.extraOptions
            ) {
                state.cart[i].qty += qty;
                return;
            } 
        }*/
  
        let cart_hash_seed = item.item_uuid; 

        extraOptions.forEach(extraOptn => { 
            if(extraOptn.extra_option_id) {
                cart_hash_seed += ":" + extraOptn.extra_option_id;
            } else {
                cart_hash_seed += ":" + extraOptn.extra_option_name;
            }
        }); 
 
        const cart_item_id = cart_hash_seed;
        //extraOptions.length > 0 ? btoa(cart_hash_seed): cart_hash_seed;
 
        if (state.cart[cart_item_id]) {
            state.cart[cart_item_id].qty = state.cart[cart_item_id].qty + qty;
            return true;
        }
 
        //if not available 
        state.cart[cart_item_id] = {
            ...item,
            variant,
            qty,
            extraOptions
        };

        let qtyTotal = 0;
        let total = 0; 

        for (const i in state.cart) {
            qtyTotal += state.cart[i].qty;
            total += state.cart[i].qty * state.cart[i].item_price;
        }

        state.cartTotal = total;
        state.cartLength = qtyTotal;
    },
    updateCart(state, { index, qty }) {
 
        state.cart[index].qty = qty;

        if(qty == 0) {
            delete state.cart[index];
        } 


        let qtyTotal = 0;
        let total = 0; 

        for (const i in state.cart) {
            qtyTotal += state.cart[i].qty;
            total += state.cart[i].qty * state.cart[i].item_price;
        }

        state.cartTotal = total;
        state.cartLength = qtyTotal;
    },
    deleteCart(state, { index }) {
        state.cart = state.cart.filter((_, i) => i != index); 

        let qtyTotal = 0;
        let total = 0; 

        for (const i in state.cart) {
            qtyTotal += state.cart[i].qty;
            total += state.cart[i].qty * state.cart[i].item_price;
        }

        state.cartTotal = total;
        state.cartLength = qtyTotal;
    },
    updateCartTotals(state) {

        let qty = 0;
        let total = 0; 

        for (const i in state.cart) {
            qty += state.cart[i].qty;
            total += state.cart[i].qty * state.cart[i].item_price;
        }

        state.cartTotal = total;
        state.cartLength = qty;
    },
    clearCart(state) {
        state.cart = {};
        state.cartTotal = 0;
        state.cartLength = 0;
    },
    setToast(state, data) {
        state.toast = data;
    },
    setOrder(state, order) {
        state.order = order;
    },
    setShippingMethod(state, data) {
 
        if(
            data.order_mode == 2 && 
            (
                !state.shippingMethod.business_location_name || 
                !state.shippingMethod.business_location_name
            ) && 
            state.businessLocations && 
            state.businessLocations.length > 0
        ) {
            state.shippingMethod.business_location_id = state.businessLocations[0].business_location_id;
            state.shippingMethod.business_location_name = state.businessLocations[0].business_location_name;
            state.shippingMethod.business_location_name_ar = state.businessLocations[0].business_location_name_ar;
            
            //data = Object.assign(data, )
        }

        state.shippingMethod = data;
    },
    setDeliveryTime(state, data) {
        state.deliveryTime = data;
    },
    setLocationPermission(state, data) {
        state.locationPermission = data;
    }
}
/**
 * 
 *todo: cart show variant price if variant item 
 qty validation for variant in cart + add/update cart actions + detail page variant price + qty validation
 */