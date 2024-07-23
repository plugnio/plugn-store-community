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
          {{ $t('Recover Password') }}
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <form @submit.stop.prevent="onSubmit">

        <ion-item class="form-field">
          <ion-input v-bind="email" autocomplete="email" inputmode="email" 
            :label="$t('Email')" label-placement="floating"
            :placeholder="$t('Enter email')"></ion-input>
        </ion-item>
        <p class="txt-field-error" v-if="errors.email">
            {{ $t("Email is a not valid field") }}
        </p>

        <div class="btn-wrapper">
          <p class="txt-help">
            {{ $t('Your will receive password reset instruction in your mailbox.') }}
          </p>

          <button :disabled="!meta.valid || submitting" class="btn-register">
            <template v-if="!submitting">{{ $t('Submit') }}</template>  
            <IonSpinner v-if="submitting"></IonSpinner>
          </button>
        </div>

      </form>
    </ion-content>
  </ion-page>
</template>      

<script setup lang="ts">
import { IonItem, IonInput, IonButtons, IonContent, IonHeader, IonBackButton, IonPage, IonTitle, IonToolbar, alertController, onIonViewDidEnter, IonSpinner } from '@ionic/vue';

//form validation 

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { ref } from 'vue';
import { requestResetPassword } from '@/services/AuthService';
import { errorMessage } from '@/services/HTMLService';
import router from '@/router';
import { chevronBack } from 'ionicons/icons';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';
//import * as yupp from 'yup-phone';

const { t } = useI18n({ useScope: "global" });

const { errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      email: yup.string().email().required(),
    })
  ),
});

const email = defineInputBinds('email', {
  validateOnInput: true
});

const submitting = ref(false);

const onSubmit = handleSubmit(values => {

  submitting.value = true;

  requestResetPassword(values.email).then(async res => {

    submitting.value = false;

    const alert = await alertController.create({
      header: res.operation == 'success' ? t('Success') : t('Unable to Recover'),
      message: errorMessage(res.message),
      buttons: [t('Okay')],
    });

    await alert.present();

    router.push('/');
  }).catch(() => {
    submitting.value = false;
  });

});

onIonViewDidEnter(() => {
  trackView('forgot-password-page');
})

</script>

<style lang="scss" scoped></style>