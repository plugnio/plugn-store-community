<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="dismiss()">
                        <img src="@/assets/icons/close.svg" />
                    </button>
                    <!--
                    <ion-back-button text=""  defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="@/assets/icons/chevron-left.svg" />
                    </ion-back-button>-->
                </ion-buttons>
                <ion-title>
                    {{ $t("Contact Details") }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <form @submit.stop.prevent="onSubmit" v-if="props.isReady">
                
                <ion-item class="form-field">
                    <ion-input v-bind="customer_name" label="Name" label-placement="floating"
                        :placeholder="$t('Enter name')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.customer_name">
                    {{ $t("Name is a not valid field") }}
                </p>

                <TelephoneInput  :country_code="country_code.value" :phone_number="phone_number.value" 
                    @onChange="onTelephoneChange"></TelephoneInput>
                <!--<ion-item class="form-field">
                <input type="hidden" name="country_code" :value="country_code" />
                <ion-input v-bind="phone_number" label="Phone no." label-placement="floating"
                    :placeholder="$t('Enter phone no.')"></ion-input></ion-item>-->
            
                <p class="txt-field-error" v-if="errors.phone_number">
                    {{ $t("Phone number is a not valid field") }}
                </p>

                <ion-item class="form-field">
                    <ion-input v-bind="email" label="Email" label-placement="floating"
                        :placeholder="$t('Enter email')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.email">
                    {{ $t("Email is a not valid field") }}
                </p>
 
                <div class="btn-wrapper">
                    <button :disabled="!meta.valid || submitting" class="btn-submit">
                        <span v-if="!submitting">{{ $t("Submit") }}</span>
                        <IonSpinner v-if="submitting"></IonSpinner>
                    </button>
                </div>
            </form>

        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import router from '@/router';
import { IonInput, IonItem, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonSpinner, modalController } from '@ionic/vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { onMounted, reactive, ref } from 'vue'; 
import store from '@/store';
import { trackView } from '@/services/AnalyticsService';
import { getAccount } from '@/services/AccountService';
import TelephoneInput from '@/components/telephone/TelephoneInput.vue';

const id = router.currentRoute.value.params['id'];

//{ area, city, state, country }
const props = reactive({
    area: null,
    city: null,
    state: null,
    country: null,
    isReady: false
});

const { errors, defineInputBinds, meta, handleSubmit, values, setValues, setFieldValue } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            customer_name: yup.string().min(3).required(),
            phone_number: yup.number().required(), //todo: yup phone number validation 
            country_code: yup.string(),//required() 
            email: yup.string().email(),
        })
    ),
});

onMounted(() => {

    trackView('customer-info-page');

    if(store.state.customerInfo && store.state.customerInfo.customer_name) {
        setValues(store.state.customerInfo);
        props.isReady = true;
    }
    else if(store.state.isLogin) 
    {
        getAccount().then(res => { 
            setFieldValue('customer_name', res.customer_name);
            setFieldValue('phone_number', res.customer_phone_number);
            setFieldValue('country_code', res.country_code);
            setFieldValue('email', res.customer_email);

            props.isReady = true;
        });
    } else {
        props.isReady = true;
    }
}) 

const email = defineInputBinds('email', {
    validateOnInput: true
});

const customer_name = defineInputBinds('customer_name', {
    validateOnInput: true
});

const country_code = defineInputBinds('country_code', {
    validateOnInput: true
});

const phone_number = defineInputBinds('phone_number', {
    validateOnInput: true
});
 
   
const submitting = ref(false);

//todo: on submit validate area for availability + fetch delivery cost etc details 
//delviery_fee, delivery_zone_id 

const onSubmit = handleSubmit(values => {

    submitting.value = true;

    store.commit('setCustomerInfo', {
        phone_number: values.phone_number,
        country_code: values.country_code, 
        customer_name: values.customer_name,
        email: values.email
    });

    modalController.dismiss()
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

function onTelephoneChange(data) {
  setFieldValue('country_code', data.country_code);
  setFieldValue('phone_number', data.phone_number);
}

</script> 

