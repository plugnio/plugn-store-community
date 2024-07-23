<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="dismiss()">
                        <img src="../../assets/icons/close.svg" />
                    </button>
                </ion-buttons>

                <ion-title>
                    {{ $t('Your cart') }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <p class="alert alert-warning" v-if="!store.state.store.supportPickup && !store.state.store.supportDelivery">
                {{ $t('Delivery option not available for now! Please contact store owner.') }}
            </p>


            <div class="no-data" v-if="store.state.cartLength == 0">

                <IonIcon :icon="cartOutline"></IonIcon>

                <h5>{{ $t('Your cart is empty') }}</h5>
 
                <p>{{ $t('You can manage your shopping cart here') }}</p>

                <button @click="dismiss()" class="btn">
                    {{ $t('Start Shopping') }}
                </button>

            </div>

            <cart-item :item="item" :cart_item_id="index" v-for="(item, index) in store.state.cart" :key="index"></cart-item>

        </ion-content>
        <ion-footer v-if="store.state.cartLength > 0 && (store.state.store.supportPickup || store.state.store.supportDelivery)">

            <div class="alert alert-warning" v-if="!store.state.store.supportPickup 
                && store.state.store.supportDelivery && !store.getters.isStoreOpen">
                
                <template v-if="store.getters.storeReopenAt">
                    {{ $t('Reopen at {time}', { time: store.getters.storeReopenAt }) }}
                </template>
                <template v-if="!store.getters.storeReopenAt">
                    {{ $t('Close now') }}
                </template>
            </div>

            <ion-toolbar> 
                <button class="add-to-cart" @click="goToCheckout()" 
                    :disabled="!store.state.store.supportPickup && !store.getters.isStoreOpen">
                    {{ $t('Checkout') }}
                    <span class="sep">·</span>
                    <span class="txt-total"> {{ toPrice(store.state.cartTotal) }}</span>
                </button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>    
</template>
<script setup lang="ts"> 
import { IonButtons, IonFooter, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, modalController, IonIcon, onIonViewDidEnter } from '@ionic/vue';
import { cartOutline } from 'ionicons/icons';
import CartItem from '@/components/CartItem.vue';
import store from '@/store';
import { toPrice } from '@/pipes/price';
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';

//todo: copy checkout success/ failed etc pages from old repo 

onIonViewDidEnter(() => {
    trackView('cart-page');
})

function goToCheckout() {
   
    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss({
                page: "checkout"
            });
        }
    }); 
}

function dismiss() {
    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss();
        //} else if(window.history.length > 0) {
        //    router.back();
        } else {
            router.push('/');
        }
    });
}

</script>
<style lang="scss" scoped>
ion-footer {
    display: flex;
    padding-bottom: 0px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;
 
    .alert {
        width: 100%;
    }

    .add-to-cart {
        padding: 8px 16px; 
        gap: 8px; 
        border-radius: 16px;
        background: var(--ion-color-primary, #453E9A);
        color: var(--ion-color-primary-contrast, #FFF);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        height: 56px; 
        margin: 8px 16px;
        width: calc(100% - 32px);
        text-align: center;

        .txt-total {
            color: var(--ion-shades-primary-p-2, #E8E5FF);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */
        }

        .sep {
            margin: 0 4px;
        }
    }
}

</style>