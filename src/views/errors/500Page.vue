<template>
    <ion-page>
     
        <ion-content :fullscreen="true">

            <div class="desktop-view">

                <div class='brand ion-text-center'>
                    <img src="../../assets/images/error-500.png" /> 
                </div>

                <div class="error-msg">

                    <h2>{{ $t('Server Error') }}</h2>

                    <p>{{ $t('There seems to be an error from our end.') }}</p>

                    <ion-button href="/" class="btn-refresh">
                        {{ $t('Refresh Page') }}
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
    trackView('500-page');
});

</script>
<style scoped lang="scss">

.brand img {
    width: 200px;
    margin-top: 120px;
    margin-bottom: 45px;
}
</style>