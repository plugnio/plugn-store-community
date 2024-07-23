<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="dismiss()">
                        <img src="../../assets/icons/close.svg" />
                    </button>
                    <!--
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../assets/icons/chevron-left.svg" />
                    </ion-back-button>-->
                </ion-buttons>
                    
                <ion-title>
                    {{  $t('Gift Details') }}
                </ion-title>

                <ion-buttons slot="end">
                    <ion-button @click="discard()">
                        {{  $t('Discard') }}
                    </ion-button>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <form @submit.stop.prevent="onSubmit">
                <h5>{{ $t("Sender") }} </h5>

                <ion-item class="form-toggle">
                    <ion-toggle :checked="sender_name.value" @ionChange="onSenderToggle()">
                        {{ $t('Display sender name') }}
                    </ion-toggle>
                </ion-item> 

                <h5>{{ $t("Recipient") }} </h5>
                
                <ion-item class="form-field">
                    <ion-input v-bind="recipient_name" :label="$t('Recipient Name')" label-placement="floating" 
                    :placeholder="$t('Enter Recipient Name')"></ion-input>
                </ion-item>

                <TelephoneInput v-if="props.loaded" :country_code="props.country_code"  :phone_number="props.phone_number"  @onChange="onTelephoneChange"></TelephoneInput>

               <!--  <ion-item class="form-field">
                    <ion-input v-bind="recipient_phone_number" :label="$t('Recipient Phone Number')" label-placement="floating" 
                    :placeholder="$t('Enter Recipient Phone Number')"></ion-input>
                </ion-item>-->
                
                <ion-item class="form-field">
                    <ion-textarea v-bind="gift_message" :label="$t('Gift Message')" label-placement="floating" 
                    :placeholder="$t('Enter Gift Message')"></ion-textarea>
                </ion-item>

                <div class="btn-wrapper">
                    <button :disabled="!meta.valid || submitting" class="btn-submit">
                        <span v-if="!submitting">{{ $t("Save") }}</span>
                        <IonSpinner v-if="submitting"></IonSpinner>
                    </button>
                </div>
            </form>

        </ion-content>
    </ion-page>    
</template>
<script setup  lang="ts">
import { IonItem, IonButtons, IonButton, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonToggle, IonTextarea, modalController, IonSpinner } from '@ionic/vue';
import { toTypedSchema } from '@vee-validate/yup';
import { onMounted, reactive, ref } from 'vue';
import * as yup from 'yup';
import { useForm } from 'vee-validate';
import store from '@/store';
import TelephoneInput from '@/components/telephone/TelephoneInput.vue';
import { trackView } from '@/services/AnalyticsService';
import router from '@/router';
  
const props = reactive({
    country_code: null, 
    phone_number: null,
    loaded: false
});

const { errors, defineInputBinds, meta, handleSubmit, values, setValues, setFieldValue } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            recipient_name: yup.string().min(1).required(),
            recipient_phone_number: yup.string().min(1).required(), //number(). todo: yup phone number validation 
            gift_message: yup.string().required(),
            sender_name: yup.boolean(),
        })
    ),
});

function onTelephoneChange(data) {
  setFieldValue('recipient_phone_number', '+' + data.country_code + ' ' + data.phone_number);
}

function onSenderToggle() {
    setFieldValue("sender_name", !values.sender_name);
}

const submitting = ref(false);

const onSubmit = handleSubmit(values => {

    //submitting.value = true;

    store.commit("setGiftDetails", values);

    modalController.dismiss(values);
});

function discard() {
    
    setValues({
        recipient_name: null,
        recipient_phone_number: null, 
        gift_message: null, 
        sender_name: null
    });

    store.commit("setGiftDetails", values);

    modalController.dismiss(values);
}

const sender_name = defineInputBinds('sender_name', {
    validateOnInput: true
});

const recipient_name = defineInputBinds('recipient_name', {
    validateOnInput: true
});

const recipient_phone_number = defineInputBinds('recipient_phone_number', {
    validateOnInput: true
});

const gift_message = defineInputBinds('gift_message', {
    validateOnInput: true
});

onMounted(() => {
    
    trackView('gift-page');

    if(store.state.giftDetails) {
        setValues(store.state.giftDetails)

        if(store.state.giftDetails.recipient_phone_number) {
            const a = store.state.giftDetails.recipient_phone_number.replace("+", '').split(" ");
            props.country_code = a[0];
            props.phone_number = a[1];
        }
    }

    props.loaded = true;
});
 
function dismiss() {
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
<style lang="scss" scoped>
h5 {
    color: var(--ion-color-dark-shade, #1A1A1A);
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.4px; /* 140% */
    margin-bottom: 16px;
}


ion-buttons[slot="end"] ion-button {
    text-transform: none;
}
</style>
