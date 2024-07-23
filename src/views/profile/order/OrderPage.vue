<template>
    <ion-page>
        <ion-header :translucent="true" class="no-border">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title v-if="order">
                    #{{ order.order_uuid }}
                    <ion-badge :color="order.order_status == 4 ? 'success' : 'warning'">
                        {{ langContent(order.orderStatusInEnglish, order.orderStatusInArabic) }}
                    </ion-badge>
                </ion-title>

                <ion-title v-if="!order">
                    <ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                </ion-title>

                <ion-buttons slot="end">
                      
                    <ion-button v-if="order && [0, 9, 5].indexOf(order.order_status) == -1"  @click="viewInvoice()">
                        <ion-icon :icon="documentTextOutline"></ion-icon> &nbsp; {{ $t("Invoice") }}
                    </ion-button>
                </ion-buttons>
                 
            </ion-toolbar>

        </ion-header>

        <ion-content :fullscreen="true">

            <template v-if="order">
 
                <div class="details order-info">

                    <h5 class="txt-date">{{ formatDate(order.order_created_at, 'EEEE, LLL d yyyy') }}</h5>
                    <p class="txt-time">
                        {{ formatDate(order.order_created_at, 'p') }} ·
                        {{ $t('{count} items', { count: order.orderItems.length }) }}</p>

                    <ion-list>

                        <ion-item>
                            <img slot="start" src="../../../assets/icons/file.svg" />
                            <ion-label>
                                <h4>
                                    {{ toPrice(order.total_price, order.currency_code, order.currency_rate) }}
                                    <span class="txt-method">
                                        <!-- <img src="../../../assets/images/knet.png" /> todo: logo of method-->
                                        {{ langContent(order.payment_method_name, order.payment_method_name_ar) }}
                                    </span>
                                </h4>
                            </ion-label>
                        </ion-item>

                        <div class="sep"></div>

                        <ion-item v-if="order.order_mode == 1">
                            <img slot="start" src="../../../assets/icons/location.svg" />
                            <ion-label>
                                <h5>{{ $t(order.unit_type) }}</h5>
                                <p>
                             
                                    <span v-if="order.office">
                                        {{ $t('Office no. {value}', { value: order.office }) }}, 
                                    </span>
                                    <span v-if="order.house_number">
                                        {{ $t('House no. {value}', { value: order.house_number }) }}, 
                                    </span>
                                    <span v-if="order.floor">
                                        {{ $t('Floor no. {value}', { value: order.floor }) }}, 
                                    </span>
                                    
                                    <span v-if="order.apartment">
                                        {{ $t('Apartment no. {value}', { value: order.apartment }) }}, 
                                    </span>
                                    
                                    <span v-if="order.building">
                                        {{ $t('{value} Building', { value: order.building }) }}, 
                                    </span>
                                    
                                    <span v-if="order.avenue">
                                        {{ $t('{value} Avenue', { value: order.avenue }) }}, 
                                    </span>
                                    
                                    <span v-if="order.address_1">{{ order.address_1 }}, </span>
                                    <span v-if="order.address_2">{{ order.address_2 }}, </span>
                                    <span v-if="order.street">{{ order.street }}, </span>
                                    <span v-if="order.block">{{ order.block }}, </span>
                                    <span v-if="order.postalcode">{{ order.postalcode }}, </span>

                                    <span v-if="order.area">
                                        {{ langContent(order.area.area_name, order.area.area_name_ar) }}, </span>

                                    <span v-if="order.area && order.area.city">
                                    {{ langContent(order.area.city.city_name, order.area.city.city_name_ar) }}, </span>
                                    
                                    <span v-if="(!order.area || !order.area.city) && order.city">
                                        {{ order.city }}, 
                                    </span>
                                    
                                    <span v-if="order.state">{{ order.state.name }}, 
                                    </span>

                                    <span v-if="order.country">{{ langContent(order.country.country_name,
                                        order.country.country_name_ar) }}</span>

                                    <template v-if="order.special_directions">
                                        <br /> {{ order.special_directions }}
                                    </template>     
                                </p>
                            </ion-label>
                        </ion-item>

                        <ion-item v-if="order.order_mode == 2">
                            <img slot="start" src="../../../assets/icons/location.svg" />
                            <ion-label>
                                <h5>{{ $t('Pickup from') }}</h5>
                                <p> {{ langContent(order.pickupLocation.business_location_name,
                                    order.pickupLocation.business_location_name_ar) }}</p>
                            </ion-label>
                        </ion-item>

                        <ion-item v-if="order.estimated_time_of_arrival">
                            <img slot="start" src="../../../assets/icons/time.svg" />
                            <ion-label>
                                <h5>{{ $t("Delivery Time") }}</h5>
                                <p>
                                    {{ formatDate(order.estimated_time_of_arrival, 'EEEE, LLL d yyyy p') }}
                                    <span v-if="order.scheduled_time_to">
                                        - {{ formatDate(order.scheduled_time_to, 'EEEE, LLL d yyyy p') }}
                                    </span>
                                </p>
                            </ion-label>
                        </ion-item>

                        <ion-item v-if="order.order_instruction">
                            <img slot="start" src="../../../assets/icons/user.svg" />
                            <ion-label>
                                <h5>{{ $t("Delivery Instructions") }}</h5>
                                <p>{{ order.order_instruction }}</p>
                            </ion-label>
                        </ion-item>
                    </ion-list>

                </div>

                <div class="items">

                    <div class="item-heading">
                        <h4>{{ $t('{count} items', { count: order.orderItems.length }) }}</h4>
                        <!-- <button>Reorder</button>-->
                        <div class="clearfix"></div>
                    </div>

                    <ion-list>

                        <!-- :class="{ tappable: orderItem.item }" @click="orderItem.item && onItemSelect(orderItem.item)"-->
                        <ion-item v-for="(orderItem, index) of order.orderItems" :key="index" class="order-item">
                            <span slot="start" class="count">{{ orderItem.qty }}x</span>

                            <ion-img slot="start"
                                :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' + store.state.restaurant_uuid + '/items/' + orderItem.itemImage.product_file_name"
                                @ionError="onItemImageError(orderItem)" v-if="orderItem.itemImage"></ion-img>

                            <ion-img slot="start" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/'
                                + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"
                                v-if="!orderItem.itemImage && store.state.store.logo"></ion-img>

                            <ion-img v-if="!orderItem.itemImage && !store.state.store.logo" class="store-logo"
                                src="@/assets/icons/store.svg"></ion-img>

                            <ion-label>
                                <h4>
                                    {{ langContent(orderItem.item_name, orderItem.item_name_ar) }}
                                    <span class="price">{{ toPrice(orderItem.item_price, order.currency_code,
                                        order.currency_rate) }}</span>
                                </h4>
                                
                                <p v-if="orderItem['orderItemExtraOptions'] && orderItem['orderItemExtraOptions'].length > 0">
                                    {{ getExtraOptionText(orderItem['orderItemExtraOptions']) }}
                                </p>
                            </ion-label>
                        </ion-item>

                        <div class="sep"></div>

                        <div class="total-wrapper">

                            <p>{{ $t("Subtotal") }} <span>{{ toPrice(order.subtotal, order.currency_code,
                                order.currency_rate) }}</span>
                            </p>

                            <p v-if="order.delivery_fee > 0">{{ $t("Delivery") }} <span>{{ toPrice(order.delivery_fee,
                                order.currency_code, order.currency_rate) }}</span></p>

                            <p class="txt-discount" v-if="order.voucher_discount > 0">{{ $t("Discount") }} <span>-{{
                                toPrice(order.voucher_discount, order.currency_code, order.currency_rate) }}</span></p>

                            <div class="sep"></div>

                            <p class="txt-total"><b>{{ $t("Grand Total") }}</b><span><b>{{ toPrice(order.total_price,
                                order.currency_code, order.currency_rate) }}</b></span></p>
                        </div>

                    </ion-list>

                </div>

            </template>

            <template v-if="loading">

                <div class="details">

                    <h5 class="txt-date"><ion-skeleton-text :animated="true" style="width: 240px;"></ion-skeleton-text></h5>
                    <p class="txt-time">
                        <ion-skeleton-text :animated="true" style="width: 340px;"></ion-skeleton-text>
                    </p>

                    <ion-list>

                        <ion-item>
                            <img slot="start" src="../../../assets/icons/file.svg" />
                            <ion-label>
                                <h4>
                                    <ion-skeleton-text  style="width: 240px;" :animated="true"></ion-skeleton-text>
                                </h4>
                            </ion-label>
                        </ion-item>

                        <div class="sep"></div>

                        <ion-item>
                            <img slot="start" src="../../../assets/icons/location.svg" />
                            <ion-label>
                                <h5><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text></h5>
                                <p>
                                    <ion-skeleton-text  style="width: 240px;" :animated="true"></ion-skeleton-text>
                                    <ion-skeleton-text  style="width: 340px;" :animated="true"></ion-skeleton-text>
                                    <ion-skeleton-text  style="width: 140px;" :animated="true"></ion-skeleton-text>
                                    <ion-skeleton-text  style="width: 280px;" :animated="true"></ion-skeleton-text>
                                </p>
                            </ion-label>
                        </ion-item>
 
                        <ion-item>
                            <img slot="start" src="../../../assets/icons/time.svg" />
                            <ion-label>
                                <h5>{{ $t("Delivery Time") }}</h5>
                                <p>
                                    <ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                                </p>
                            </ion-label>
                        </ion-item>

                        <ion-item>
                            <img slot="start" src="../../../assets/icons/user.svg" />
                            <ion-label>
                                <h5>{{ $t("Delivery Instructions") }}</h5>
                                <p><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text></p>
                            </ion-label>
                        </ion-item>
                    </ion-list>

                </div>

                <div class="items">

                    <div class="item-heading">
                        <h4><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text></h4>
                        <!-- <button>Reorder</button>-->
                        <div class="clearfix"></div>
                    </div>

                    <ion-list>

                        <ion-item>
                            <span slot="start" class="count">x</span>

                            <ion-skeleton-text :animated="true" class="img-skeleton"></ion-skeleton-text>

                            <ion-label>
                                <h4>
                                    <ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                                </h4>
                            </ion-label>
                        </ion-item>
                        
                        <ion-item>
                            <span slot="start" class="count">x</span>

                            <ion-skeleton-text :animated="true" class="img-skeleton"></ion-skeleton-text>

                            <ion-label>
                                <h4>
                                    <ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                                </h4>
                            </ion-label>
                        </ion-item>

                        <ion-item>
                            <span slot="start" class="count">x</span>

                            <ion-skeleton-text :animated="true" class="img-skeleton"></ion-skeleton-text>

                            <ion-label>
                                <h4>
                                    <ion-skeleton-text :animated="true" style="width: 240px;"></ion-skeleton-text>
                                </h4>
                            </ion-label>
                        </ion-item>

                        <div class="sep"></div>

                        <div class="total-wrapper">

                            <p><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                            </p>
                            
                            <p><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                            </p>
                            
                            <p><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                            </p>
 
                            <div class="sep"></div>

                            <p><ion-skeleton-text :animated="true"  style="width: 240px;"></ion-skeleton-text>
                            </p>
                        </div>

                    </ion-list>

                </div>

            </template>

            <div class="no-data" v-if="!loading && !order">

                <img src="@/assets/icons/empty-box.svg" />

                <h5>{{ $t("We could not find your order!") }}</h5>

                <p>{{ $t("Please check if order/invoice id is corrent.") }}</p>

                <router-link to="/" class="btn">
                    {{ $t("Home") }}
                </router-link>
            </div>

        </ion-content>
        
        <!-- abandoned checkout or failed payment or no payment initiated -->
        <ion-footer class="having-single-button" v-if="order && 
            (
                order.order_status == 9 || 
                ( 
                    order.payment_method_id != 7 && order.payment_method_id != 3 && 
                    (
                        !order.payment || 
                        order.payment.payment_current_status != 'CAPTURED'
                    ) 
                )
            )">
            <ion-toolbar>
                
                <router-link  :to="'/confirm/' + order.order_uuid" class="btn">
                    <button>
                        {{ $t("Complete payment") }}
                    </button>
                </router-link>   

            </ion-toolbar>
        </ion-footer>

    </ion-page>
</template>
<script setup  lang="ts">
import { IonLabel, IonItem, IonList, IonIcon, IonFooter, IonButton, IonBackButton, IonButtons, IonContent, IonHeader, 
    IonSkeletonText, IonPage, IonTitle, IonToolbar, onIonViewDidEnter, IonBadge, modalController } from '@ionic/vue';
import { chevronBack, documentTextOutline } from 'ionicons/icons';
import { toPrice } from '@/pipes/price';
import store from '@/store';
import { IonImg } from '@ionic/vue';
import { ref } from 'vue';
import router from '@/router';
import { getOrderDetail } from '@/services/OrderService';
import { purchaseEventFacebookPixil, purchaseEventSnapchatPixil, trackView } from '@/services/AnalyticsService';
import { formatDate, langContent } from '@/services/TranslateService';
import DetailPage from '@/views/products/DetailPage.vue';

const id = router.currentRoute.value.params['id'];

const order = ref(null);
const loading = ref(true);

function viewInvoice() {
    /*downloadInvoice().then(res => {

    });*/
    const url = process.env.VUE_APP_ENDPOINT + '/order/download-invoice/' + id;
    window.open(url, "_blank");
}

onIonViewDidEnter(() => {

    trackView('order-detail-page');

    loading.value = true;

    getOrderDetail(id).then(res => {

        loading.value = false;

        order.value = res.body;

        if (window.location.pathname.includes('/payment-success')) {

            if (store.state.store.snapchat_pixil_id)
                purchaseEventSnapchatPixil(order.value.total_price,
                    store.state.store.currency.code);

            if (store.state.store.facebook_pixil_id)
                purchaseEventFacebookPixil(order.value.total_price);
        }
    }).catch((e) => {
        loading.value = false;
    });
})

function getExtraOptionText(extraOptions) {
   
   const options = [];
 
   for (const extraOption of extraOptions) {
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

/*estimated_time_of_arrival = order.estimated_time_of_arrival ?
            order.estimated_time_of_arrival.replace(/\s/g, "T") : null;

          scheduled_time_to = order.scheduled_time_to ?
            order.scheduled_time_to.replace(/\s/g, "T") : null;*/

</script>
<style lang="scss" scoped>
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
    top: 5px;
    position: relative;
    margin-inline-start: 12px;
}

ion-badge[color="warning"] {
    color: var(--ion-color-warning-shade, #E99C30);
    background: var(--ion-color-warning-tint, #FFF7EB);
}

ion-badge[color="success"] {
    color: var(--ion-color-success, #25BA69);
    background: var(--ion-color-success-contrast, #F2FDF7);
}

.order-info ion-label {
    white-space: normal;
}

.details,
.items {
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    overflow: hidden;
    padding-bottom: 8px;
    margin-bottom: 20px;

    .txt-date {
        color: var(--ion-color-dark-shade, #1A1A1A);
        text-align: center;
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: normal;
        margin-bottom: 4px;

        ion-skeleton-text {
            margin: auto;
        }
    }

    .txt-time {
        margin-top: 0;
        color: var(--ion-color-medium-shade, #707070);
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-bottom: 0;
        /* 157.143% */
        
        ion-skeleton-text {
            margin: auto;
        }
    }

    .sep {
        width: calc(100% - 32px);
        height: 1px;
        background: #f0f0f0;
        margin: auto;
    }

    ion-list {
        padding: 0;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
        gap: 12px;

        ion-item {
            --inner-border-width: 0;

            margin: 8px 0;

            ion-label {
                margin: 0;
            }

            img {
                margin-inline-end: 12px;
            }

            .count {
                color: var(--ion-color-medium-shade, #707070);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                /* 157.143% */
                margin-inline-end: 8px;
            }

            .price {
                color: var(--ion-color-medium-shade, #707070);
                text-align: var(--end);
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                /* 150% */
                float: var(--end);
            }

            h4 {
                color: var(--ion-color-dark-shade, #1A1A1A);
                font-size: 16px;
                font-style: normal;
                font-weight: 400;
                line-height: 24px;
                /* 150% */

                .txt-method {
                    float: var(--end);

                    img {
                        width: 22px;
                        height: 22px;
                        flex-shrink: 0;
                        float: var(--start);
                        margin-inline-end: 9px;
                    }
                }
            }

            h5 {
                color: var(--ion-color-dark-shade, #1A1A1A);
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 22px;
                margin: 0;
                /* 157.143% */
            }

            p {
                color: var(--ion-color-medium-shade, #707070);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                margin: 0;
                line-height: 22px;
                /* 157.143% */
            }
        }

        .order-item {
            margin: 8px 0 12px 8px;
        }
    }
}

.items {

    .item-heading {
        margin: 16px 16px 5px 16px;

        h4 {
            float: var(--start);
            margin: 0;
            color: var(--ion-color-dark-shade, #1A1A1A);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            /* 150% */
        }

        button {
            display: flex;
            padding: 6px 10px;
            flex-direction: column;
            align-items: flex-start;
            border-radius: 10px;
            background: var(--ion-color-primary-tint, #F6F5FF);
            color: var(--ion-color-primary, #453E9A);
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            float: var(--end);
        }
    }

    ion-img,
    img {
        width: 32px;
        height: 32px;
        border-radius: 20px;
        margin-inline-end: 8px;
        overflow: hidden;
    }
}

.total-wrapper {
    padding: 0 16px 8px 16px;

    p {
        color: var(--ion-color-dark-shade, #1A1A1A);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        /* 150% */
        margin: 12px 0 0 0;

        span {
            color: var(--ion-color-medium-shade, #707070);
            text-align: var(--end);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            /* 150% */
            float: var(--end);
        }

    }

    .txt-discount span,
    .txt-discount {
        color: var(--ion-color-warning-shade, #E99C30);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 24px;
        /* 150% */
    }

    .sep {
        margin-top: 12px;
        width: 100%;
    }

    .txt-total span {
        color: var(--ion-color-dark-shade, #1A1A1A);
    }
}</style>
