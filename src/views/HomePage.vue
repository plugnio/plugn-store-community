<template>
  <IonPage v-if="store.state.store">
    <IonHeader :translucent="true">
      <IonToolbar>
        <ion-buttons slot="start">
          <ion-menu-button color="primary">
          </ion-menu-button>
          <!--<button @click="menuController.open()">
            <img src="../assets/icons/menu.svg" />
            <ion-icon :icon="menuOutline"></ion-icon> 
          </button>  --> 
        </ion-buttons>
         
        <!-- hidding on request
        <template v-if="isPlatform('desktop')">
          <div slot="start" class="mode-wrapper" v-if="store.state.store.supportDelivery && store.state.store.supportPickup">
              <button :class="{ active: !store.state.shippingMethod?.order_mode || store.state.shippingMethod.order_mode == 1 }" @click="updateOrderMode(1)">
                  {{ $t("Delivery") }} </button>
              <button :class="{ active: store.state.shippingMethod?.order_mode == 2 }" @click="updateOrderMode(2)">
                  {{ $t("Pickup") }} </button>
          </div>
          
          <div slot="start" class="mode-area">
            <template v-if="store.state.shippingMethod.order_mode == 1 && (store.state.shippingMethod.area || store.state.shippingMethod.city)">
              <h5>{{ $t('Delivering to') }}</h5>
              <a v-if="store.state.shippingMethod.area">{{ langContent(store.state.shippingMethod.area.area_name, store.state.shippingMethod.area.area_name_ar) }}</a>
              <a v-if="!store.state.shippingMethod.area && store.state.shippingMethod.city">
                  {{ langContent(store.state.shippingMethod.city.city_name, store.state.shippingMethod.city.city_name_ar) }}
                </a>
            </template>

            <template v-if="store.state.shippingMethod.order_mode == 2 && store.state.shippingMethod.business_location_name">
              <h5>{{ $t('Pickup from') }}</h5>
              <a>{{ langContent(store.state.shippingMethod.business_location_name, store.state.shippingMethod.business_location_name_ar) }}</a>
            </template>
          </div>
        </template>-->
        
        <div class="search-wrapper">
          <item-search @change="onSearch" :isDummy="isPlatform('mobile') || isPlatform('mobileweb')">
          </item-search>
        </div>

        <ion-buttons slot="end"> 
            <button class="btn-cart" @click="openCart()">
              <img src="../assets/icons/cart.svg" />
              <span class="count">{{ store.state.cartLength }}</span>
            </button> 
        </ion-buttons>
      </IonToolbar>
    </IonHeader>

    <ion-content :fullscreen="true" ref="content" >
          
      <div class="search-result-wrapper" v-if="items.values && items.values.length > 0">
        <search-item :query="query" :item="item" v-for="(item, index) in items.values" 
              :key="index"></search-item>
      </div>
      
      <!-- todo if no cover -->
      <!-- v-if="store.state.store.thumbnail_image" -->
      <div  class="cover" :style="{ backgroundImage: 'url(' + store.getters.cover + ')' }"> 
 
        <router-link to="/home">
          <div class="store-logo"> 
            <img v-if="store.state.store.logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo" />

            <img v-if="!store.state.store.logo" src="../assets/icons/store.svg" />

          </div>
        </router-link>
      </div>

      <h3 class="store-title">{{ langContent(store.state.store.name, store.state.store.name_ar) }}</h3>
      
      <div class="store-timing" v-if="store.getters.isStoreOpen">
          <span>{{ $t('Open now') }}</span>
          <span class="sep">·</span>
          <span>{{ store.getters.storeCloseAt }}</span>
 
          <button @click="showBusinessHours()" v-if="!store.state.store.accept_order_247">
            <img src="../assets/icons/info.svg" />
          </button>
          
      </div>

      <div class="store-timing" v-if="!store.getters.isStoreOpen">
          <span>{{ $t('Close now') }}</span>
          <template v-if="store.getters.storeReopenAt">
              <span class="sep">·</span>
              <span>{{ $t('Reopen at {time}', { time: store.getters.storeReopenAt }) }}</span>
              <button @click="showBusinessHours()" v-if="!store.state.store.accept_order_247">
                <img src="../assets/icons/info.svg" />
              </button>
          </template>
      </div>

      <!-- hidding on request 
      <div class="delivery-wrapper" v-if="!isPlatform('desktop') && store.state.store.supportDelivery && store.state.store.supportPickup">
        
        <div slot="start" class="mode-wrapper">
            <button :class="{ active: !store.state.shippingMethod?.order_mode || store.state.shippingMethod.order_mode == 1 }" @click="updateOrderMode(1)">
                {{ $t("Delivery") }} </button>
            <button :class="{ active: store.state.shippingMethod?.order_mode == 2 }" @click="updateOrderMode(2)">
                {{ $t("Pickup") }} </button>
        </div>

        !-- todo: show selected area --

        <div class="mode-area">
          <template v-if="store.state.shippingMethod.order_mode == 1 && (store.state.shippingMethod.area || store.state.shippingMethod.city)">
            <h5>{{ $t('Delivering to') }}</h5>
            <a v-if="store.state.shippingMethod.area">{{ langContent(store.state.shippingMethod.area.area_name, store.state.shippingMethod.area.area_name_ar) }}</a>
            <a v-if="!store.state.shippingMethod.area && store.state.shippingMethod.city">
                {{ langContent(store.state.shippingMethod.city.city_name, store.state.shippingMethod.city.city_name_ar) }}
              </a>
          </template>

          <template v-if="store.state.shippingMethod.order_mode == 2 && store.state.shippingMethod.business_location_name">
            <h5>{{ $t('Pickup from') }}</h5>
            <a>{{ langContent(store.state.shippingMethod.business_location_name, store.state.shippingMethod.business_location_name_ar) }}</a>
          </template>
        </div>

        <div class="mode-info" v-if="store.state.shippingMethod.order_mode == 1 && 
          store.state.shippingMethod.deliveryZone">
          <div class="delivery-fee">
            <h5>{{ $t('Delivery Fee') }}</h5>
            <b>{{ toPrice(store.state.shippingMethod.deliveryZone.delivery_fee) }} </b>
          </div>
          <div class="sep"></div>
          <div class="delivery-time">
            <h5>{{ $t("Delivery Time") }}</h5>
            <b>{{ toDuration(store.state.shippingMethod.deliveryZone.delivery_time, store.state.shippingMethod.deliveryZone.time_unit) }} </b>
          </div>
        </div>
      </div>
      -->

      <div class="voucher-wrapper"> 
        <StoreVoucher :voucher="voucher" v-for="(voucher, index) in store.state.vouchers" :key="index"></StoreVoucher> 
      </div>

      <CategoryView v-if="[3, 6].indexOf(store.state.store.store_layout) > -1"></CategoryView>

      <GridView v-if="[2, 5].indexOf(store.state.store.store_layout) > -1"></GridView>

      <template v-if="[1, 4].indexOf(store.state.store.store_layout) > -1">
        <!-- <ListViewMobile v-if="isPlatform('mobile') || isPlatform('mobileweb')"></ListViewMobile> -->
        <!-- v-if="!isPlatform('mobile') && !isPlatform('mobileweb')"-->
        <ListViewDesktop></ListViewDesktop> 
      </template>

    </ion-content>
  </IonPage>
</template>

<script setup lang="ts">
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonToolbar, isPlatform, modalController } from '@ionic/vue';
import { onMounted, reactive, ref } from 'vue';

import ItemSearch from '@/components/ItemSearch.vue';
import StoreVoucher from '@/components/StoreVoucher.vue';

import CategoryView from '@/components/CategoryView.vue';
import ListViewMobile from '@/components/ListViewMobile.vue';
import ListViewDesktop from '@/components/ListViewDesktop.vue';
import GridView from '@/components/GridView.vue';

import { getVouchers } from '@/services/VoucherService';

import store from '@/store';
import { getItems } from '@/services/StoreService';
import SearchItem from '@/components/SearchItem.vue';
import { trackView } from '@/services/AnalyticsService';
import { langContent } from '@/services/TranslateService';
import StoreHours from '@/components/StoreHours.vue';
import { toPrice } from '@/pipes/price';
import { toDuration } from '@/pipes/duration';
 
const items = reactive([]);
const query = ref();

function onSearch(payload) { 

  query.value = payload.value;

  if(!query.value || query.value.length == 0) {
    items.values = null;
    return;
  }

  getItems(1, null, payload.value).then(res => {
      items.values = res.data;
  }).catch((e) => {
    console.error(e);
  });
}

onMounted(() => { 
  
  trackView('home-page');

  getVouchers().then(res => {
      store.commit('setVouchers', res);
  }).catch((e) => {
    console.error(e);
  });
});

function updateOrderMode(mode) {
  store.commit('setShippingMethod', Object.assign(store.state.shippingMethod, {
    order_mode: mode
  }));
}

async function openCart() {
  
  store.dispatch('openCart', {});

  /*  window.history.pushState({
    navigationId: window.history.state.navigationId
  }, null, window.location.pathname);

  const modal = await modalController.create({
      component: CartPage,
      cssClass: 'popup-modal'
  });
  modal.present();*/
}

async function showBusinessHours() {
  window.history.pushState({
    navigationId: window.history.state.navigationId
  }, null, window.location.pathname);

  const modal = await modalController.create({
        component: StoreHours,
        cssClass: "modal-opening-hours",
    });
  modal.present();
  modal.onDidDismiss().then(e => {

    if (!e.data || e.data.from != 'native-back-btn') {
      window['history-back-from'] = 'onDidDismiss';
      window.history.back();
    }
  });
}

</script>

<style lang="scss" scoped>
ion-content {
  --padding-start: 0;
  --padding-end: 0;
  --padding-top: 0;
}

ion-header .mode-area {
  padding: 0 15px 0 5px;
}

.mode-area {

  h5 {
    color: var(--tints-shades-neutral-n-6, #707070);
    text-align: center;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    margin: 0;
  }

  a {
    color: var(--ion-color-primary, #453E9A);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px; /* 157.143% */
  }
}

.delivery-wrapper {

  border-radius: 16px;
  border: 1px solid var(--tints-shades-neutral-n-2, #F0F0F0);
  display: flex;
  padding: 12px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin: 12px 16px 0 16px;

  .mode-wrapper {
    width: 100%;

    button {
      width: 50%;
    }
  }


  .mode-info {
    border-radius: 10px;
    background: var(--tints-shades-neutral-n-1, #F7F7F7);
    width: 100%;
    text-align: center;

    div {
      display: inline-block;
    }

    .delivery-fee,
    .delivery-time {
      padding: 4px;
      width: calc(50% - 1px);
    }

    .sep {
      border-radius: 1px;
      background: #D9D9D9;
      width: 1px;
      height: 28px;
    }

    b {
      color: var(--tints-shades-neutral-n-8, #1A1A1A);
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 22px; /* 157.143% */
    }
  }

  h5 {
      color: var(--tints-shades-neutral-n-6, #707070);
      text-align: center;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px; /* 157.143% */
      margin: 0;
    }
}

.mode-wrapper {
  margin-inline-end: 10px;
}

.search-result-wrapper {
  width: calc(100% - 90px);
  padding: 16px 0px;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  position: absolute;
  border-radius: 16px;
  background: var(--ion-color-primary-contrast, #FFF);
  box-shadow: 0px 3px 16px 0px rgba(0, 0, 0, 0.24);
  max-height: 216px;
  z-index: 99;
  overflow: scroll;
  margin-inline-start: 0px;
  margin-top: 57px;
}
@media only screen and (max-width: 991px) {
  .search-result-wrapper {
    width: calc(100% - 140px);
    margin-inline-start: 50px;
  }
}

.logo {
  display: flex;
  width: 64px;
  height: 64px;
  padding: 8px 8.5px 8px 7.5px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  border-radius: 32px;
  background: var(--ion-color-primary-contrast, #FFF);
  box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.12);
}

.store-title {
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  margin: 48px 16px 0 16px;
}

.store-timing {
  margin: 4px 16px 0 16px;
  color: var(--ion-color-success);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */

  .sep {
    margin: 0 4px;
  }

  button {
    background: transparent;
    margin: 0 4px;
    top: 2px;
    position: relative;

    img {
      width: 200%;
      height: 200%;
    }
  }
}

.voucher-wrapper {
  padding: 16px;
}
 
.voucher-wrapper {
  width: 100%;
  display: flex;
  overflow-x: auto;
}
 

</style>
