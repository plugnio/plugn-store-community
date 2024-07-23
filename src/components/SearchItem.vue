<template>

    <div class="search-item" tappable @click="onItemSelect(item)">

    <ion-img loading="lazy" v-if="item['itemImage']"
        @ionError="onItemImageError(item)"
        :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_100,h_100/restaurants/' + store.state.restaurant_uuid + '/items/' + item['itemImage']['product_file_name']"></ion-img>

    <ion-img v-if="!item['itemImage'] && store.state.store.logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/'
        + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"></ion-img>

    <ion-img v-if="!item['itemImage'] && !store.state.store.logo" class="store-logo" 
                    src="@/assets/icons/store.svg"></ion-img>

    <div class="detail">
        <h5 v-html="toBold(langContent(item['item_name'], item['item_name_ar']), query)"></h5>
    </div>

    <div class="clearfix"></div>
    </div> 
</template>
<script setup lang="ts">
import { toBold } from '@/pipes/bold';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import DetailPage from '@/views/products/DetailPage.vue';
import { IonImg, modalController } from '@ionic/vue';

defineProps(['item', 'query']);

async function onItemSelect(item) {
    //router.push('/item/' + item['slug']);
    window.history.pushState({
      navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: DetailPage,
        componentProps: {
          itemProps: item
        }
    });
    modal.present(); 
    modal.onDidDismiss().then(e => {

      if (!e.data || e.data.from != 'native-back-btn') {
        window['history-back-from'] = 'onDidDismiss';
        window.history.back();
      }
    });
}

function onItemImageError(item) {
    item.itemImage = null;
}

</script>

<style lang="scss" scoped>

.search-item { 
  padding: 12px 16px;
}

ion-img {
  display: block;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  float: var(--start);
  margin-inline-end: 12px;
  overflow: hidden;
  background-color: #ccc;
}

.detail {
  float: var(--start);
  width: calc(100% - 112px);
  position: relative;

  h5 {
    color: var(--ion-color-medium-shade, #707070);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */ 
    margin-bottom: 0px;
    margin-top: 10px;

    b {
        color: var(--ion-color-dark-shade, #1A1A1A); 
        font-size: 14px;
        font-style: normal;
        font-weight: 500; 
    }
  }
 
}
 
</style>
 