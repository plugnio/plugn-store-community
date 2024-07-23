<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" :icon="chevronBack" defaultHref="/" color="primary">
            <img src="../../assets/icons/chevron-left.svg" />
          </ion-back-button>
        </ion-buttons>
        <ion-title>
         {{ $t("Create an Account") }} 
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <form @submit.stop.prevent="onSubmit">

        <ion-grid>
          <ion-row>
            <ion-col>
                      
              <ion-item class="form-field">
                <ion-input v-bind="first_name" autocomplete="given-name" :label="$t('First Name')" label-placement="floating"
                  :placeholder="$t('Enter first name')"></ion-input>
              </ion-item>
              <p class="txt-field-error" v-if="errors.first_name">
                {{ $t("First name is a required field") }}</p>
            </ion-col>
            <ion-col>
              <ion-item class="form-field">
                <ion-input v-bind="last_name" autocomplete="family-name" :label="$t('Last Name')" label-placement="floating"
                  :placeholder="$t('Enter last name')"></ion-input>
              </ion-item>
              <p class="txt-field-error" v-if="errors.last_name">
                {{ $t("Last name is a required field") }}</p>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-item class="form-field">
          <ion-input v-bind="email" autocomplete="email" inputmode="email" :label="$t('Email')" label-placement="floating"
            :placeholder="$t('Enter email')"></ion-input>
        </ion-item>
        <p class="txt-field-error" v-if="errors.email">
            {{ $t("Email is a not valid field") }}
        </p> 

        <ion-item class="form-field form-password">
          <ion-input :type="showPassowrd ? 'text': 'password'" v-bind="password" autocomplete="new-password" :label="$t('Password')" label-placement="floating"
            :placeholder="$t('Enter password')"></ion-input>
            <button type="button" slot="end" @click="togglePasswordVisibility()">
              <ion-icon :icon="showPassowrd? eyeOutline: eyeOffOutline"></ion-icon>
            </button> 
        </ion-item>
        <p class="txt-field-error" v-if="errors.password">
          {{ $t('Passwords should be between 6 and 16 characters.') }}
        </p>
        <!--<p class="txt-field-error">{{ $t(errors.password) }}</p>-->

       
          <TelephoneInput :country_code="country_code.value"  :phone_number="phone_number.value" 
            @onChange="onTelephoneChange"></TelephoneInput>
            <!--
          <ion-input v-bind="phone_number" autocomplete="tel" inputmode="tel" :label="$t('Phone Number')" label-placement="floating"
            :placeholder="$t('Enter phone number')"></ion-input>-->
         
        <p class="txt-field-error" v-if="errors.phone_number">
          {{ errors.phone_number }}
            {{ $t("{field} is a required field", { "field": "test" }) }}
        </p> 
          
        <p class="txt-terms" v-html="$t('account_terms', {
            privacy: 'https://www.plugn.io/privacy-policy',
            terms: 'https://www.plugn.io/privacy-policy'
        })"></p> 

        <div class="btn-wrapper">
          <p class="txt-help">
            {{ $t("Already have an account?") }} <router-link to="/email-login"><a>{{ $t("Login") }}</a></router-link></p>

          <button :disabled="!meta.valid || submitting" class="btn-register">
            <template v-if="!submitting">{{ $t('Create an Account') }}</template>  
            <IonSpinner v-if="submitting"></IonSpinner>
          </button>
        </div>
      </form>

    </ion-content>
  </ion-page>
</template>      

<script setup lang="ts">
import { IonItem, IonInput, IonButtons, IonIcon, IonContent, IonHeader, IonBackButton, IonPage, IonTitle, IonToolbar, alertController, onIonViewDidEnter, IonSpinner } from '@ionic/vue';
import { chevronBack, eyeOffOutline, eyeOutline } from "ionicons/icons";
import { createAccount } from '@/services/AuthService';
import { errorMessage } from '@/services/HTMLService'; 
import { ref } from 'vue';
import store from '@/store';
import router from '@/router';

//form validation 

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';
import TelephoneInput from '@/components/telephone/TelephoneInput.vue';
//import * as yupp from 'yup-phone';

const { t } = useI18n({ useScope: "global" });

const showPassowrd = ref(false);

function togglePasswordVisibility() {
  showPassowrd.value = !showPassowrd.value;
}

const { errors, defineInputBinds, meta, handleSubmit, setFieldValue } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      first_name: yup.string().min(1).required(),
      last_name: yup.string().min(1).required(),
      email: yup.string().email().required(),
      password: yup.string().min(6).max(12).required(),
      phone_number: yup.number().required(),//.phone()
      country_code: yup.number()
    })
  ),
});

const email = defineInputBinds('email', {
  validateOnInput: true
});
const password = defineInputBinds('password', {
  validateOnInput: true,
});
const first_name = defineInputBinds('first_name', {
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

  createAccount(values).then(async res => {

    submitting.value = false;

    if (res.operation == 'success' && res.unVerifiedToken) {

      store.commit('unVerifiedToken', res.unVerifiedToken);
      
      router.push('/verify-email/' + values.email);

    } else if (res.operation == 'success' && res.token) {

      store.commit('login', res);

      router.push('/');

    } else if (res.operation == 'error') {

      const alert = await alertController.create({
        header: t('Unable to Sign Up'), 
        message: errorMessage(res.message),
        buttons: [t('Okay')],
      });

      await alert.present();
    }
  }).catch(async () => {

    const alert = await alertController.create({
      header: t('Oops...'), 
      message: t('Unable to Sign Up'), 
      buttons: [t('Okay')],
    });

    await alert.present();
    
    submitting.value = false;
  });

});

onIonViewDidEnter(() => {
  trackView('register-page');
})

</script>

<style lang="scss" scoped>

ion-grid {
    margin: 0 -5px;
    padding: 0;

    ion-col {
        padding: 0 5px;
    }
}
.txt-terms {
  color: var(--ion-color-medium-shade, #707070);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
  margin-top: 40px;

  a {
    color: var(--ion-color-warning-shade);
  }
}
</style>