
<template>
  <div :class="'store-item ' + layout" tappable @click="onItemSelect(item)" v-if="item">
    
    <!-- todo: sold out for variant -->
    <ion-badge color="secondary" v-if="item.item_type == 1 && item.track_quantity == true && 
      item.stock_qty == 0 " class="sold_out">
      {{ $t('Sold out') }}
    </ion-badge>
    
    <ion-img loading="lazy" v-if="item.itemImage" @ionError="onItemImageError(item)"
      :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_200/restaurants/' + store.state.restaurant_uuid + '/items/' + item.itemImage.product_file_name"></ion-img>
 
    <ion-img v-if="!item.itemImage && store.state.store.logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"></ion-img>

    <ion-img v-if="!item.itemImage && !store.state.store.logo" class="store-logo" 
                    src="@/assets/icons/store.svg"></ion-img>

    <div class="detail">
      
      <h5>{{ langContent(item.item_name, item.item_name_ar) }}</h5>

      <div v-if="layout == 'list' && store.state.store.storeTheme?.show_description_in_list" class="item-description">
        <span v-if="!store.state.language || store.state.language.code != 'ar'" v-html="item.item_description"></span> 
        <span v-if="store.state.language && store.state.language.code == 'ar'" v-html="item.item_description_ar"></span> 
      </div>

      <div class="clearfix"></div>

      <div class="price">

        <template v-if="item.item_type == 1">
          {{ toPrice(item.item_price) }}
          <div class="special-price" v-if="item.compare_at_price">
            {{ toPrice(item.compare_at_price) }}
          </div>
        </template>

        <div v-if="item.item_type == 2 && layout == 'list'">
          {{ $t('Price on selection') }}
        </div>
 

        <!-- todo: only if stock v-if="item.item_type != 1" || item.track_quantity == false || item.stock_qty > 0 -->
        
          <!--
            todo: validation based disable status 
              :disabled="
                store.state.cart[item.item_uuid] && item.track_quantity && (item.stock_qty == 0 || item.stock_qty == store.state.cart[item.item_uuid].qty)">
          -->
          <div class="cart-button-wrapper" v-if="layout == 'grid'">
            <button class="btn-add-cart" @click.stop="(item.item_type == 2 || item.options.length > 0) ? onItemSelect(item) : addToCart(item)">
              <span v-if="item.options.length == 0">{{ $t('Add to cart') }}</span>
              <span v-if="item.options.length > 0">{{ $t('Price on selection') }} </span>
            </button>
          </div>

          <!-- todo: ability to show count for item with option/ variant -->

          <div class="cart-button-wrapper" v-if="layout == 'list'">
            <!-- 
              :disabled="store.state.cart[item.item_uuid].qty == 1" -->

            <button class="btn-minus-cart" @click.stop="minusCartItem(item.item_uuid)" 
              v-if="store.state.cart[item.item_uuid]">
              <img src="../assets/icons/minus.svg" />
            </button>
            <span class="count" v-if="store.state.cart[item.item_uuid]">
              {{ store.state.cart[item.item_uuid].qty }}
            </span>
            <!-- todo: 
              :disabled="store.state.cart[item.item_uuid] && item.track_quantity && item.stock_qty == store.state.cart[item.item_uuid].qty"-->
            <button class="btn-add-cart" @click.stop="(item.item_type == 2 || item.options.length > 0) ? onItemSelect(item) : addToCart(item)">
              <img src="../assets/icons/add.svg" /> 
            </button>
          </div> 

      </div>

    </div>

    <div class="clearfix"></div>
  </div>
 
  <div :class="'store-item ' + layout" v-if="!item">
    
    <IonSkeletonText :animated="true" class="image"></IonSkeletonText>

    <div class="detail">
       
      <IonSkeletonText :animated="true" class="title" style="width: 150px;"></IonSkeletonText>

      <div v-if="layout == 'list'" style="margin: 15px auto;">
        <IonSkeletonText :animated="true" class="subtitle" style="width: 350px;"></IonSkeletonText>
        <IonSkeletonText :animated="true" class="subtitle" style="width: 180px;"></IonSkeletonText>
        <IonSkeletonText :animated="true" class="subtitle" style="width: 250px;"></IonSkeletonText>
      </div>

      <div class="clearfix"></div>

      <div class="price">
        <IonSkeletonText :animated="true" class="price" style="width: 150px;"></IonSkeletonText>
      </div>

    </div>

    <div class="clearfix"></div>
  </div>
   
</template>

<script setup lang="ts">
import { IonBadge, IonImg, modalController, IonSkeletonText } from '@ionic/vue';
import store from '@/store';
import { toPrice } from '@/pipes/price';
import { addToCart, minusCartItem } from '@/services/CartService';
import DetailPage from '@/views/products/DetailPage.vue';
import { langContent } from '@/services/TranslateService';

defineProps(['item', 'layout']);

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

.sold_out {
  position: absolute;
}

.list .cart-button-wrapper {

  border-radius: 16px;
  background: var(--ion-color-primary-tint, #F6F5FF);
  padding: 4px;
  float: var(--end);

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

.grid {
  .btn-add-cart {
    background-color: var(--ion-color-primary);
    color: var(--ion-color-primary-contrast);
    width: 100%;
    height: 32px;
    padding: 6px; 
    border-radius: 10px;
    margin-top: 12px;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  .price {
    margin-top: 8px;
    min-height: 87px;
  }
}

.store-item {
  padding: 12px 16px;
}

.image {
  aspect-ratio: 1 /1;
}

.image,
ion-img {
  display: block;
  //min-height: 100px;
  border-radius: 20px;
  overflow: hidden;
  height: 100%;
  aspect-ratio: 1 /1;
}

.grid {
  .image,
  ion-img {
    width: 100%; 
  }

  p {
    display: none;
  }
}

.list {
 // width: 100%;

  .image,
  ion-img {
    width: 100px;
    float: var(--start);
    margin-inline-end: 12px;
  }

  .detail {
    float: var(--start);
    width: calc(100% - 112px);

    .item-description {
      min-height: 40px;
    }
  }
}

.detail {
  position: relative;

  h5 {
    color: var(--ion-color-dark);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.4px;
    margin-bottom: 0px;
    margin-top: 0px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    color: var(--ion-color-medium);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-bottom: 12px;
    margin-top: 4px;
    display: -webkit-box;
    max-width: 100%;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
}

.grid .detail {
  h5 {
    margin-top: 12px;
  }
}

[dir="rtl"] .list {
  .btn-add-cart {
    left: 0;
    right: auto;
  }
}
</style>
 <!-- 
TODO: 
on addin item to cart if have option, open detail page as modal else add to cart 
show message after adding it to cart 
grid/list view getting mess if some image contain different sized images 
-->