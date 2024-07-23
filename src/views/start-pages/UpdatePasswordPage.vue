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
          {{ $t("Update password") }} 
        </ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">

      <form @submit.stop.prevent="onSubmit">

        <ion-item class="form-field form-password">
          <ion-input :type="showPassowrd ? 'text': 'password'" v-bind="password" autocomplete="new-password" 
            :label="$t('New Password')" label-placement="floating" :placeholder="$t('Enter new password')"></ion-input>
            <button type="button" slot="end" @click="togglePasswordVisibility()">
              <ion-icon :icon="showPassowrd? eyeOutline: eyeOffOutline"></ion-icon>
            </button> 
        </ion-item>
        <p class="txt-field-error" v-if="errors.password">
          {{ $t('Passwords should be between 6 and 16 characters.') }}
        </p>
        
        <div class="btn-wrapper">
          <button :disabled="!meta.valid || submitting" class="btn-submit">
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
import { chevronBack, eyeOffOutline, eyeOutline } from 'ionicons/icons';

//form validation 

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { updatePassword } from '@/services/AuthService';
import { ref } from 'vue';
import { errorMessage } from '@/services/HTMLService';
import router from '@/router';
import store from '@/store';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: "global" });

const showPassowrd = ref(false);

function togglePasswordVisibility() {
  showPassowrd.value = !showPassowrd.value;
}

const { errors, defineInputBinds, meta, handleSubmit } = useForm({
  validationSchema: toTypedSchema(
    yup.object({
      //confirm_password: yup.string().min(6).max(12).required(), 
      password: yup.string().min(6).max(12).required(),
    })
  ),
});

const password = defineInputBinds('password', {
  validateOnInput: true,
}); 

const submitting = ref(false);

const onSubmit = handleSubmit(values => { 

  submitting.value = true;
 
  const params = {
    newPassword: values.password,
    token: router.currentRoute.value.params['token']
  }
  updatePassword(params).then(async res => {

    submitting.value = false;

    if (res.operation == 'success' && res.token) {

      store.commit('login', res);

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

onIonViewDidEnter(() => {
  trackView('update-password-page');
})

</script>

<style lang="scss" scoped></style>