<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" @click="dismiss($event)" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="@/assets/icons/chevron-left.svg" />
                    </ion-back-button>
                    
                    <!--
                    <button type="button" color="primary" @click="dismiss($event)">
                        <img src="@/assets/icons/close.svg" />
                    </button>-->
                </ion-buttons>
                <ion-title>
                    {{ $t("Pay with Stripe") }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true"> 
            <!-- Display a payment form -->
            <form id="payment-form" :class="{ hidden: !props.stripe }" @submit="handleSubmit($event)">
                <div id="link-authentication-element">
                    <!--Stripe.js injects the Link Authentication Element-->
                </div>
                <div id="payment-element">
                    <!--Stripe.js injects the Payment Element-->
                </div>
                <button id="submit" :disabled="props.loading">
                    <ion-spinner v-if="props.loading"></ion-spinner>
                    <span id="button-text" v-if="!props.loading">
                        {{ $t("Pay now") }}</span>
                </button>
                <div id="payment-message" class="hidden"></div>
            </form>
        </ion-content>
    </ion-page>
</template>
 
<script lang="ts" setup>

declare let Stripe;

import { onMounted, reactive } from 'vue';
import { IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, modalController, alertController, IonSpinner } from '@ionic/vue';

import store from '@/store';

import { errorMessage } from '@/services/HTMLService';
import { getStripeInitParams } from '../../../services/payment/StripeService';
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';
import { chevronBack } from 'ionicons/icons';
 
const { t } = useI18n({ useScope: "global" });

const props = reactive({
    stripe: null,
    loading: false,
    elements: null,
    cancel_url: null,
    success_url: null
});

onMounted(() => {
    trackView('stripe-page');

    initialize();
});

// Fetches a payment intent and captures the client secret
async function initialize() {

    getStripeInitParams(store.state.order.order_uuid).then(async resp => {

        if (resp.operation == "success") {

            props.success_url = resp.success_url;
            props.cancel_url = resp.cancel_url;

            props.stripe = Stripe(resp.stripePublishableKey, {
                locale: "en"
            });//todo: arabic support  $i18n.local?
 
            props.elements = props.stripe.elements({ clientSecret: resp.clientSecret });

            const linkAuthenticationElement = props.elements.create("linkAuthentication");
            linkAuthenticationElement.mount("#link-authentication-element");

            const paymentElementOptions = {
                layout: "tabs",
            };

            const paymentElement = props.elements.create("payment", paymentElementOptions);
            paymentElement.mount("#payment-element");

        } else {
            //showMessage(resp.message + "");

            const alert = await alertController.create({
                header: t('Alert'),
                message: errorMessage(resp.message),
                buttons: [t('Okay')]
            });

            return await alert.present();
        }
    }).catch((e) => {
        console.error(e);
        //todo: handle error 
    });
}

async function handleSubmit(e) {

    e.preventDefault();

    props.loading = true;

    const { error } = await props.stripe.confirmPayment({
        elements: props.elements,
        confirmParams: {
            // Make sure to change this to your payment completion page
            return_url: props.success_url,
            receipt_email: store.state.order.customer_email,
        },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }

    props.loading = false;
}

// ------- UI helpers -------

async function showMessage(messageText) {
    
    const messageContainer = document.querySelector("#payment-message");

    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;

    setTimeout(() => {
      messageContainer.classList.add("hidden");
      messageContainer.textContent = "";
    }, 4000);

    /*const alert = await alertController.create({
        header: 'Alert',
        message: errorMessage(messageText),
        buttons: ['OK']
    });

    return await alert.present();*/
}

function dismiss(event = null) {

    if(event) {
        event.stopPropagation();
        event.preventDefault();
    }

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
<style scoped lang="scss">
form {
    width: 100%;
    min-width: 100%;
    align-self: center;
    box-shadow: 0px 0px 0px 0.5px rgba(50, 50, 93, 0.1),
        0px 2px 5px 0px rgba(50, 50, 93, 0.1), 0px 1px 1.5px 0px rgba(0, 0, 0, 0.07);
    border-radius: 7px;
    padding: 40px;
}

.hidden {
    display: none;
}

#payment-message {
    color: rgb(105, 115, 134);
    font-size: 16px;
    line-height: 20px;
    padding-top: 12px;
    text-align: center;
}

#payment-element {
    margin-bottom: 24px;
}

/* Buttons and links */
button {
    background: #5469d4;
    font-family: Arial, sans-serif;
    color: #ffffff;
    border-radius: 4px;
    border: 0;
    padding: 12px 16px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    display: block;
    transition: all 0.2s ease;
    box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
    width: 100%;
}

button:hover {
    filter: contrast(115%);
}

button:disabled {
    opacity: 0.5;
    cursor: default;
}

/* spinner/processing state, errors */
.spinner,
.spinner:before,
.spinner:after {
    border-radius: 50%;
}

.spinner {
    color: #ffffff;
    font-size: 22px;
    text-indent: -99999px;
    margin: 0px auto;
    position: relative;
    width: 20px;
    height: 20px;
    box-shadow: inset 0 0 0 2px;
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
}

.spinner:before,
.spinner:after {
    position: absolute;
    content: "";
}

.spinner:before {
    width: 10.4px;
    height: 20.4px;
    background: #5469d4;
    border-radius: 20.4px 0 0 20.4px;
    top: -0.2px;
    left: -0.2px;
    -webkit-transform-origin: 10.4px 10.2px;
    transform-origin: 10.4px 10.2px;
    -webkit-animation: loading 2s infinite ease 1.5s;
    animation: loading 2s infinite ease 1.5s;
}

.spinner:after {
    width: 10.4px;
    height: 10.2px;
    background: #5469d4;
    border-radius: 0 10.2px 10.2px 0;
    top: -0.1px;
    left: 10.2px;
    -webkit-transform-origin: 0px 10.2px;
    transform-origin: 0px 10.2px;
    -webkit-animation: loading 2s infinite ease;
    animation: loading 2s infinite ease;
}

[dir="rtl"] {
    .spinner:before {
        border-radius: 0 20.4px 20.4px 0;
    }

    .spinner:after {
        border-radius:  10.2px 0 0 10.2px;
    }
}

@-webkit-keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@keyframes loading {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }

    100% {
        -webkit-transform: rotate(360deg);
        transform: rotate(360deg);
    }
}

@media only screen and (max-width: 600px) {
    form {
        min-width: initial;
    }
}</style>