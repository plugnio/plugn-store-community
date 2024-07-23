import store from "@/store";

export function toPrice(value: number, currency_code = null, currency_rate = null, with_symbol = true): any {

    if(!currency_code) {
        currency_code = store.state.currency_pref;
    }

    if (!currency_rate) {//currency_code != authService.store.currency.code
        currency_rate = store.state.currency.rate / store.state.store.currency.rate;
    }

    value = value * currency_rate;
 
    if(!with_symbol) {
        return value.toFixed(store.state.currency.decimal_place);
    }
    
    return currency_code + ' ' + value.toFixed(store.state.currency.decimal_place);
}