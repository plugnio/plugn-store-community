<template>
    <ion-page>
        
        <ion-content :fullscreen="true">

            <div class="desktop-view">
                <div class='brand ion-text-center'>
                    <img src="../../assets/icons/disconnect.svg" /> 
                </div>

                <div class="error-msg">

                    <h2>{{ $t("Opps! Store Not Found")}}</h2>

                    <p>{{ $t("The page may have moved or there is a problem on our end.") }}</p>

                    <ion-button href="mailto:contact@plugn.io" class="btn-refresh">
                        {{ $t("Contact Us") }}
                    </ion-button>
                </div>
            </div>

        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import { trackView } from '@/services/AnalyticsService';
import { IonContent, IonPage, IonButton, onIonViewDidEnter } from '@ionic/vue';

onIonViewDidEnter(() => {
    trackView('404-page');
});

</script>
<style scoped lang="scss">

.brand img {
    width: 200px;
    margin-top: 120px;
    margin-bottom: 25px;
}

p {
    margin: 20px auto 35px;
}

</style>