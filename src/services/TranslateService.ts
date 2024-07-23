//import { useI18n } from "vue-i18n";

import messages from "@/i18n/messages";
import store from "@/store";
import { createI18n } from "vue-i18n";
import { default as en } from 'date-fns/locale/en-US'
import { default as ar } from 'date-fns/locale/ar'
import { format } from "date-fns";

//const i18n = useI18n({ useScope: "global" });
 


export function formatDate(datetime, dateFormat, isTime = false) {
   
    if(isTime) {
        datetime = getDatetime(datetime);
    }

    //if not Date object, specify that server using +3:00 timezone 
    const value = typeof datetime == 'object' ? datetime: new Date(datetime + "+03:00");

    return format(value, dateFormat, { locale: getLocal() })
}

export function getLocal() {
    return store.state.language && store.state.language.code == 'ar' ? ar : en;
}

export function getDatetime(time: any, date = null) {

    if(!time) {
        console.info(time, "empty value");
    }

    if(!date)
        date = new Date();

    const arrTime = time.split(":");
    date.setUTCHours(arrTime[0] - 3, arrTime[1], arrTime[2]);
    return new Date(date);
}

export function initI18n() { 

    const i18n = createI18n({
        // vue-i18n options here ...
        legacy: false,
        globalInjection: true,
        locale: store.state.language ? store.state.language.code: 'en',
        fallbackLocale: 'en',
        messages: messages,
        silentTranslationWarn: true,
        //silentFallbackWarn: true
        missingWarn: false, 
        //fallbackWarn: false,
    });
 
    return i18n;
}

/**
 * return app direction 
 */
export function direction() {
    return store.state.language && store.state.language.code == 'ar' ? 'rtl' : 'ltr';// i18n.locale.value
}

/**
 * Return content based on language selected 
 * @param enContent 
 * @param arContent 
 */
export function langContent(enContent, arContent) {

    if (store.state.language && store.state.language.code == 'ar' && arContent)
        return arContent;

    return enContent;
}
 