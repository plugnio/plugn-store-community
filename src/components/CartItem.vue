
<template>
  <div class="cart-item" tappable @click="onItemSelect(item)">

    <ion-img loading="lazy" v-if="item.itemImage" @ionError="onItemImageError(item)"
      :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_200/restaurants/' + store.state.restaurant_uuid + '/items/' + item.itemImage.product_file_name"></ion-img>
 
    <ion-img v-if="!item.itemImage && store.state.store.logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"></ion-img>
 
    <ion-img v-if="!item.itemImage && !store.state.store.logo" class="store-logo" src="@/assets/icons/store.svg"></ion-img>

    <div class="detail">
      <h5>{{ langContent(item.item_name, item.item_name_ar) }}</h5>

      <p v-if="item['extraOptions'] && item['extraOptions'].length > 0">
        {{ getExtraOptionText(item) }}
      </p>

      <div class="price">
         {{ toPrice(item.qty * item.item_price) }}
        <!-- toPrice todo -->
        
        <!-- v-if="item.track_quantity == false || item.stock_qty > 0 " -->
        <div class="cart-button-wrapper">
          <!-- 
            :disabled="store.state.cart[cart_item_id].qty == 1" -->
          <button class="btn-minus-cart" @click.stop="minusCartItem(cart_item_id)" 
            v-if="store.state.cart[cart_item_id]">
            <img src="../assets/icons/minus.svg" />
          </button>
          <span class="count" v-if="store.state.cart[cart_item_id]">
            {{ store.state.cart[cart_item_id].qty }}
          </span>
          <!-- todo: 
            :disabled="store.state.cart[cart_item_id] && item.track_quantity && item.stock_qty == store.state.cart[cart_item_id].qty"-->
          <button class="btn-add-cart" @click.stop="plusCartItem(cart_item_id, item)">
            <img src="../assets/icons/add.svg" />
          </button>
        </div>
      </div>
    </div>

    <div class="clearfix"></div>
  </div>
</template>
  
<script setup lang="ts">
import { toPrice } from '@/pipes/price';
import { plusCartItem, minusCartItem } from '@/services/CartService';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import DetailPage from '@/views/products/DetailPage.vue';
import { IonImg, modalController } from '@ionic/vue';

defineProps(['item', 'cart_item_id']);

function getExtraOptionText(item) {
   
  const options = [];

  for (const extraOption of item['extraOptions']) {
    options.push(langContent(extraOption.extra_option_name, extraOption.extra_option_name_ar));
  }

  return options.join(", ");
}
  
function onItemImageError(item) {
  item.itemImage = null;
}

async function onItemSelect(item) {
  
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
  //router.push('/item/' + item['slug']);
}

</script>
  
<style lang="scss" scoped>
.cart-item {
  padding: 12px 0;
}

ion-img {
  display: block;
  width: 72px;
  height: 72px;
  border-radius: 20px;
  float: var(--start);
  margin-inline-end: 12px;
  overflow: hidden;
}

.detail {
  float: var(--start);
  width: calc(100% - 112px);
  position: relative;

  h5 {
    color: var(--ion-color-dark);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.4px;
    margin-bottom: 0px;
    margin-top: 0px;
  }

  p {
    color: var(--ion-color-medium);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 12px;
    margin-top: 4px;
  }

  .price {
    color: var(--ion-color-primary);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.4px;
    /* 140% */

    .special-price {
      color: #8F8F8F;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 20px;
      /* 142.857% */
      text-decoration: line-through;
      text-decoration-line: strikethrough;
    }
  }
  .cart-button-wrapper {
  border-radius: 16px;
  background: var(--ion-color-primary-tint, #F6F5FF);
  position: absolute;
  right: 0px;
  bottom: 4px;
  padding: 4px;

  .count {
    color: var(--ion-color-dark-shade, #1A1A1A);
    text-align: center; 
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px; /* 157.143% */
    float: var(--start);
    width: 32px;
    vertical-align: middle;
    padding-top: 7px;
  }

  .btn-minus-cart,
  .btn-add-cart {
    width: 36px;
    height: 36px;
    padding: 8px;
    flex-direction: column;
    align-items: flex-start;
    border-radius: 12px;
  }

  .btn-minus-cart {
    float: var(--start);
    background-color: var(--ion-color-primary-contrast);
  }

  .btn-add-cart {
    float: var(--end);
    background-color: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast)
  }
}

}

[dir="rtl"] {
  .cart-button-wrapper,
  .btn-add-cart {
    left: 0;
    right: auto;
  } 
}

</style>
   