import { createApp, watch } from 'vue'
import App from './App.vue'
import { IonicVue, modalController, popoverController } from '@ionic/vue';
import store from './store';
import mixpanel from 'mixpanel-browser';
// Added by the CLI
import './registerServiceWorker';

//import ItemSearch  from '@/components/ItemSearch.vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';

import './theme/style.scss';
import router from './router';
import { initSentry } from './services/SentryService';
import { initI18n } from './services/TranslateService';
import { updateHTML } from './services/HTMLService';
   

const app = createApp(App)
  .use(IonicVue)
  .use(router);
  
app.use(store);  
     
if (process.env.NODE_ENV === 'production') {
  initSentry(app);
}

watch(store.state.cart, async () => {
  store.commit('updateCartTotals');
})

store.commit('updateCartTotals');

/*watch(store.state.toast, async () => {
  alert(1);
}, { deep: true })
 */

mixpanel.init(process.env.VUE_APP_MIXPANEL_KEY, {
  debug: false, 
  track_pageview: true, 
  persistence: 'localStorage',
  loaded: (mixpanel) => {
    store.state.mixpanel_distinct_id = mixpanel.get_distinct_id();
  }
});

window.onpopstate = (e) => {
 
  //e.state.navigationId == null || 
  if (window['history-back-from'] == 'onDidDismiss') {
    window['history-back-from'] = null;
    return false;
  }

  Promise.all([
    popoverController.getTop(),
    modalController.getTop()
  ])
    .then(data => {

      if (data[0]) {
        popoverController.dismiss({
          from: 'native-back-btn'
        });
      }

      if (data[1]) {
        modalController.dismiss({
          from: 'native-back-btn'
        });
      }
    });
};

store.dispatch('getStoreDetail').then(() => {
 
  const i18n = initI18n();

 // i18n.global.locale.value = "ar";

  app.use(i18n);

  app.provide('i18n', i18n);
  
  router.isReady().then(() => {
    app.mount('#app');

    if(store.state.store) { 
      updateHTML();
    } 
  }); 
});

