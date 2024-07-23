<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <item-search @change="onChange"></item-search>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <search-item :query="query" :item="item" v-for="(item, index) in items.values" 
                :key="index"></search-item>
             
        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar, onIonViewDidEnter } from '@ionic/vue';
import ItemSearch from '@/components/ItemSearch.vue';
import { getItems } from '@/services/StoreService';
import { reactive, ref } from 'vue';
 
import { chevronBack } from 'ionicons/icons';
import SearchItem from '@/components/SearchItem.vue';
import { trackView } from '@/services/AnalyticsService';

const items = reactive([]);
const query = ref();

function onChange(payload) { 

    query.value = payload.value;

    getItems(1, null, payload.value).then(res => {
        items.values = res.data;
    }).catch((e) => { 
        console.error(e);
    });
}

onIonViewDidEnter(() => {
    trackView('search-page');
})

</script>
