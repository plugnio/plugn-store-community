<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title>
                   {{ $t("Checkout") }} 
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <template v-if="props.order">

                <template v-if="!props.order.order_uuid">
                    <div class="mode-wrapper" v-if="store.state.store.supportDelivery && store.state.store.supportPickup">
                        <button :class="{ active: props.order.order_mode == 1 }" @click="updateMode(1)">
                            {{ $t("Delivery") }} </button>
                        <button :class="{ active: props.order.order_mode == 2 }" @click="updateMode(2)">
                            {{ $t("Pickup") }} </button>
                    </div>

                    <template v-if="props.order.order_mode == 2">

                        <ion-list>
                        
                            <ion-item tappable @click="!props.order.order_uuid && choosePickupLocation()">
                                <img slot="start" src="../../assets/icons/location.svg" />
                                <ion-label v-if="!props.order.businessLocation">
                                    {{ $t("Select Pickup Location") }}
                                </ion-label>

                                <ion-label v-if="props.order.businessLocation">
                                    <h5>{{ langContent(props.order.businessLocation['business_location_name'], props.order.businessLocation['business_location_name_ar']) }}</h5>
                                    <p v-if="props.order.businessLocation.address">{{ props.order.businessLocation.address }}
                                    </p>

                                    <p v-if="props.order.businessLocation['country']">{{
                                        langContent(props.order.businessLocation['country']['country_name'], props.order.businessLocation['country']['country_name_ar']) }}</p>
                                </ion-label>
                                <a v-if="props.order.businessLocation" slot="end" target="_blank"
                                    :href="'https://maps.google.com/?q=' + props.order.businessLocation.longitude + ',' + props.order.businessLocation.longitude">
                                    <ion-icon :icon="openOutline"></ion-icon>
                                </a>
                            </ion-item>

                            <div class="sep"></div>

                            <ion-item>
                                <img slot="start" src="../../assets/icons/user.svg" />
                                <ion-label tappable v-if="!store.state.customerInfo || !store.state.customerInfo.phone_number" @click="goToCustomerInfoPage()">
                                    {{ $t("Add Contact Details") }}
                                </ion-label>

                                <template v-if="store.state.customerInfo.phone_number">
                                    <ion-label v-if="store.state.customerInfo">
                                        <h5>{{ $t("Contact Info") }}</h5>
                                        <p> {{ store.state.customerInfo.phone_number }}   </p>
                                        <p> {{ store.state.customerInfo.email }}   </p>
                                        <p> {{ store.state.customerInfo.customer_name }}   </p> 
                                    </ion-label>
                                    <button v-if="store.state.customerInfo && !store.state.isLogin" slot="end" @click="goToCustomerInfoPage()">
                                        {{ $t("Change") }}
                                    </button>
                                </template>
                            </ion-item>
    
                        </ion-list>

                    </template>

                    <template v-if="props.order.order_mode == 1">

                        <p v-if="props.deliveryNotAvailable" class="alert alert-warning">
                            {{ $t("Delivery not available for selected location") }}
                        </p>

                        <ion-item class="form-field field-area" tappable detail @click="goToDeliveryToPage()" v-if="!store.state.customerAddress.unit_type">
                            <img slot="start" src="../../assets/icons/location.svg" />
                            <ion-label>
                                <h5>{{ $t("Select Location") }}</h5>
                            </ion-label>
                        </ion-item>

                        <ion-list v-if="store.state.customerAddress && store.state.customerAddress.unit_type">
                            <ion-item>
                                <img slot="start" src="../../assets/icons/location.svg" />
                                <ion-label>
                                    <h5 v-if="store.state.customerAddress.unit_type == 'house'">{{ $t("House") }}</h5>
                                    <h5 v-if="store.state.customerAddress.unit_type == 'office  '">{{ $t("Office") }}</h5>
                                    <h5 v-if="store.state.customerAddress.unit_type == 'apartment'">{{ $t("Apartment") }}</h5>

                                    <p>
                                        <span v-if="store.state.customerAddress.building">{{
                                            store.state.customerAddress.building }}, </span>

                                        <span v-if="store.state.customerAddress.block">{{ store.state.customerAddress.block }},
                                        </span>
                                        <span v-if="store.state.customerAddress.street">{{ store.state.customerAddress.street
                                        }}, </span>
                                        <span v-if="store.state.customerAddress.avenue">{{ store.state.customerAddress.avenue
                                        }}, </span>
                                        <span v-if="store.state.customerAddress.address_1">{{
                                            store.state.customerAddress.address_1 }}, </span>
                                        <span v-if="store.state.customerAddress.address_2">{{
                                            store.state.customerAddress.address_2 }}, </span>

                                        <br />

                                        <span v-if="store.state.customerAddress.area">{{
                                            langContent(store.state.customerAddress.area.area_name, store.state.customerAddress.area.area_name_ar) }}, </span>
                                        
                                        <span v-if="store.state.customerAddress.city">{{
                                            langContent(store.state.customerAddress.city.city_name, store.state.customerAddress.city.city_name_ar) }}, </span>
                                        
                                        <span v-if="store.state.customerAddress.state">
                                            {{ store.state.customerAddress.state.name }}, </span>
                                        
                                        <span v-if="store.state.customerAddress.postalcode"> - {{
                                            store.state.customerAddress.postalcode }}, </span>

                                        <span v-if="store.state.customerAddress.country">{{
                                            langContent(store.state.customerAddress.country.country_name, store.state.customerAddress.country.country_name_ar) }}</span>
                                    </p>
                                </ion-label>
                                <button slot="end" v-if="!props.order.order_uuid" @click="goToDeliveryToPage()">
                                    {{ $t("Change") }}
                                </button>
                            </ion-item>

                            <div class="sep"></div>

                            <!-- todo:  && store.state.shippingMethod -->
                            <ion-item v-if="props.order.order_mode == 1 && store.state.shippingMethod.deliveryZone">

                                <img slot="start" src="../../assets/icons/time.svg" />
                                <ion-label>
                                    <h5>{{ $t("Delivery Time") }}</h5>
                                    <p>
                                        <template v-if="!props.order.is_order_scheduled">
                                            {{ toDuration(store.state.shippingMethod.deliveryZone.delivery_time, store.state.shippingMethod.deliveryZone.time_unit) }} 
                                        </template>

                                        <template v-if="props.order.is_order_scheduled">
                                            {{ formatDate(props.order.scheduled_time_start_from, 'E, dd MMM h:mm a') }}     
                                                -
                                            {{ formatDate(props.order.scheduled_time_to, 'h:mm a') }}   
                                        </template>

                                        <!--
                                        <template v-if="store.state.deliveryTime?.isOrderScheduled">
                                            {{ formatDate(store.state.deliveryTime.scheduledTimeStartFrom), 'E, dd MMM h:mm a') }}     
                                                -
                                            {{ formatDate(store.state.deliveryTime.scheduledTimeTo), 'h:mm a') }}   
                                        </template>-->

                                    </p>
                                </ion-label>

                                <button v-if="store.state.store.schedule_order" slot="end" @click="goToScheduleOrderPage()">
                                    {{ $t("Schedule") }}
                                </button>
                            </ion-item>

                            <div class="sep"></div>

                            <ion-item>
                                <img slot="start" src="../../assets/icons/user.svg" />
                                <ion-label>
                                    <h5>{{ $t("Delivery Instructions") }}</h5>
                                    <p v-if="store.state.customerAddress.delivery_instructions">{{ $t(store.state.customerAddress.delivery_instructions) }}</p>
                                </ion-label>
                                <button slot="end" v-if="!props.order.order_uuid" @click="goToDeliveryToPage()">
                                    {{ $t("Change") }} 
                                </button>
                            </ion-item>
                        </ion-list>
                    </template>
                </template>

                <h5 class="txt-title">{{ $t("Pay with") }}</h5>
                 
                <ion-radio-group :class="{ isSafari: props.isSafari }" @ion-change="onPaymentMethodChange($event)" v-model="props.order.payment_method_id" class="radio-group-payment-methods">
                    <ion-radio :id="'radio_' + paymentMethod.payment_method_code" mode="md" v-for="(paymentMethod, index) of props.paymentMethods" :key="index"
                       
                        :disabled="props.deliveryNotAvailable || !props.order ||
                            (
                                props.order.order_mode == 1 && (
                                    !store.state.customerAddress || 
                                    (
                                        !store.state.customerAddress.area_id && 
                                        !store.state.customerAddress.city_id && 
                                        !store.state.customerAddress.state_id
                                    )
                                )
                            ) ||
                            (
                                props.order.order_mode == 2 && 
                                (
                                    !props.order.business_location_id || 
                                    !store.state.customerInfo || 
                                    !store.state.customerInfo.phone_number
                                )
                            )"
                        :value="paymentMethod.payment_method_id" justify="start" labelPlacement="end">

                        <img alt="knet" v-if="paymentMethod.payment_method_code == 'kn'"
                            src="../../assets/icons/knet.jpg" />
 
                        <img src="../../assets/icons/card.svg"  v-if="paymentMethod.payment_method_code == 'credit-card'" />
                    
                        <svg v-if="['free-checkout', 'cash'].indexOf(paymentMethod.payment_method_code) > -1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.375 3.5C2.20172 3.5 1.25 4.45172 1.25 5.625V15.375C1.25 15.9386 1.47388 16.4791 1.8724 16.8776C2.27091 17.2761 2.81142 17.5 3.375 17.5H20.625C21.7983 17.5 22.75 16.5483 22.75 15.375V5.625C22.75 4.45172 21.7983 3.5 20.625 3.5H3.375ZM4.73206 5.5C4.67841 5.8717 4.50612 6.21875 4.23744 6.48744C3.96875 6.75612 3.6217 6.92841 3.25 6.98206V14.0179C3.6217 14.0716 3.96875 14.2439 4.23744 14.5126C4.50612 14.7812 4.67841 15.1283 4.73206 15.5H19.2679C19.3216 15.1283 19.4939 14.7812 19.7626 14.5126C20.0312 14.2439 20.3783 14.0716 20.75 14.0179V6.98227C19.9837 6.8726 19.3774 6.26627 19.2677 5.5H4.73206ZM12 8.5C11.4696 8.5 10.9609 8.71071 10.5858 9.08579C10.2107 9.46086 10 9.96957 10 10.5C10 11.0304 10.2107 11.5391 10.5858 11.9142C10.9609 12.2893 11.4696 12.5 12 12.5C12.5304 12.5 13.0391 12.2893 13.4142 11.9142C13.7893 11.5391 14 11.0304 14 10.5C14 9.96957 13.7893 9.46086 13.4142 9.08579C13.0391 8.71071 12.5304 8.5 12 8.5ZM9.17157 7.67157C9.92172 6.92143 10.9391 6.5 12 6.5C13.0609 6.5 14.0783 6.92143 14.8284 7.67157C15.5786 8.42172 16 9.43913 16 10.5C16 11.5609 15.5786 12.5783 14.8284 13.3284C14.0783 14.0786 13.0609 14.5 12 14.5C10.9391 14.5 9.92172 14.0786 9.17157 13.3284C8.42143 12.5783 8 11.5609 8 10.5C8 9.43913 8.42143 8.42172 9.17157 7.67157ZM5 10.5C5 9.94772 5.44772 9.5 6 9.5H6.008C6.56028 9.5 7.008 9.94772 7.008 10.5V10.508C7.008 11.0603 6.56028 11.508 6.008 11.508H6C5.44772 11.508 5 11.0603 5 10.508V10.5ZM17 10.5C17 9.94772 17.4477 9.5 18 9.5H18.008C18.5603 9.5 19.008 9.94772 19.008 10.5V10.508C19.008 11.0603 18.5603 11.508 18.008 11.508H18C17.4477 11.508 17 11.0603 17 10.508V10.5ZM17.7842 21.8159C12.7211 20.4405 7.49738 19.7457 2.25081 19.75C1.69853 19.7505 1.25045 19.3031 1.25 18.7508C1.24955 18.1985 1.6969 17.7505 2.24919 17.75C7.67362 17.7456 13.0745 18.4639 18.3092 19.886C18.359 19.8996 18.4067 19.8896 18.4457 19.8603C18.4833 19.8321 18.5 19.797 18.5 19.755V18.75C18.5 18.1977 18.9477 17.75 19.5 17.75C20.0523 17.75 20.5 18.1977 20.5 18.75V19.755C20.5 21.1867 19.1294 22.1822 17.7842 21.8159Z" fill="#E99C30"/>
                        </svg>
 
                        <img alt="mada" v-if="paymentMethod.payment_method_code == 'mada'"
                            src="../../assets/icons/mada.svg" />

                        <img class="payment-method-logo" alt="benefit" v-if="paymentMethod.payment_method_code == 'benefit'"
                            src="../../assets/icons/benefit.png" />

                        <img class="payment-method-logo" alt="sadad" v-if="paymentMethod.payment_method_code == 'sadad'"
                            src="../../assets/icons/sadad.png" />
 
                        <!--  todo: icons for Moyasar, Stripe, sadad -->
                        
                        {{ langContent(paymentMethod.payment_method_name, paymentMethod.payment_method_name_ar) }}
                    </ion-radio>
                </ion-radio-group>

                <div class="option-wrapper" v-if="!props.order.order_uuid">
                    <div class="discount-wrapper">
                        <img slot="start" src="../../assets/icons/discount.svg" />
                        <input :placeholder="$t('Enter discount coupon here')" v-model="props.promo_code" />

                        <span class="txt-applied"
                            v-if="props.order.voucher && props.order.voucher.code == props.promo_code">
                            <ion-icon src="../../assets/icons/check.svg"></ion-icon>
                            <span>{{ $t("Applied") }}</span>
                        </span>

                        <button @click="applyPromoCodeClicked()"
                            v-if="!props.order.voucher || props.order.voucher.code != props.promo_code"
                            :disabled="!props.promo_code || props.applyingPromoCode">

                            <ion-spinner v-if="props.applyingPromoCode"></ion-spinner>
                            <span v-if="!props.applyingPromoCode">{{ $t("Submit") }}</span>
                        </button>

                    </div>
                    <div class="sep"></div>
                    <!-- todo: show msg if set -->
                    <div class="gift-wrapper" @click="!props.order.gift_message && openGiftForm()"
                        :class="{ tappable: !props.order.gift_message }">
                        <img slot="start" src="../../assets/icons/gift.svg" />
                        <span>{{ $t("Make it a gift") }}</span>

                        <button tappable v-if="!props.order.gift_message">
                            <img slot="start" class="rotate-ar" src="../../assets/icons/chevron-right.svg" />
                        </button>

                        <div class="gift-details" v-if="props.order.gift_message">

                            <button class="btn-edit" @click="openGiftForm()">
                                {{ $t("Edit") }}
                            </button>

                            <p><b>{{ props.order.recipient_name }}</b></p>
                            <p>
                                <span dir="ltr">{{ props.order.recipient_phone_number }}</span>
                            </p>
                            <p class="message">{{ props.order.gift_message }}</p>
                            <!-- todo: {{ props.order.sender_name }} -->
                        </div>

                    </div>

                </div>

                <div class="total-wrapper">
                    <h5 class="txt-title">{{ $t("Payment summary") }}</h5>

                    <p>{{ $t("Cart total") }} <span>{{ toPrice(props.order.subtotal, props.order.currency_code,
                        props.order.currency_rate) }}</span></p>

                    <p v-if="props.order.delivery_fee > 0">{{ $t("Delivery fees") }}<span>{{ toPrice(props.order.delivery_fee,
                        props.order.currency_code, props.order.currency_rate) }}</span></p>

                    <p class="txt-discount" v-if="props.order.voucher_discount > 0">{{ $t("Discount") }} <span>-{{
                        toPrice(props.order.voucher_discount, props.order.currency_code, props.order.currency_rate)
                    }}</span></p>

                    <p><b>{{ $t("Total amount") }}</b><span><b>{{ toPrice(
                        props.order.subtotal + props.order.delivery_fee + props.order.tax - props.order.voucher_discount,
                        props.order.currency_code, props.order.currency_rate) }}</b></span></p>
                </div>
            </template>

            <p class="txt-terms" v-html="$t('order_terms', {
                    href: 'https://www.plugn.io/privacy-policy'
                })"> 
            </p>
        </ion-content>

        <ion-footer class="having-single-button">
            <ion-toolbar>
                <button @click="placeOrderClicked()" 
                    v-if="!props.showApplePay"
                    :disabled="props.deliveryNotAvailable || props.placingOrder || !props.order ||
                        !props.order.payment_method_id || 
                        (
                            props.order.order_mode == 1 && (
                                !store.state.customerAddress || 
                                (
                                    !store.state.customerAddress.area_id && 
                                    !store.state.customerAddress.city_id && 
                                    !store.state.customerAddress.state_id
                                )
                            )
                        ) ||
                        (
                            props.order.order_mode == 2 && 
                            (
                                !props.order.business_location_id || 
                                !store.state.customerInfo || 
                                !store.state.customerInfo.phone_number
                            )
                        )
                        ">
                    <ion-spinner v-if="props.placingOrder"></ion-spinner>
                    <span v-if="!props.placingOrder && (!props.order || !props.order.order_uuid)">{{ $t("Place order") }}</span>
                    <span v-if="!props.placingOrder && props.order && props.order.order_uuid">{{ $t("Submit") }}</span>
                </button>


                <div id="apple-pay-button" :class="{ active: props.showApplePay }">
                    
                    <!--
                    <button :disabled="props.applePayLoading" v-if="props.applePayLoading">
                        <ion-spinner :animated="true">
                        </ion-spinner>
                    </button>-->
                </div>

                <ion-spinner v-if="props.showApplePay && props.applePayLoading" slot="start"></ion-spinner>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup lang="ts">
import mixpanel from 'mixpanel-browser';
import { IonBackButton, IonButton, IonItem, IonLabel, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, modalController, onIonViewWillLeave, alertController, onIonViewDidEnter, IonFooter, IonList, IonSpinner, IonIcon, IonRadio, IonRadioGroup } from '@ionic/vue';
import { chevronBack, openOutline } from 'ionicons/icons';
import { reactive } from 'vue';

import { errorMessage } from '@/services/HTMLService';
import { purchaseEventFacebookPixil, purchaseEventSnapchatPixil, trackEvent, trackView } from '@/services/AnalyticsService';
import { placeDummyOrder, getOrderDetail, saveInstruction, loadPromoCodeData } from '@/services/OrderService';
import { getPaymentMethodOptions } from '@/services/PaymentService';
import { placeAnOrder } from '@/services/OrderService';
import { initiateCheckoutEventFacebookPixil } from '@/services/AnalyticsService';
import { applyPromoCodeData } from '@/services/OrderService';
import { getDeliveryZoneByLocation } from '@/services/DeliveryZoneService';
import { getBusinessLocaiton } from '@/services/StoreService';

import router from '@/router';
import store from '@/store';

import GiftPage from './GiftPage.vue';
import ShippingToPage from './ShippingToPage.vue';
import ScheduleOrderPage from './ScheduleOrderPage.vue';

import BusinessLocationPage from './BusinessLocationPage.vue';
import CustomerInfoPage from './CustomerInfoPage.vue';
import ModalNav from '@/components/ModalNav.vue';
import StripePage from './payment/StripePage.vue';
import MoyasarPage from './payment/MoyasarPage.vue';
import DeliveryToPage from './DeliveryToPage.vue';

import { toPrice } from '@/pipes/price';
import { toDuration } from '../../pipes/duration';

import { Order } from '@/models/order';
import { useI18n } from 'vue-i18n';
import { formatDate, langContent } from '@/services/TranslateService';
import { getAccount } from '@/services/AccountService';

declare let window;

const { render, ThemeMode, SupportedNetworks, Scope, Environment, Locale, ButtonType, Edges } =
  window.TapApplepaySDK
 
//todo: on address change/select/update update delivery info, 
//on order mode change same

const { t } = useI18n({ useScope: "global" });

const props = reactive({
    paymentMethods: [],
    savingInstruction: false,
    placingOrder: false,
    applyingPromoCode: false,
    loading: false,
    deliveryNotAvailable: false,

    payment_method: null,
    promo_code: null,
    order: null,
    order_uuid: null,
    token_id: null,
    source: null,
    bank_name: null,

    showApplePay: false,
    applePayLoading: false,
    applePayReady: false,

    isSafari: false
})

//send reminder email to customer for abandoned checkout 

onIonViewDidEnter(async () => {

    if(navigator.userAgent.includes('Safari') && !navigator.userAgent.includes('Chrome')){
        props.isSafari = true;
    }

    trackView('order-confirm-page');

    if(!store.state.store.enable_guest_checkout && !store.state.isLogin) {
        router.push('/email-login');
        return;
    }

    store.commit('setOrder', null);

    //for failed order 
    props.order_uuid = router.currentRoute.value.params['order_uuid'];

    //todo: if store closed + can't schedule redirect to home with message "store closed"

    if (store.state.cartLength == 0 && !props.order_uuid) {

        router.push('/cart');

        return;
    }

    //&& (!store.state.customerInfo || !store.state.customerInfo.email)
    if(store.state.isLogin) 
    {
        getAccount().then(res => { 
            store.commit('setCustomerInfo', {
                phone_number: res.customer_phone_number,
                country_code: res.country_code, 
                customer_name: res.customer_name,
                email: res.customer_email
            });
        });
    }

    if (props.order_uuid) {
        loadOrder();
    } else {
        let order = new Order;
        order.subtotal = store.state.cartTotal;
        order.delivery_fee = 0;//todo: based on location selected
        order.tax = 0;
        order.voucher_discount = 0;
        order.total_price = order.delivery_fee + order.tax + store.state.cartTotal - order.voucher_discount;
        order.currency_code = store.state.currency.code;
        order.currency_rate = store.state.currency.currency_rate;

        props.order = order;

        if (store.state.store.supportDelivery) {
 
            props.order.order_mode = 1;

            //todo: if location available calculate delivery cost, if not make sure delivery cost 
            // getting calculated on address change and in backend set delivery zone dynamically 
            //based on location 

        } else if (store.state.store.supportPickup) { 

            props.order.order_mode = 2;
            props.order.delivery_fee = 0;
            props.order.delivery_zone_id = null;
            props.order.delivery_time = null;

        } else {

            const alert = await alertController.create({
                header: t('Not supporting delivery and store pickup!'),
                message: t('There seems to be an issue with store configuration.'),
                buttons: [t('Okay')]
            });

            await alert.present();

            router.push('/cart');

            return;
        }
 
        //set default location 
        setOrderBusinessLocation(); 
    }

    // Track Page View via Analytics

    trackView('checkout-page');

    loadPaymentMethodData(); 

    /*if(!props.order.order_uuid) {
        initOrder();
    }*/

    //update tax + delivery fees 

    updateTotals();
});

            
function setOrderBusinessLocation() {
    if(store.state.businessLocations.length > 0) {
        props.order.business_location_id = store.state.businessLocations[0].business_location_id;
        props.order.businessLocation = store.state.businessLocations[0];
    } else {
        getBusinessLocaiton().then(res => {

            props.order.business_location_id = res[0].business_location_id;
            props.order.businessLocation = res[0];

            store.commit('setBusinessLocation', res);
        }).catch((e) => {
            console.error(e);
        }); 
    }
}

function updateMode(mode) {
    props.order.order_mode = mode;
 
    updateTotals();
}

function loadOrder() {

    getOrderDetail(props.order_uuid).then(async res => {
 
        props.order = res.body;

        //todo: test getting following values in api response

        props.payment_method = res.body.paymentMethod;

        props.promo_code = res.body.voucher?.code

        //set business location 
        props.order.businessLocation = props.order.pickupLocation;
        props.order.business_location_id = props.order.pickup_location_id;

        //set customer info 
        
        store.commit('setCustomerInfo', {
            phone_number: props.order.customer_phone_number,
            country_code: props.order.customer_phone_country_code, 
            customer_name: props.order.customer_name,
            email: props.order.customer_email
        });

        //set customer address for delivery mode 

        store.commit('setCustomerAddress', {
            area: props.order.area,
            city: props.order.city,
            state: null,
            country: props.order.country,
            customer_name: props.order.customer_name,
            phone_number: props.order.customer_phone_number,
            country_code: props.order.customer_phone_country_code, 
            email: props.order.customer_email,
            area_id: props.order.area_id,
            city_id: props.order.city?.city_id,
            state_id: props.order.state?.state_id,
            country_id: props.order.shipping_country_id,
            unit_type: props.order.unit_type,
            house_number: props.order.house_number,
            floor: props.order.floor,
            apartment: props.order.apartment,
            building:props.order.building,
            block: props.order.block,
            street: props.order.street,
            avenue:props.order.avenue,
            office: props.order.office,
            postalcode: props.order.postalcode,
            address_1: props.order.address_1,
            address_2: props.order.address_2,
            special_directions: props.order.special_directions,
            delivery_instructions: props.order.order_instruction,
        });

        updateTotals(); //pickupLocation

        if (router.currentRoute.value.path.includes("failed") && props.order.payment.payment_current_status != 'CAPTURED') {

            const alert = await alertController.create({
                header: t('Payment Failed'),
                message: t('There seems to be an issue with your payment, please try again.'),
                buttons: [t('Okay')]
            });

            await alert.present();
        }

        const applePay = props.paymentMethods.find(pm => pm.payment_method_code == "apple-pay");

        if(applePay)
            loadApplePay();

    }).catch(e => {
        console.error(e);
    });
}

/**
 * initialize order
 */
function initOrder() {

    trackEvent('UserAction', 'init-order');

    const orderData = getOrderData();

    return new Promise((resolve, reject) => { 

        placeDummyOrder(orderData).then(async response => {

            if (response.operation == 'success') {

                props.order_uuid = response.order.order_uuid;
                //props.order = response.order;

                resolve(response.order);

                //fetch related data 
                loadOrder();

            } else {

                const alert = await alertController.create({
                    header: t('Error'),
                    message: errorMessage(response.message),
                    buttons: [t('Okay')]
                });

                await alert.present();

                reject(response.message);

                //router.push('/');
            }
        }).catch((e) => {
            console.error(e);
        });
    });
}

/**
 * load payment methods data
 */
function loadPaymentMethodData() {

    getPaymentMethodOptions().then(response => {

        props.paymentMethods = response;

        //todo: if moyasar enabled or on moyasar selected

        /*props.paymentMethods.forEach(p => {
            if (p.payment_method_code == "Moyasar") {
                loadMoyasar();
            }
        });*/

        props.paymentMethods.forEach(p => {
            if (p.payment_method_code == "apple-pay") {
                loadApplePay()
            }
        });
        
    }).catch(e => {
        console.error(e);
    });
}

function onPaymentMethodChange(event) {

    const paymentMethod = props.paymentMethods.find(paymentMethod => {
        return paymentMethod.payment_method_id == event.detail.value;
    })
    
    if (props.isSafari && paymentMethod.payment_method_code == "apple-pay") {
        props.showApplePay = true;
        
        // init only if no order initiated already 
 
        /*if(!props.order.order_uuid) {
            
            initOrder().then(order => {

                //need this to show actual order total in payment forms 
                store.commit('setOrder', order);

                loadApplePay()
            }).catch((e) => {
                console.error(e);
            });

        } else {
            
            //todo: need to update order if payment failed and order updated before re-try 

            store.commit('setOrder', props.order);

            loadApplePay()
        }*/

        loadApplePay()

    } else {
        props.showApplePay = false;
    }
}

function loadApplePay() {
 
    // if required data not available 

    //!props.order.payment_method_id || 
    if(
        props.deliveryNotAvailable || props.placingOrder || !props.order ||
        
        (
            props.order.order_mode == 1 && (
                !store.state.customerAddress || 
                (
                    !store.state.customerAddress.area_id && 
                    !store.state.customerAddress.city_id && 
                    !store.state.customerAddress.state_id 
                )
            )
        ) ||
        (
            props.order.order_mode == 2 && 
            (
                !props.order.business_location_id || 
                !store.state.customerInfo || 
                !store.state.customerInfo.phone_number
            )
        )
    ) {
        console.log("insufficient data");
        return;     
    }

    //if already loadded or loading 

    if (props.applePayLoading == true || props.applePayReady == true) {
        return; 
    }

    /*
    public_key
    merchant_id
    currency
    amount
    */
                        
    props.applePayLoading = true;
    
    //getApplePayParams(this.plan_id, this.authService.currency_pref).subscribe(res => {

      //if (!res.merchant_id) {
      //  return false;
      //}
   
      const names =  store.state.customerInfo.customer_name;

      const firstName = names[0];
      const lastName = names.length > 2 ? names[2]: (names.length > 1? names[1]: "");
      const middleName = names.length > 2 ? names[1]: "";

      const customer_email = store.state.customerInfo? 
        store.state.customerInfo.email: props.order.customer_email;
        
      const customer_phone_number = store.state.customerInfo? 
        store.state.customerInfo.phone_number: props.order.customer_phone_number;
 
      let customer_phone_country_code = store.state.customerInfo? 
        store.state.customerInfo.country_code: props.order.customer_phone_country_code;
  
      if(!customer_phone_country_code) {
        customer_phone_country_code = "+965"
      }

      const total = toPrice(
        props.order.subtotal + props.order.delivery_fee + props.order.tax - props.order.voucher_discount,
        props.order.currency_code, props.order.currency_rate, false)

      const is_sandbox = store.state.store.is_sandbox;

      render(
        {
          publicKey: process.env.VUE_APP_ENV_TITLE == "Production" && !is_sandbox ? store.state.store.live_public_key : store.state.store.test_public_key, 
          environment: process.env.VUE_APP_ENV_TITLE == "Production" && !is_sandbox ? Environment.Production : Environment.Development,
          scope: Scope.TapToken,
          merchant: {
            domain: window.location.hostname,
            id: store.state.store.merchant_id 
          },
          transaction: {
            currency: props.order.currency_code,
            amount: total
          },
          acceptance: {
            supportedBrands: [SupportedNetworks.Mada, SupportedNetworks.Visa, SupportedNetworks.MasterCard],
            supportedCards: ['DEBIT', 'CREDIT'],
            supportedCardsWithAuthentications: ['3DS', 'EMV']
          },
          customer: {
            //id: 'cus_xxx',
            name: [
              {
                locale: store.state.language.code,
                first: firstName,
                last: lastName,
                middle: middleName
              }
            ],
            contact: {
              email: customer_email,
              phone: {
                number: customer_phone_number,
                countryCode: customer_phone_country_code, 
              }
            }
          },
          interface: {
            locale: store.state.language.code == "ar"? Locale.AR: Locale.EN,
            theme: ThemeMode.DARK,
            type: ButtonType.BUY,
            edges: Edges.CURVED
          },
          onCancel: async () => {
            console.log('onCancel');

           // props.showApplePay = false;
            props.applePayLoading = false;
          },
          onError: async (error) => {
            console.error('onError', error)

            const alert = await alertController.create({
                header: t('Error'),
                message: error.message? error.message: error[0].description,
                buttons: [t('Okay')]
            });
            alert.present();

            props.showApplePay = false;
            props.applePayLoading = false;

            //change payment method 
            props.order.paymentMethod = null;
            props.order.payment_method_id = null; 
            props.payment_method = null; 
          },
          onSuccess: async (data) => {
            //to have it in sentry to debug 
            console.error('onSuccess', data)

            //set source in form 
            props.token_id = data;//data.payment_token;

            //todo: call place order 
            placeOrderClicked();
          },
          onReady: async () => {
            console.log('onReady')

            //props.showApplePay = true;
            props.applePayLoading = false;
            props.applePayReady = true;
          }
        },
        'apple-pay-button'
      )
   // });
}

async function goToCustomerInfoPage() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: CustomerInfoPage
    });
    modal.present();

    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }

        updateTotals();
    });

    /*modal.onDidDismiss().then(() => {
        if(props.order.order_uuid) {
            updateTotals();
        } else {
            initOrder();
        }
    });*/
}

async function goToDeliveryToPage() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: DeliveryToPage,
    });
    modal.present();

    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }

        if(store.state.store.supportDelivery)
            props.order.order_mode = 1; // order mode to delivery 

        updateTotals();
    });

    //todo: only if all values provided 
    /*modal.onDidDismiss().then(() => {
        if(props.order.order_uuid) {
            updateTotals();
        } else {
            initOrder();
        }
    });*/
}

async function openMoyasarForm() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: MoyasarPage
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });
}

async function openStripeForm() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: StripePage
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });
}

/**
 * goToShippingToPageModule
 */
async function goToShippingToPage() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: ModalNav,
        componentProps: {
            component: ShippingToPage
        }
    });
    modal.present();

    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
        updateTotals();
    });
}

async function choosePickupLocation() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: BusinessLocationPage,
        showBackdrop: true
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });

    const { data } = await modal.onWillDismiss();

    if (!data) return;
 
    if (data.businessLocation) {
        props.order.businessLocation = data.businessLocation;
        props.order.business_location_id = data.businessLocation.business_location_id;

        updateTotals();
    }
}

async function openGiftForm() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: GiftPage,
        cssClass: 'card-message-modal',
        showBackdrop: true
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });
    const { data } = await modal.onWillDismiss();

    if (!data) return;

    if (data.recipient_name) {
        props.order.recipient_name = data.recipient_name;
        props.order.recipient_phone_number = data.recipient_phone_number;
        props.order.gift_message = data.gift_message;
        props.order.sender_name = data.sender_name;
    } else {
        props.order.recipient_name = null;
        props.order.recipient_phone_number = null;
        props.order.gift_message = null;
        props.order.sender_name = null;
    }
}

/**
 * Go to schedule-order page
 */
async function goToScheduleOrderPage() {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
        component: ScheduleOrderPage,
        componentProps: {
            order: props.order
        }
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });

    const { data } = await modal.onWillDismiss();

    if (!data) return;

    if (data.isOrderScheduled) {
        props.order.is_order_scheduled = data.isOrderScheduled;
        props.order.scheduled_time_start_from = data.scheduledTimeStartFrom;
        props.order.scheduled_time_to = data.scheduledTimeTo;
    } else {
        props.order.is_order_scheduled = null;
        props.order.scheduled_time_start_from = null;
        props.order.scheduled_time_to = null;
    }
}

function getOrderData() {

    const orderItems = [];

    for (const key of Object.keys(store.state.cart)) {

        const item = store.state.cart[key];

        orderItems.push({
            extraOptions: item.extraOptions,//todo: test all option getting save
            item_uuid: item.item_uuid,
            item_variant_uuid: item.variant ? item.variant.item_variant_uuid: null,
            qty: item.qty
        });
    }

    //let customerPaymenyMethod = props.paymentMethods.find(ele => ele.payment_method_id == props.payment_method);

    //todo: set customer info if login (profile and defailt address)

    //todo: fix guest checkout flow : 
    //set address btn clicked -> shipping to -> delivery to -> confirm page with order details?

    return {
        ...props.order, 

        'order_uuid': props.order_uuid,

        'order_instruction': props.order?.order_instruction,
        'utm_uuid': store.state.utm_id,

        ...store.state.customerAddress,
        ...store.state.customerInfo,

        'is_order_scheduled': props.order?.is_order_scheduled,
        'scheduled_time_start_from': props.order?.scheduled_time_start_from,
        'scheduled_time_to': props.order?.scheduled_time_to,

        'voucher_id': props.order?.voucher_id,
        'payment_method_id': props.payment_method? props.payment_method.payment_method_id: 
            props.order.payment_method_id,

        //getting use by payment modules
        'payment_token': props.token_id,
        "source": props.source,
        'bank_name': props.bank_name,

        'items': orderItems,

        ...props.payment_method,
        ...store.state.shippingMethod
    };
}

function saveOrderInstruction() {

    props.savingInstruction = true;

    saveInstruction(props.order_uuid, props.order.order_instruction).then(() => {
        props.savingInstruction = false;
    }).catch(() => {
        props.savingInstruction = false;
    });
}

function openPaymentForm(paymentMethod) {
    switch (paymentMethod.payment_method_code) {
        case 'Moyasar':
            openMoyasarForm();
            break;
    
        default:
            openStripeForm();
            break;
    }
}

/**
 * send customer data + order to our backend to place an order and create a new record in our db
 */
async function placeOrderClicked() {

    trackEvent('UserAction', 'place-an-order');
 
    const paymentMethod = props.paymentMethods.find(e => e.payment_method_id == props.order.payment_method_id);

    if(['Moyasar', 'Stripe'].indexOf(paymentMethod.payment_method_code) > -1) {

        // init only if no order initiated already 
 
        if(!props.order.order_uuid) {
            
            initOrder().then(order => {

                //need this to show actual order total in payment forms 
                store.commit('setOrder', order);

                openPaymentForm(paymentMethod);
            }).catch((e) => {
                console.error(e);
            });
        } else {
            
            //todo: need to update order if payment failed and order updated before re-try 

            store.commit('setOrder', props.order);

            openPaymentForm(paymentMethod);
        }

        return;
    }
    
    const orderData = getOrderData();

    props.placingOrder = true;

    placeAnOrder(orderData).then(async response => {

        if (store.state.store.facebook_pixil_id) {
            initiateCheckoutEventFacebookPixil(response.total_price);
        }

        if (response.operation == 'redirecting') {

            store.commit('clearCart');
            store.commit('setDeliveryTime', {}); 

            window.location.href = response.redirectUrl;

        } else if (response.operation == 'success') {

            //for cash on delivery 

            if (store.state.store.snapchat_pixil_id)
              purchaseEventSnapchatPixil(props.order.total_price, 
                store.state.store.currency.code);

            if (store.state.store.facebook_pixil_id)
              purchaseEventFacebookPixil(props.order.total_price);

            store.commit('clearCart');
            store.commit('setDeliveryTime', {}); 

            mixpanel.track('Cash on Delivery Order', props.order);

            window.analytics.track('Cash on Delivery Order', props.order);

            router.replace('/order/' + response.order_uuid);

        } else {

            props.placingOrder = false;

            const alert = await alertController.create({
                header: t('Alert'),
                message: errorMessage(response.message),
                buttons: [t('Okay')]
            });

            await alert.present();

            if (response.message.qty) {
                alert.onDidDismiss().then(() => {
                    return router.push('/cart');
                });
            }
        }
    }).catch(() => {
        props.placingOrder = false;
    });
}

/**
 * reset promo code input
 */
function removeAppliedPromoCode() {
    props.promo_code = null;
}

/**
 * Check whether promo code is valid or no
 */
function applyPromoCodeClicked() {

    //todo: promo code validation for login user 

    const promoCodeParam = {
        'code': props.promo_code,
        'restaurant_uuid': store.state.store.restaurant_uuid,
        'phone_number': store.state.customerInfo.phone_number,
        'order_uuid': props.order_uuid
    };

    props.applyingPromoCode = true;

    const action = props.order.order_uuid ? applyPromoCodeData(promoCodeParam) :
        loadPromoCodeData(promoCodeParam);

    action.then(async response => {

        props.applyingPromoCode = false;

        if (response.operation == 'success') {

            if (response.order) {
                props.order.total_price = response.order.total_price;
                props.order.subtotal = response.order.subtotal;
                props.order.total_price_before_refund = response.order.total_price_before_refund;
                props.order.subtotal_before_refund = response.order.subtotal_before_refund;
                props.order.voucher = response.voucher;
                props.order.voucher_id = response.order.voucher_id;
                props.order.voucher_discount = parseFloat(response.order.voucher_discount);
            }
            else 
            {
                let discount = 0;

                if (response.voucher.discount_type == 1) {
                    discount = props.order.subtotal * response.voucher.discount_amount / 100;
                } else if (response.voucher.discount_type == 2) {
                    discount = response.voucher.discount_amount;
                } else if (response.voucher.discount_type == 3) {
                    //as instead of applying discount on delivery fee, we skipping applying delivery fee if voucher type free delivery
                    discount = 0;//props.order.delivery_fee; 
                }

                props.order.total_price = props.order.subtotal + props.order.tax + props.order.delivery_fee - discount;
                props.order.voucher = response.voucher;
                props.order.voucher_id = response.voucher.voucher_id;
                props.order.voucher_discount = discount;
            }
        }
        else 
        {
            props.promo_code = null;

            const alert = await alertController.create({
                header: t('Alert'),
                message: errorMessage(response.message),
                buttons: [t('Okay')]
            });

            await alert.present();
        }
    }).catch(() => {
        props.applyingPromoCode = false;
    });
}

/**
 * based on location selected
 */
async function updateTotals() {
  
    if(!props.order) {
        console.log("order not set yet!")
        return;
    }

    if (
        (
            props.order.order_mode == 1 && 
            (
                !store.state.customerAddress ||
                (
                    !store.state.customerAddress.area_id &&
                    !store.state.customerAddress.city_id && 
                    !store.state.customerAddress.state_id 
                )
            )
        ) ||
        (
            props.order.order_mode == 2 && !props.order.businessLocation 
        )
    ) {
        console.log("customer address missing")
        return; //insufficient data 
    }
    
    props.deliveryNotAvailable = false;

    if(props.order.order_mode == 1) {

        const city_id = props.order.city_id? props.order.city_id: store.state.customerAddress.city_id;
        const area_id = props.order.area_id? props.order.area_id: store.state.customerAddress.area_id;
        const state_id = props.order.state_id? props.order.state_id: store.state.customerAddress.state_id;

        const areaDeliveryZone = await getDeliveryZoneByLocation(city_id, area_id, state_id);
 
        if (
            !areaDeliveryZone || 
            !areaDeliveryZone.deliveryZone || 
            !areaDeliveryZone.deliveryZone.businessLocation
        ) {

            props.deliveryNotAvailable = true;

            const alert = await alertController.create({
                header: t('Alert'),
                message: t("Delivery not supported in selected location"),
                buttons: [t('Okay')]
            });

            await alert.present();

            return;
        } 
        
        if(areaDeliveryZone.deliveryZone) {

            const shippingMethod = {
                ...store.state.shippingMethod,
                ...areaDeliveryZone,
                order_mode: props.order.order_mode,
                area_id: area_id,
                state_id: state_id,
                city_id: city_id
            };
 
            store.commit('setShippingMethod', shippingMethod);

            /*{
                deliveryZone: areaDeliveryZone.deliveryZone,
                areaDeliveryZone: areaDeliveryZone,
                businessLocation: areaDeliveryZone.deliveryZone.businessLocation
            });*/
            
            props.order.deliveyZone = areaDeliveryZone.deliveryZone;
            props.order.delivery_zone_id = areaDeliveryZone.deliveryZone.delivery_zone_id;

            //as delivery zone might be in diff location 
            props.order.business_location_id = areaDeliveryZone.deliveryZone.business_location_id;
            props.order.businessLocation = areaDeliveryZone.deliveryZone.businessLocation; 

        }

        //delivery fee calculation    

        if(props.order.voucher && props.order.voucher.voucher_type == 3) {
            props.order.delivery_fee = 0;
        } else {
            props.order.delivery_fee = parseFloat(areaDeliveryZone.deliveryZone.delivery_fee);
        }
        
        //tax calculation    

        const tax = areaDeliveryZone.deliveryZone.delivery_zone_tax > 0 ?
            parseFloat(areaDeliveryZone.deliveryZone.delivery_zone_tax): 
            parseFloat(areaDeliveryZone.deliveryZone.businessLocation.business_location_tax);

        if(tax) {
            props.order.tax = (props.order.delivery_fee + props.order.subtotal) * tax / 100;
        }

    } else {
        
        props.order.delivery_fee = 0;

        if(props.order.businessLocation.business_location_tax > 0) {
            props.order.tax = (props.order.delivery_fee + props.order.subtotal) * 
                parseFloat(props.order.businessLocation.business_location_tax) / 100;
        }
    } 

    props.order.total_price = 
        props.order.delivery_fee + props.order.tax + props.order.subtotal - 
        props.order.voucher_discount;

    const applePay = props.paymentMethods.find(pm => pm.payment_method_code == "apple-pay");

    if(applePay)
        loadApplePay();    
}

</script>
<style lang="scss" scoped>
 .mode-wrapper {
   margin-bottom: 20px;
}

.field-area {

    --padding-top: 16px;
    --padding-end: 0;
    --inner-padding-end: 0;

    img[slot="start"] {
        margin-top: 0;
        margin-inline-end: 14px;
    }

    img[slot="end"] {
        margin-top: 0;
    }

    ion-label {
        margin: 0;
        padding: 0;
    }
}

.option-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
    margin: 24px 0;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 22px;
    /* 157.143% */

    .gift-wrapper,
    .discount-wrapper {
        width: 100%;
    }

    .discount-wrapper {
        padding: 12px 12px 0px 12px;
    }

    .gift-wrapper {
        padding: 0 12px 12px 12px;

        .gift-details{
            border-radius: 16px;
            background: var(--ion-color-light-shade, #F7F7F7);
            padding: 12px;
            margin-top: 12px;

            p {
                margin-bottom: 4px;
                margin-top: 0;
                padding: 0;
            }

            p.message {
                margin-top: 8px;
            }

            .btn-edit {
                color: var(--ion-color-success, #25BA69);
                font-size: 14px;
                font-style: normal;
                font-weight: 500;
                line-height: 22px; /* 157.143% */
            }
        }
    }

    .discount-wrapper button {
        position: relative;
        top: 3px;
    }

    .sep {
        width: calc(100% - 24px);
        height: 1px;
        background: #f0f0f0;
        margin: auto;
    }

    input {
        border: none;
        color: var(--ion-color-dark-shade, #1A1A1A);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        outline: none;
        background: transparent;
    }

    img {
        display: flex;
        width: 24px;
        height: 24px;
        padding: 0.937px 0.921px;
        justify-content: center;
        align-items: center;
        float: var(--start);
        margin-inline-end: 12px;
    }
 
    .txt-applied,
    button {
        background: transparent;
        color: var(--ion-color-primary, #453E9A);
        text-align: var(--end);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        float: var(--end);
    }

    .txt-applied {
        position: relative;
        top: 5px;
    }
    
    button:disabled {
        color: var(--ion-shades-neutral-n-5, #8F8F8F);
    }
}

ion-radio {
    color: var(--ion-color-dark-shade, #1A1A1A);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    clear: both;
    display: block;
    padding: 8px 0;
    --color: #CCCCCC;

    svg,
    img {
        width: 22px;
        height: 22px;
        flex-shrink: 0;
        float: var(--start);
        margin-inline-end: 9px;
    }
}

h5.txt-title {
    color: var(--ion-color-dark-shade, #1A1A1A);
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24.8px;
    /* 137.778% */
    margin-top: 0;
    margin-bottom: 16px;
}

.total-wrapper {
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

        b {
            color: var(--ion-color-dark-shade, #1A1A1A);
        }
    }
}

P.txt-terms {
    color: var(--ion-color-medium-shade, #707070);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-top: 40px;

    a {
        color: var(--ion-color-warning-shade, #E99C30);
    }
}

ion-list {
    padding: 0;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    margin-bottom: 24px;

    .sep {
        width: calc(100% - 32px);
        height: 1px;
        background: #f0f0f0;
        margin: auto;
    }

    ion-item {
        --inner-border-width: 0;

        img {
            margin-inline-end: 12px;
        }

        h5 {
            color: var(--ion-color-dark-shade, #1A1A1A);
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 22px;
            /* 157.143% */
        }

        p {
            color: var(--ion-color-medium-shade, #707070);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */
        }

        button {
            background: transparent;
            color: var(--ion-color-primary, #453E9A);
            text-align: var(--end);
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 22px;
            /* 157.143% */
        }
    }
}

#radio_apple-pay,
#apple-pay-button {
    display: none;
}

.isSafari #radio_apple-pay ,
#apple-pay-button.active {
    display: block;
} 

ion-footer ion-spinner {
    --color: #333;
    margin-inline-end: 15px;
}
</style>
<!-- 
todo:    
payment gateways icons  
make sure delivery fees + tax getting calculated in backend properly 

scenarios to test 
--------
new user

saved customer address + delivery mode 

pickup mode + saved data 

delivery data saved but pickup data and move to pickup 
pickup data saved but delivery data and move to delivery 

-->