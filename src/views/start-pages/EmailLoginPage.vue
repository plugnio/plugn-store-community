<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""  defaultHref="/" :icon="chevronBack" color="primary">
            <img src="../../assets/icons/chevron-left.svg" />
          </ion-back-button>
        </ion-buttons>
        <ion-title>
          {{ $t('Continue with Email') }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.stop.prevent="onSubmit">

        <ion-item class="form-field">
          <ion-input v-bind="email" inputmode="email" :label="$t('Email')" label-placement="floating"
            :placeholder="$t('Enter email')"></ion-input>
        </ion-item>
        <p class="txt-field-error" v-if="errors.email">
            {{ $t("Email is a not valid field") }}
        </p>

        <ion-item class="form-field form-password">
          <ion-input :type="showPassowrd ? 'text': 'password'" v-bind="password" :label="$t('Password')" label-placement="floating"
            :placeholder="$t('Enter password')"></ion-input>
          <button type="button" slot="end" @click="togglePasswordVisibility()">
            <ion-icon :icon="showPassowrd? eyeOutline: eyeOffOutline"></ion-icon>
          </button>
        </ion-item>
        <p class="txt-field-error" v-if="errors.password">
          {{ $t('Passwords should be between 6 and 16 characters.') }}
        </p>

        <router-link to="/forgot-password">
          <a class="txt-password">{{  $t('Forgot your password?') }}</a>
        </router-link>
        
        <div class="btn-wrapper">
          <p class="txt-register">
            {{ $t('Don’t have an account?') }}
             <router-link to="/register"><a>{{ $t('Create an Account')}}</a></router-link>
          </p>

          <button :disabled="!meta.valid || submitting" class="btn-login">
            <template v-if="!submitting">{{ $t('Login') }}</template> 
            <IonSpinner v-if="submitting"></IonSpinner>
          </button>
        </div>
      </form>

    </ion-content>
  </ion-page>
</template>      

<script setup lang="ts">
import { IonItem, IonInput, IonButtons, IonContent, IonHeader, IonIcon, IonBackButton, IonPage, IonTitle, IonToolbar, alertController, onIonViewDidEnter, IonSpinner } from '@ionic/vue';
import { chevronBack, eyeOffOutline, eyeOutline } from "ionicons/icons";

//form validation 

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { ref } from 'vue';
import { basicAuth } from '@/services/AuthService';
import store from '@/store';
import router from '@/router';
import { errorMessage } from '@/services/HTMLService';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: "global" });

const { errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().email().required(),
      password: yup.string().min(6).max(12).required(),
    })
  ),
});

const email = defineInputBinds('email', {
  validateOnInput: true,
});
const password = defineInputBinds('password', {
  validateOnInput: true,
});

const submitting = ref(false);
const showPassowrd = ref(false);

function togglePasswordVisibility() {
  showPassowrd.value = !showPassowrd.value;
}

const onSubmit = handleSubmit(values => {
  
  submitting.value = true;

  basicAuth(values.email, values.password).then(async res => {

    submitting.value = false;

    if (res.operation == 'success' && res.unVerifiedToken) {

      store.commit('unVerifiedToken', res.unVerifiedToken);
      
      router.push('/verify-email/' + values.email);

    } else if (res.operation == 'success' && res.token) {

      store.commit('login', res);

      router.push('/');

    } else if (res.operation == 'error') {

      const alert = await alertController.create({
        header: t('Unable to Login'),
        message: errorMessage(res.message),
        buttons: [t('Okay')],
      });

      await alert.present();
    }
  }).catch(async (err) => {
 
    if(err.response.headers.get('X-Empty-Password')) {
 
      const alert = await alertController.create({
        header: t('Set your password'), 
        message: err.response.headers.get('X-Empty-Password'),
        buttons: [t('Okay')],
      });

      await alert.present();
    
      router.push('/home');

    } else {

      const alert = await alertController.create({
        header: t('Oops...'), 
        message: t('Unable to login, please check your credentials!'),
        buttons: [t('Okay')],
      });

      await alert.present();
    }
 
    
    submitting.value = false;
  });
});

onIonViewDidEnter(() => {
  trackView('email-login-page');
})

</script>

<style lang="scss" scoped>
.txt-password {
  color: var(--ion-color-warning, #E39426);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px;
  /* 157.143% */
}
</style>