<template>
    <ion-list @click="dismiss()">
        <ion-item lines="none" target="_blank" :href="'https://twitter.com/intent/tweet?text=' + message + '&url=' + url + '&related='">
            <ion-icon :icon="logoTwitter"></ion-icon>
            <ion-label>
                {{ $t('Twitter') }}
            </ion-label>
        </ion-item>
        <ion-item lines="none" target="_blank" :href="'https://www.facebook.com/sharer/sharer.php?u=' + url">
            <ion-icon :icon="logoFacebook"></ion-icon>
            <ion-label>
                {{ $t('Facebook') }}
            </ion-label>
        </ion-item>
        <ion-item lines="none" target="_blank" :href="'mailto:?subject=' + subject + '&body=' + encodeURI(message) + ' ' + url">
            <ion-icon :icon="mail"></ion-icon>
            <ion-label>
                {{ $t('Email') }}
            </ion-label>
        </ion-item>
    </ion-list>
</template>
<script lang="ts" setup>
import { IonIcon, IonItem, IonLabel, IonList, popoverController } from '@ionic/vue';
import { logoFacebook, logoTwitter, mail } from 'ionicons/icons';
 
defineProps(['subject','message', 'url']);

function dismiss() {
    popoverController.dismiss();
}

</script>
<style scoped lang="scss">
ion-icon {
    margin-inline-end: 15px;
}
</style>