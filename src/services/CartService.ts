import store from "@/store";
import { showToast } from "./HTMLService";
import { langContent } from "./TranslateService";

export function cartQuantity(item, extraOptions) {
   
    let cart_hash_seed = item.item_uuid; 

    extraOptions.forEach(extraOptn => { 
        if(extraOptn.extra_option_id) {
            cart_hash_seed += ":" + extraOptn.extra_option_id;
        } else {
            cart_hash_seed += ":" + extraOptn.extra_option_name;
        }
    }); 
 
    return store.state.cart[cart_hash_seed]? 
        store.state.cart[cart_hash_seed].qty: 0;
}

export function validateQty(item, qty, extraOptions, variant) {


    //get qty from cart 
    const cartQty = cartQuantity(item, extraOptions);

    let haveError = false; 

    if(item.track_quantity) {

        if(item.item_type == 1) {

            if(item.stock_qty < qty + cartQty) {
                showToast('Max quantity available is {qty}', {
                    qty: item.stock_qty
                }, "middle");
                haveError = true;
                return false;
            }

            //todo: extra option qty validation 

            for(let extraOption of extraOptions) {
                
                if(extraOption.stock_qty < qty + cartQty) {
                    showToast('Max quantity available is for {option} is {qty}', {
                        option: langContent(extraOption.extra_option_name, extraOption.extra_option_name_ar),
                        qty: item.stock_qty
                    }, "middle");
                    haveError = true;
                    return false;
                }
            }

        } else if(item.item_type == 2 && variant.stock_qty < qty + cartQty) {

            showToast('Max quantity available is {qty}', {
                qty: variant.stock_qty
            }, "middle");
            haveError = true;
            return false;
        } 
    }
 
    if(!haveError)
        return true;
}

export function addToCart(item, qty = 1, extraOptions = [], variant = null) {
 
    if(!validateQty(item, qty, extraOptions, variant)) {
        return false;
    }
    
    store.commit('addToCart', { item, qty, extraOptions, variant });

    /*showToast('{item} added to cart', {
        item: langContent(item.item_name, item.item_name_ar)
    }, "top");*/

    return true;
}

export function updateCart(index, item, qty = 1) {
 
    const extraOptions = store.state.cart[index].extraOptions;
    const variant = store.state.cart[index].variant; 

    if(!validateQty(item, qty, extraOptions, variant)) {
        return;
    }

    store.commit('updateCart', { index, qty });

    /*showToast('{item} quantity updated in cart', {
        item: langContent(item.item_name, item.item_name_ar)
    }, "top");*/
}
 
export function plusCartItem(index, item) {

    const extraOptions = store.state.cart[index].extraOptions;
    const variant = store.state.cart[index].variant; 

    const qty = store.state.cart[index].qty + 1;

    if(!validateQty(item, qty, extraOptions, variant)) {
        return;
    }
    
    store.commit('updateCart', { index, qty });

    /*showToast('{item} quantity updated in cart', {
        item: langContent(item.item_name, item.item_name_ar)
    }, "top");*/
}

export function minusCartItem(index) { 
    const item = store.state.cart[index]; 
    const qty = store.state.cart[index].qty - 1;
 
    store.commit('updateCart', { index, qty });

    /*showToast('{item} quantity updated in cart',{
        item: langContent(item.item_name, item.item_name_ar)
    }, "top");*/
}

export function deleteCart(index) {
    store.commit('deleteCart', { index });

   // showToast(item.item_name + ' removed from cart', "top");
}
 