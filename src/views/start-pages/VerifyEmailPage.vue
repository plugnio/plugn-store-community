<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" :icon="chevronBack" defaultHref="/" color="primary">
                        <img src="../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
            </ion-toolbar>
            <ion-title></ion-title>
        </ion-header>

        <ion-content :fullscreen="true">

            <h4>{{ $t("We've sent you a confirmation link") }}</h4>
            <p> {{ $t("Please check your email so you can verify your account") }} </p>

            <div class="btn-wrapper">
                <button :disabled="submitting" @click="resendEmail()" class="btn-submit">
                    <template v-if="!submitting">{{ $t('Resend Confirmation Link') }}</template>  
                    <IonSpinner v-if="submitting"></IonSpinner>
                </button>
            </div>

            <p class="txt-spam-folder">{{ $t("Email not found in inbox? Please check spam folder.") }} </p>

        </ion-content>
 
    </ion-page>
</template>
<script setup  lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, alertController, onIonViewDidEnter } from '@ionic/vue';
import { ref } from 'vue';
import { requestResetPassword, verifyEmail } from '@/services/AuthService';
import { errorMessage } from '@/services/HTMLService';

import router from '@/router';
import store from '@/store';
import { chevronBack } from 'ionicons/icons';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: "global" });

const submitting = ref(false);
//const submitting = ref(false);

const email = router.currentRoute.value.params['email'];
const code = router.currentRoute.value.params['code'];

onIonViewDidEnter(() => {

    trackView('verify-email-page');

    if (code) {
        verify();
    }
});

function resendEmail() {

    submitting.value = true;

    requestResetPassword(email).then(async res => {

        submitting.value = false;

        if (res.operation == 'success' && res.unVerifiedToken) {

            store.commit('unVerifiedToken', res.unVerifiedToken);

            router.push('/verify-email/' + email);

        } else if (res.operation == 'success' && res.token) {

            store.commit('login', res);

            router.push('/');

        } else if (res.operation == 'error') {

            const alert = await alertController.create({
                header: t("Unable to Sign Up"),
                subHeader: t("Important message"),
                message: errorMessage(res.message),
                buttons: [t("Okay")],
            });

            await alert.present();
        }
    }).catch(() => {
        submitting.value = false;
    });
}

/**
 * Verify verification code
 */
function verify() {

    submitting.value = true;

    verifyEmail(email, code).then(async res => {

        submitting.value = false;

        if (res.operation == 'success') {

            store.commit('unVerifiedToken', null);
              
            if (!store.state.isLogin) { 
                store.commit('login', res);
            }// on email update from profile page

            router.push('/');

        } else {

            const alert = await alertController.create({
                header:  t("Unable to Verify Your Email") , 
                message: errorMessage(res.message),
                buttons: [t("Okay")],
            });

            await alert.present();
        }
    }).catch(() => {
        submitting.value = false;
    });
}


</script>