<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                    </ion-back-button>
                </ion-buttons>

                <ion-title>
                    {{ $t("Profile") }}
                </ion-title>
                <ion-buttons slot="end">
                    <router-link to="/">
                        <button>
                            {{ $t("Cancel") }}
                        </button>
                    </router-link>
                </ion-buttons>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <form @submit.stop.prevent="onSubmit">

                <ion-grid>
                    <ion-row>
                        <ion-col>
                            <ion-item class="form-field">
                                <ion-input v-bind="first_name" autocomplete="given-name" :label="$t('First Name')" 
                                    label-placement="floating"
                                    :placeholder="$t('Enter first name')"></ion-input>
                            </ion-item>
                            <p class="txt-field-error" v-if="errors.first_name">
                                {{ $t('{field} is a required field', { 'field': $t("First name") }) }}
                            </p>
                        </ion-col>
                        <ion-col>
                            <ion-item class="form-field">
                                <ion-input v-bind="last_name" autocomplete="family-name" :label="$t('Last Name')" label-placement="floating"
                                    :placeholder="$t('Enter last name')"></ion-input>
                            </ion-item>
                            <p class="txt-field-error" v-if="errors.last_name">
                                {{ $t('{field} is a required field', { 'field': $t("Last name") }) }}
                            </p>
                        </ion-col>
                    </ion-row>
                </ion-grid>

                <ion-item class="form-field">
                    <ion-input v-bind="email" autocomplete="email" inputmode="email" :label="$t('Email')"
                        label-placement="floating" :placeholder="$t('Enter email')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.email">
                    {{ $t("Email is a not valid field") }}
                </p>

                <TelephoneInput v-if="!loading" :country_code="country_code.value"  :phone_number="phone_number.value" 
                    @onChange="onTelephoneChange"></TelephoneInput>

                <!-- <ion-item class="form-field">
                    <ion-input v-bind="phone_number" autocomplete="tel" inputmode="tel" :label="$t('Phone Number')"
                        label-placement="floating" :placeholder="$t('Enter phone number')"></ion-input>
                </ion-item>-->
                <p class="txt-field-error" v-if="errors.phone_number">
                    {{ $t('{field} is a required field', { 'field': $t("Phone number") }) }}
                </p> 

                <div class="btn-wrapper">
                    <button :disabled="!meta.valid || submitting" class="btn-submit">
                        {{ $t('Save Details' )}}
                    </button>
                </div>
            </form>

        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import { IonBackButton, IonItem, IonInput, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, alertController, onIonViewDidEnter } from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
//import * as yupp from 'yup-phone';

import router from '@/router';
import store from '@/store';

import { errorMessage } from '@/services/HTMLService';
import { updateAccount, getAccount } from '@/services/AccountService';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';
import TelephoneInput from '@/components/telephone/TelephoneInput.vue';

const { t } = useI18n({ useScope: "global" });

const loading = ref(true);

//onIonViewDidEnter

onMounted(() => {
    
    trackView('profile-page');

    getAccount().then(res => {
        
        const arrName = res.customer_name.split(" ");

        setValues({
            first_name: arrName[0],
            last_name: arrName[1],
            email: res.customer_email,
            phone_number: res.customer_phone_number,
            country_code: res.country_code
        });

        loading.value = false;

    }).catch((e) => { 
        console.error(e);
    });
})

const { errors, defineInputBinds, meta, handleSubmit, setValues, setFieldValue } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            first_name: yup.string().min(1).required(),
            last_name: yup.string().min(1).required(),
            email: yup.string().email().required(),
            phone_number: yup.number().required(),//.phone()
            country_code: yup.number()
        })
    ),
});

const email = defineInputBinds('email', {
    validateOnInput: true
});
const first_name = defineInputBinds("first_name", {
    validateOnInput: true,
});
const last_name = defineInputBinds('last_name', {
    validateOnInput: true,
});
const phone_number = defineInputBinds('phone_number', {
    validateOnInput: true,
});

const country_code = defineInputBinds('country_code', {
  validateOnInput: true,
});

function onTelephoneChange(data) {
  setFieldValue('country_code', data.country_code);
  setFieldValue('phone_number', data.phone_number);
}

const submitting = ref(false);

const onSubmit = handleSubmit(values => {

    submitting.value = true;

    updateAccount(values).then(async res => {

        submitting.value = false;

        if (res.operation == 'success' && res.unVerifiedToken) {

            store.commit('unVerifiedToken', res.unVerifiedToken);

            router.push('/verify-email/' + values.email);

        } else if (res.operation == 'success') {

            store.commit('updateUser', { 
                name: res.model.customer_name
            });

            router.push('/');

        } else if (res.operation == 'error') {

            const alert = await alertController.create({
                header: t('Unable to Update'),
                message: errorMessage(res.message),
                buttons: [t('Okay')],
            });

            await alert.present();
        }
    }).catch(() => {
        submitting.value = false;
    });
});


</script>
<style lang="scss" scoped>

ion-grid {
    margin: 0 -5px;
    padding: 0;

    ion-col {
        padding: 0 5px;
    }
}

ion-buttons[slot="end"] button {
    background: transparent;
    color: var(--ion-color-primary, #453E9A);
    text-align: var(--end);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
    margin-inline-end: 8px;
}
</style>
