
import { formatDate } from '@/services/TranslateService';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default {
    cover(state) {

        if(!state.store) {
            return "";
        }

        return 'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg/restaurants/' + 
            state.store.restaurant_uuid + '/thumbnail-image/' + state.store.thumbnail_image;
    },
    isLogin(state) {
        return state.user.token;
    },
    isStoreOpen(state) {
 
        
        if (!state.store || state.store.accept_order_247) {
            return true;
        }

        const currentTime = new Date();

        for (const element of state.store.openingHours) {

            if (element.day_of_week === currentTime.getDay()) {

                const open_at = getDatetime(element.open_at);
                const close_at = getDatetime(element.close_at);
                const next_day_close_at = getNextDatetime(element.close_at);

                //normal timeslot 

                if (open_at < close_at) {
                    if (open_at < currentTime && close_at > currentTime) {
                        return true;
                    }
                }

                //next day timeslot 

                else if (open_at < currentTime && next_day_close_at > currentTime) {
                    return true;
                }
            }
        }

        return false;
    },
    storeCloseAt(state) {
 
        const { t } = useI18n({ useScope: "global" });
 
        if (state.store.accept_order_247) {
            return t("Order anytime!");
        }

        const currentTime = new Date();

        for (const element of state.store.openingHours) {

            if (element.day_of_week === currentTime.getDay()) {

                const open_at = getDatetime(element.open_at);
                const close_at = getDatetime(element.close_at);
                const next_day_close_at = getNextDatetime(element.close_at);

                //normal timeslot 

                if (open_at < close_at) {
                    if (open_at < currentTime && close_at > currentTime) {
                        return t("Closes at {time}", { time : formatDate(close_at, 'h:mm aa') });
                    }
                }

                //next day timeslot 

                else if (open_at < currentTime && next_day_close_at > currentTime) {
                    return t("Closes at {time}", { time : formatDate(next_day_close_at, 'd LLL, yyyy h:mm aa') });
                }
            }
        }

        return null;
    },
    storeReopenAt(state) {
  
        const { t } = useI18n({ useScope: "global" });
 
        /*
        check if reopening today then show today's time 
        check if reopening tomorrow 
        ....             ..day after tomorrow 
        */

        const currentTime = new Date();

        for(let i = 0; i < 7; i++) {
                
            const date = new Date();
             
            date.setUTCDate(date.getDate() + i); 

            for (const element of state.store.openingHours) 
            {
                if (element.day_of_week === date.getDay()) 
                {
                    const open_at = getDatetime(element.open_at, date);
                    const close_at = getDatetime(element.close_at, date);
 
                    //normal timeslot 

                    if (open_at < close_at && open_at > currentTime) {
 
                        switch(i) {
                            case 0: 
                                return formatDate(open_at, 'h:mm aa');
                            case 1: 
                                return t('Tomorrow {time}', { time: formatDate(open_at, 'h:mm aa') });    
                            default: 
                                return formatDate(open_at, 'd LLL, yyyy h:mm aa');
                        } 
                    }
                }
            }

            
        }
    },
    weblink: (state) => (webLink) => {

        switch (webLink.web_link_type) {
            case 1: //Website url
                return webLink.url;
                break;
            case 2: //Facebook
                return 'https://www.facebook.com/' + webLink.url;
                break;
            case 3: //Insta
                return 'https://www.instagram.com/' + webLink.url;
                break;
            case 4: //Twitter
                return 'https://www.twitter.com/' + webLink.url;
                break;
            case 5: //Snapchat
                return 'https://www.snapchat.com/add/' + webLink.url;
                break;
            case 6: //Whatsapp
                return 'https://wa.me/' + state.store.country.country_code + webLink.url;
                break;
            case 7: //Email
                return 'mailto:' + webLink.url;
                break;
        } 
    },
    cartItem: (state) => (item) => {
        return computed(() => {
            return state.cart.find(ele => ele.item_uuid == item.item_uuid);
        }, state.cart);

        /*for (let i = 0; i < state.cart.length; i++) {

            if(
                state.cart[i].item_uuid == item.item_uuid 
            ) {
                return i;
            } 
        }*/
    },
    cartLength: (state) => {
        return computed(() => {
            let qty = 0;

            for (let i = 0; i < state.cart.length; i++) {
                qty += state.cart[i].qty;
            }

            return qty;
        }, state.cart);    
    }
}

function getNextDatetime(time: any, today = null) {
    if(!today)
        today = new Date();

    const date = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    const arrTime = time.split(":");
    //server running on +3:00 so all dates on server already 3 hour ahead 
    date.setUTCHours(arrTime[0] - 3, arrTime[1], arrTime[2]);
    return new Date(date);
}

function getDatetime(time: any, date = null) {
    if(!date)
        date = new Date();

    const arrTime = time.split(":");
    date.setUTCHours(arrTime[0] - 3, arrTime[1], arrTime[2]);
    return new Date(date);
}
