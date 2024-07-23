import router from "@/router";
import { modalController } from "@ionic/vue";
//services
import { getStoreDetail } from "@/services/StoreService";
//pages
import CartPage from '@/views/checkout/CartPage.vue';
import store from ".";


declare const navigator;
 
export default {

    getStoreDetail({ state, commit }) {

        return getStoreDetail().then(store => {
 
            //todo: show 404 if not store 

            commit('setStore', store);
 
            if (!state.language?.code && store.default_language) {

                if (store.default_language == 'en') {
                    commit('setLanguagePref', {
                        code: 'en',
                        name: 'English'
                    });
                }
                else {
                    commit('setLanguagePref', {
                        name: 'عربى',
                        code: 'ar'
                    });
                }
            }

            if (!state.language) {

                const browserLanguage = navigator.languages
                    ? navigator.languages[0]
                    : (navigator.language || navigator.userLanguage);

                if (browserLanguage && browserLanguage.indexOf('en') > -1) {
                    commit('setLanguagePref', {
                        code: 'en',
                        name: 'English'
                    });
                } else {
                    commit('setLanguagePref', {
                        name: 'عربى',
                        code: 'ar'
                    });
                }
            }

            //todo for other tracking tiktok, snap etc

            //if selected 

            if (!state.currency && store.currency) {

                const code = state.currency_pref || store.currency?.code;

                commit('setCurrencyPref', { code: code });
            }

        }).catch((e) => {
            console.error(e);
         //todo: show no store found page 
        });
    },

    /***
     * Go to external website
     */
    goToExternalUrl({ state, commit }, webLink) {
      
        switch (webLink.web_link_type) {
            case 1: //Website url
                return window.location.href = webLink.url;
                break;
            case 2: //Facebook
                return window.location.href = 'https://www.facebook.com/' + webLink.url;
                break;
            case 3: //Insta
                return window.location.href = 'https://www.instagram.com/' + webLink.url;
                break;
            case 4: //Twitter
                return window.location.href = 'https://www.twitter.com/' + webLink.url;
                break;
            case 5: //Snapchat
                return window.location.href = 'https://www.snapchat.com/add/' + webLink.url;
                break;
            case 6: //Whatsapp
                return window.location.href = 'https://wa.me/' + state.store.country.country_code + webLink.url;
                break;
            case 7: //Email
                return window.location.href = 'mailto:' + webLink.url;
                break;
        }
    },
    
    setAccessToken({ commit }, res) {

        commit('login', res);

        router.push('/');
    },
    
    async openCart({ state }) {
        window.history.pushState({
            navigationId: window.history.state.navigationId
          }, null, window.location.pathname);
        
        const modal = await modalController.create({
            component: CartPage,
            cssClass: 'popup-modal'
        });
        modal.present();
        modal.onDidDismiss().then(e => {
 
            /*if (!e.data || e.data.from != 'native-back-btn') {
               window['history-back-from'] = 'onDidDismiss';
               window.history.back();
            }*/

            if(e.data && e.data.page == "checkout") {
                if(state.isLogin || state.store.enable_guest_checkout) {
                    router.push('/confirm');
                } else {
                    try {
                      router.push('/email-login');
                    } catch (err) { 
                      console.error(err);
                      window.location.href = "/email-login";
                    }
                }
            }
        });
    }
}


