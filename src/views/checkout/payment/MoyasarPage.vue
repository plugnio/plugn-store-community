<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" @click="dismiss($event)" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="@/assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title>
                   {{ $t("Pay with Moyasar") }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true"> 
            <div class="mysr-form"></div> 
        </ion-content>
    </ion-page>

</template>
<script lang="ts" setup>

declare let Moyasar;

import { onMounted } from 'vue';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, modalController } from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';

import { getMoyasarInitParams } from '../../../services/payment/MoyasarService';

import store from '@/store';
import { trackView } from '@/services/AnalyticsService';
import router from '@/router';
 
onMounted(() => {
    
    trackView('moyasar-page');

    loadMoyasar(store.state.order.order_uuid);
});

function loadMoyasar(order_uuid) {

    getMoyasarInitParams(order_uuid).then(res => {

        Moyasar.init({
            element: '.mysr-form',
            language: res.language_code,
            amount: res.amount_in_halals,
            currency: res.currency,
            country: res.country,
            description: res.description,
            publishable_api_key: res.payment_moyasar_api_key,
            methods: res.payment_moyasar_payment_methods_json,
            //supported_networks: {{payment_moyasar_network_support_json|raw}},
            callback_url: res.callback_url,
            apple_pay: {
                label: res.domain_name,
                validate_merchant_url: res.validate_merchant_url,
                version: 9,
                country: res.country,
            },
            //Add more information
            metadata: res.metadata_json,
            translations: {
                ar: {
                    "button.pay": "دفع"
                }
            },
        });
    }).catch((e) => {
        console.error(e);
        //todo: handle error 
    });
}

function dismiss(event) {
    event.preventDefault();
    event.stopPropagation(); 

    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss();
        } else if(window.history.length > 0) {
            router.back();
        } else {
            router.push('/');
        }
    });
}

</script>