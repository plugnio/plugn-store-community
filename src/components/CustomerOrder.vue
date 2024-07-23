
<template>
    <div @click="viewOrder(order)" tappable  class="customer-order" v-if="order">

        <div class="details">
            <h5>{{ toPrice(order.total_price, order.currency_code, order.currency_rate) }}</h5>
            <p>{{ $t('{count} items', { count: order.orderItems.length  }) }} · 
                <span v-if="format(new Date(order.order_created_at), 'yyyy') == format(new Date(), 'yyyy')">
                    {{ formatDate(order.order_created_at, 'EEEE, LLL d') }}
                </span>
                <span v-if="format(new Date(order.order_created_at), 'yyyy') != format(new Date(), 'yyyy')">
                    {{ formatDate(order.order_created_at, 'EEEE, LLL d yyyy') }}
                </span>
            
            </p>

            <ion-badge :color="order.order_status == 4? 'success': 'warning'">
                {{ langContent(order.orderStatusInEnglish, order.orderStatusInArabic) }}
            </ion-badge> 
        </div>

        <div class="images">
            <template v-for="index of [0, 1, 2].slice(0, order.orderItems.length)" :key="index">
                <ion-img :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' + store.state.restaurant_uuid + '/items/' + order.orderItems[index].itemImage.product_file_name" @ionError="onItemImageError(order.orderItems[index])" v-if="order.orderItems[index].itemImage"></ion-img>
                
                <ion-img  v-if="!order.orderItems[index].itemImage && store.state.store.logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"></ion-img>

                <ion-img v-if="!order.orderItems[index].itemImage && !store.state.store.logo" class="store-logo" 
                    src="@/assets/icons/store.svg"></ion-img>

            </template>
            <span class="count" v-if="order.orderItems.length > 3">
                +{{ order.orderItems.length - 3 }}
            </span>
        </div>

        <div class="clearfix"></div>
    </div>

    <div class="customer-order" v-if="!order">

        <div class="details">
            <h5><IonSkeletonText :animated="true"></IonSkeletonText></h5>
            <p><IonSkeletonText :animated="true"></IonSkeletonText></p>  

            <IonSkeletonText :animated="true" class="badge"></IonSkeletonText>
        </div>

        <div class="images">
            <IonSkeletonText :animated="true"></IonSkeletonText>
        </div>

        <div class="clearfix"></div>
    </div>

</template>
  
<script setup lang="ts">
import { toPrice } from '@/pipes/price';
import router from '@/router';
import { formatDate, langContent } from '@/services/TranslateService';
import store from '@/store';
import { IonBadge, IonImg, IonSkeletonText } from '@ionic/vue';
import { format } from 'date-fns';

defineProps(['order']);

function onItemImageError(item) {
  item.itemImage = null;
}

function viewOrder(order) {
    router.push('/order/' + order.order_uuid);
}
</script>
  
<style lang="scss" scoped>
.customer-order { 
    width: 100%;
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    margin-bottom: 14px;

    h5 {
        color: #000;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        letter-spacing: -0.32px;
        margin-bottom: 2px;
        margin-top: 0;
        
        ion-skeleton-text {
            width: 150px;
        }
    }

    p {
        color: var(--ion-color-medium-shade, #707070);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-top: 0;
        margin-bottom: 12px;
        /* 157.143% */

        ion-skeleton-text {
            width: 250px;
        }
    }

    ion-badge {
        font-size: 12px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        padding: 4px 12px;
        justify-content: center;
        align-items: center;
        gap: 8px;
        border-radius: 16px;
    }

    ion-badge[color="warning"] {
        color: var(--ion-color-warning-shade, #E99C30);
        background: var(--ion-color-warning-tint, #FFF7EB);
    }

    ion-badge[color="success"] {
        color: var(--ion-color-success, #25BA69);
        background: var(--ion-color-success-contrast, #F2FDF7);
    }

    .badge {
        border-radius: 16px;
        width: 80px;
        height: 20px;
    }

    .details {
        float: var(--start);
        width: calc(100% - 140px);
        position: relative;
    }

    .images {
        float: var(--end);

        ion-skeleton-text,
        .count,
        ion-img,
        img {
            width: 40px;
            height: 40px;
            flex-shrink: 0;
            margin-inline-start: -8px;
            border-radius: 20px; 
            border: 1px solid var(--ion-color-primary-shade, #F0F0F0); 
            float: var(--start);
            overflow: hidden;
        }

        .count {
            color: var(--ion-shades-neutral-n-7, #3D3D3D);
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            background: var(--ion-color-primary-contrast, #FFF);
            padding-top: 11px;
            text-align: center;
        }
    }
}
</style>