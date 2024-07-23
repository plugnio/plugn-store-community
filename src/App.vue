<template>
  <ion-app>
    <!-- when="" to hide menu-->
    <ion-split-pane content-id="main-content">
      <ion-menu content-id="main-content" :disabled="!store.state.store" type="overlay">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start" v-if="menuController.isOpen">
              <ion-menu-toggle>
                <ion-button>
                  <img src="./assets/icons/close.svg" />
                </ion-button>
              </ion-menu-toggle>
            </ion-buttons>
            <ion-title v-if="store.state.store" class="sidebar-title">
              <router-link to="/home">

                <img v-if="store.state.store.logo" class="store-logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/'
                  + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo" />

                <img v-if="!store.state.store.logo" class="store-logo" src="./assets/icons/store.svg" />
 
              </router-link>
              <!-- <span>{{ store.state.store.name }}</span> -->

            </ion-title>
            <ion-buttons slot="end">
              <button @click="showLanguages($event)">
                {{ store.state.language? store.state.language.code : "EN" }}
                <img src="./assets/icons/chevron-down.svg" />
              </button>

              <button id="currency-menu-trigger">
                {{ store.state.currency_pref }}
                <img src="./assets/icons/chevron-down.svg" />
              </button>
              <ion-popover trigger="currency-menu-trigger" trigger-action="click">

                <ion-item tappable @click="setCurrency(currency)" :key="index" v-for="(currency, index) of store.state.store.currencies">
                  <ion-label>
                    <h5>{{ currency.code }}</h5>
                    <p>{{ currency.title }}</p>
                  </ion-label>
                  <ion-icon v-if="store.state.currency_pref == currency.code" :icon="checkmark"></ion-icon>
                </ion-item>

              </ion-popover>

            </ion-buttons>

          </ion-toolbar>
        </ion-header>
        <ion-content>
<!-- 
    <div v-if="store.state.toast" class="alert alert-{{ store.state.toast.type }}">
    {{ $t(store.state.toast?.message, store.state.toast?.params)  }}
  </div>-->
  
          <ion-list id="menu-item-list">

            <div class="hello-wrapper" :router-link="store.state.isLogin ? '/profile' : '/email-login'">

              <div class="hello-detail">
                <p>{{ $t('Hello') }},</p>
                <h5 v-if="store.state.isLogin">{{ store.state.user.name }}</h5>
                <h5 v-if="!store.state.isLogin">{{ $t('Guest') }}</h5>
              </div>

              <!-- todo: enable once able to order with user details -->
              <button v-if="!store.state.isLogin" @click="router.push('/email-login'); menuController.close()">
                {{ $t("Login Now") }}
              </button>

              <div class="clearfix"></div>
            </div>

            <ion-menu-toggle :auto-hide="false">
              <ion-item tappable router-direction="root" router-link="/home" lines="none">
                <img aria-hidden="true" src="./assets/icons/home-black.svg" />
                <ion-label>{{ $t('Home') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle :auto-hide="false" v-if="store.state.isLogin">
              <ion-item tappable router-direction="root" router-link="/profile" lines="none">
                <img aria-hidden="true" src="./assets/icons/profile.svg" />
                <ion-label>{{ $t('Profile') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle :auto-hide="false" v-if="store.state.isLogin">
              <ion-item tappable router-direction="root" router-link="/orders" lines="none">
                <img aria-hidden="true" src="./assets/icons/order.svg" />
                <ion-label>{{ $t('Orders') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle :auto-hide="false" v-if="store.state.isLogin">
              <ion-item tappable router-direction="root" router-link="/addresses" lines="none">
                <img aria-hidden="true" src="./assets/icons/address.svg" />
                <ion-label>{{ $t('Addresses') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle :auto-hide="false">
              <ion-item tappable router-direction="root" router-link="/store-info" lines="none">
                <img aria-hidden="true" src="./assets/icons/store.svg" />
                <ion-label>{{ $t('Store Info') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

            <ion-menu-toggle :auto-hide="false" v-if="store.state.isLogin">
              <ion-item tappable @click="logout()">
                <ion-icon :icon="logOutOutline"></ion-icon>
                <ion-label>{{ $t('Log Out') }}</ion-label>
              </ion-item>
            </ion-menu-toggle>

          </ion-list>

          <div class="track-wrapper">
            <h5>{{ $t('Track your order') }}</h5>
            <form>
              <input :placeholder='$t("Order Code")' v-model="order_uuid" />
              <button @click.prevent="showOrderPage()">{{ $t('Track') }}</button>
            </form>
          </div>

          <div class="social-wrapper" v-if="store.state.store">

            <a target="_blank" :href="store.getters.weblink(link)" v-for="(link, index) in store.state.store.webLinks"
              :key="index">
              <span v-if="link.web_link_type == 1">
                <ion-icon slot="start" :icon="openOutline"></ion-icon> {{ $t('Weblink') }}
              </span>
              <span v-if="link.web_link_type == 5">
                <ion-icon slot="start" :icon="logoSnapchat"></ion-icon> {{ $t('Snapchat') }}
              </span>
              <span v-if="link.web_link_type == 6">
                <ion-icon slot="start" :icon="logoWhatsapp"></ion-icon> {{ $t('WhatsApp') }}
              </span>
              <span v-if="link.web_link_type == 7">
                <ion-icon slot="start" :icon="mailOutline"></ion-icon> {{ $t('eMail') }}
              </span>
              <span v-if="link.web_link_type == 3">
                <img src="./assets/icons/instagram.svg" /> {{ $t('Instagram') }}
              </span>
              <span v-if="link.web_link_type == 2">
                <img src="./assets/icons/facebook.png" /> {{ $t('Facebook') }}
              </span>
              <span v-if="link.web_link_type == 4">
                <img src="./assets/icons/twitter.png" /> {{ $t('Twitter') }}
              </span>
              <span v-if="link.web_link_type == 8">
                <img src="./assets/icons/youtube.svg" /> {{ $t('YouTube') }}
              </span>
            </a>

          </div>
        </ion-content>
      </ion-menu>
      <ion-router-outlet id="main-content"></ion-router-outlet>
    </ion-split-pane>
    
    <!-- service worker update message -->

    <update-alert v-if="store.state.appUpdateAvailable">
    </update-alert>

  </ion-app>
</template>

<script setup lang="ts">
import { checkmark, logOutOutline, logoSnapchat, logoWhatsapp, mailOutline, openOutline } from 'ionicons/icons';
import {
  IonApp,
  IonContent,
  IonItem,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
  IonRouterOutlet,
  IonSplitPane,
  menuController,
  IonIcon,
  IonPopover,
  IonButton,
  popoverController
} from '@ionic/vue';

import { onErrorCaptured, ref } from 'vue';
import store from './store';
import router from './router';
import LanguageList from './components/LanguageList.vue';
import UpdateAlert from './components/UpdateAlert.vue';
//import { useI18n } from 'vue-i18n-composable/src/index'

//import { useStore } from 'vuex';


const order_uuid = ref();

function logout() {
  store.commit('logout');

  router.push('/');
}

function showOrderPage() {
  if (order_uuid.value) {
    router.push('/order/' + order_uuid.value);
    order_uuid.value = null;
    menuController.close();
  }
}

async function showLanguages(event) {
  const popover = await popoverController.create({
      component: LanguageList, 
      event: event,
  });
  await popover.present();
}

function setCurrency(currency) {
  store.commit('setCurrencyPref', currency);

  popoverController.dismiss();
}

onErrorCaptured((event) => { 
    
   const chunkCssFailedMessage = /Loading CSS chunk [\d]+ failed/;
   const chunkJSFailedMessage = /Loading chunk [\d]+ failed/;
 
   if (chunkJSFailedMessage.test(event.message) || chunkCssFailedMessage.test(event.message)) {
    store.state.appUpdateAvailable = true;// need to refresh page 
     //return window.location.reload();
   }
});

 
/*onMounted(() => {
  store.dispatch('getStoreDetail').then(() => {
  });
})

/*
const path = window.location.pathname.split('/')[1];
if (path !== undefined) {
 selectedIndex.value = appPages.findIndex((page) => page.url.split('/')[1] === path);
}

login with otp 
if (cookieService.get('otp')) {
               _platform.ready().then(_ => {
                   setTimeout(() => {
                       loginByOtp(cookieService.get('otp'));
                   }, 800); // to fix: https://www.pivotaltracker.com/story/show/168368025
               });
           }


const store = useStore();

store.dispatch('getStoreDetail').then(() => {
})*/

</script>

<style scoped lang="scss">
ion-menu {
  --min-width: 353px;
}

#menu-item-list {
  ion-icon,
  img {
    fill: black;
    color: black;
  }
}

ion-title {
  color: var(--ion-color-dark, #202020);
  font-size: 18px;
  font-style: normal;
  font-weight: 600;
  line-height: 24.8px;
  padding-inline-end: 0;

  img {
    width: 48px;
    height: 48px;
    border-radius: 48px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    margin-inline-end: 8px;
    float: var(--start);
  }

  span {
    padding: 15px 0;
    line-height: 100%;
    float: var(--start);
  }
}

@media only screen and (max-width: 991px) {
  ion-title {
    padding-inline-start: 0;
  }

  .show-menu ion-title.ios {
    padding-inline-start: 45px;
  }
}

ion-buttons[slot="end"] button {
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 21px;
  letter-spacing: -0.32px;
  width: 62px;
  height: 100%;
  background: transparent;
  text-transform: uppercase;

  img {
    margin-inline-start: 4px;
    top: 4px;
    position: relative;
  }
}

ion-buttons[slot="end"] #currency-menu-trigger {
  width: 67px;
}

.hello-wrapper {
  .hello-detail {
    margin-bottom: 16px;
    width: calc(100% - 115px);
    display: inline-block;

    p {
      color: var(--ion-color-dark-shade, #1A1A1A);
      font-size: 14px;
      font-style: normal;
      font-weight: 300;
      line-height: 21px;
      letter-spacing: -0.32px;
      margin-bottom: 4px;
      margin-top: 0;
    }

    h5 {
      color: var(--ion-color-dark-shade, #1A1A1A);
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 24.8px;
      margin-top: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  button {
    border-radius: 12px;
    border: 1px solid var(--ion-color-primary, #453E9A);
    padding: 10px 16px;
    color: var(--ion-color-primary, #453E9A);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    background: transparent;
    height: 40px;
    float: var(--end);
  }
}

ion-menu {

  ion-item {
    --padding-start: 0;
  }

  ion-item img,
  ion-icon {
    margin-inline-end: 8px;
  }

  ion-label {
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
    letter-spacing: -0.32px;
    text-align: var(--start);
  }
}

.social-wrapper {
  margin: 0 -4px;

  a {
    padding: 8px 12px;
    align-items: center;
    gap: 8px;
    border-radius: 12px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    color: var(--ion-color-dark);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
    margin: 4px;
    width: calc(50% - 8px);
    height: 40px;
    display: inline-block;

    img {
      width: 20px;
      height: 20px;
      float: var(--start);
      margin-inline-end: 12px;
    }

    ion-icon {
      font-size: 20px;
      float: var(--start);
      margin-inline-end: 12px;
    }
  }
}

.track-wrapper {
  display: flex;
  padding: 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  align-self: stretch;
  border-radius: 16px;
  border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
  margin-top: 16px;

  h5 {
    color: #000;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 21px;
    letter-spacing: -0.32px;
    margin: 0 0 0px 0;
  }

  input {
    border-radius: 12px;
    background: var(--ion-color-light-shade, #F7F7F7);
    display: flex;
    padding: 10px 12px;
    align-items: flex-start;
    gap: 8px;
    flex: 1 0 0;
    border: 0;
    width: calc(100% - 78px);
    float: var(--start);
    margin-inline-end: 8px;
  }

  button {
    border-radius: 12px;
    background: var(--ion-color-primary, #453E9A);
    display: flex;
    padding: 10px 16px;
    flex-direction: column;
    align-items: flex-start;
    color: var(--ion-color-primary-contrast, #FFF);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    width: 70px;
    height: 40px;
  }
}

ion-item.selected {
  --color: var(--ion-color-primary);
}
</style>
 
 