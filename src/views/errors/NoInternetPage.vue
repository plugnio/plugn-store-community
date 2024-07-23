<template>
    <ion-page>
        
        <ion-content :fullscreen="true">

            <div class="desktop-view">
                <div class='brand ion-text-center'>
                    <img src="../../assets/images/error-offline.png" /> 
                </div>

                <div class="error-msg">

                    <h2>{{ $t('No Internet Connection') }}</h2>

                    <p>{{ $t('Make sure your device in connected to internet') }}</p>

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
    trackView('no-internet-page');
});

</script>
<style scoped lang="scss">

.brand img {
    width: 200px;
    margin-top: 120px;
    margin-bottom: 45px;
}
</style>