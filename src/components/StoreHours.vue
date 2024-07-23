<template>
<ion-content>
    <h2>
        {{ $t('Store business hours') }}
            
        <button @click="dismiss()" class="btn-close">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M14.7908 5.20921C15.0697 5.48816 15.0697 5.94042 14.7908 6.21936L6.21936 14.7908C5.94042 15.0697 5.48816 15.0697 5.20921 14.7908C4.93026 14.5118 4.93026 14.0596 5.20921 13.7806L13.7806 5.20921C14.0596 4.93026 14.5118 4.93026 14.7908 5.20921Z" fill="#3D3D3D"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.20921 5.20921C5.48816 4.93026 5.94042 4.93026 6.21936 5.20921L14.7908 13.7806C15.0697 14.0596 15.0697 14.5118 14.7908 14.7908C14.5118 15.0697 14.0596 15.0697 13.7806 14.7908L5.20921 6.21936C4.93026 5.94042 4.93026 5.48816 5.20921 5.20921Z" fill="#3D3D3D"/>
            </svg>
        </button>

    </h2>

    <p v-for="(element, index) in store.state.store.openingHours" :key="index">
        <b>{{ dayName(element.day_of_week) }}:</b>
        <span v-if="element.is_closed">Closed</span>
        <span v-if="!element.is_closed">
            {{ formatDate(element.open_at, 'h:mm aa', true) }} - 
            {{ formatDate(element.close_at, 'h:mm aa', true) }}
        </span>
    </p>
</ion-content>    
</template>
<script setup lang="ts">
import { IonContent, modalController } from '@ionic/vue';
import store from '@/store';
import { formatDate } from '@/services/TranslateService';

function dismiss() {
    modalController.dismiss();
} 

function dayName(i) {
    switch (i) {
      case 0:
        return 'Sun';
      case 1:
        return 'Mon';
      case 2:
        return 'Tue';
      case 3:
        return 'Wed';
      case 4:
        return 'Thu';
      case 5:
        return 'Fri';
      case 6:
        return 'Sat';
      default:
        break;
    }
}

</script>
<style lang="scss" scoped>

p {
    margin-bottom: 16px;
    color: var(--ion-color-dark);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;  

    b {
        margin-inline-end: 8px;
        width: 40px;
        display: inline-block;
    }
}

.btn-close {
    border-radius: 16px;
    background: var(--ion-shades-neutral-n-3, #EBEBEB);
    display: flex;
    padding: 4px;
    align-items: center;
    gap: 8px;
    width: 28px;
    height: 28px;
    float: var(--end);
}

h2 {
    color: var(--ion-color-dark);
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24.8px; /* 137.778% */
    margin-bottom: 18px;
    margin-top: 0;
}

ion-content {
    --ion-padding: 24px; 
    --padding-start: 24px;
    --padding-end: 24px;
    --padding-top: 24px;
    --padding-bottom: 24px;
}
</style>