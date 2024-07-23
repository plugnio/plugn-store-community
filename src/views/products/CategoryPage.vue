<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../assets/icons/close.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title v-if="props.category">
                    {{ langContent(props.category.title, props.category.title_ar) }}
                </ion-title>
               
            </ion-toolbar>

        </ion-header>

        <ion-content :fullscreen="true">
            
            <!-- todo: ability to choose grid/list view -->
            
            <div class="list-view">
                <StoreItem layout="list" :item="item" v-for="(item, itemIndex) of items" :key="itemIndex">
                </StoreItem>

                <template v-if="props.loading">
                    <StoreItem layout="list"></StoreItem>
                    <StoreItem layout="list"></StoreItem>
                    <StoreItem layout="list"></StoreItem>
                </template>
            </div>
            
            <div class="no-data" v-if="props.noItems">

                <img src="@/assets/icons/empty-box.svg" />

                <h5>{{ $t('No items added yet!') }}</h5>
 
                <br />
        
                <router-link to="/" class="btn">
                    {{ $t('Home') }}
                </router-link>

            </div>

            <ion-infinite-scroll @ionInfinite="doInfiniteItems" v-if="totalPages > 0">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>
        
        </ion-content>
    </ion-page>
</template>
<script setup lang="ts">
import { IonBackButton, IonButtons, IonInfiniteScroll, IonInfiniteScrollContent, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import { reactive, ref } from 'vue';

import router from '@/router';
import store from '@/store';
import StoreItem from '@/components/StoreItem.vue';
import { getItems } from '@/services/StoreService';
import { trackView } from '@/services/AnalyticsService';
import { langContent } from '@/services/TranslateService';

const props = reactive({
    loading: true, 
    category: null,
    noItems: false
})  

const items = ref([]);
const totalPages = ref(0);
const currentPage = ref(1);
 
const slug = router.currentRoute.value.params['slug'];

onIonViewDidEnter(() => {
    trackView('category-page');

    props.category = store.state.store.categories.find(e => e.slug == slug);

    loadCategoryData();
});

/**
 * load category data
 */
function loadCategoryData(event = null, totalLoaded = 0) {

    props.loading = true;

    getItems(1, props.category.category_id).then((response: any) => {

        currentPage.value = parseInt(response.headers.get('X-Pagination-Current-Page'));
        totalPages.value = parseInt(response.headers.get('X-Pagination-Page-Count'));

        items.value = response.data;
  
        if (event) {
            event.target.complete();
        }

        props.loading = false;

        if(response.data.length > 0) {
            props.noItems = false; 
        } else {
            props.noItems = true; 
        }

    }).catch(() => {
        props.loading = false;
    });
}

/**
* load more on scroll to bottom
* @param event 
*/
function doInfiniteItems(event = null) {

    if (currentPage.value >= totalPages.value) {
      if(event && event.target)
        return event.target.complete();
      return null;  
    }

    props.loading = true;

    currentPage.value++;

    getItems(currentPage.value, props.category.category_id).then((response: any) => {

        currentPage.value = parseInt(response.headers.get('X-Pagination-Current-Page'));
        totalPages.value = parseInt(response.headers.get('X-Pagination-Page-Count'));
        //totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

        if (!items.value) {
            items.value = [];
        }

        items.value = items.value.concat(response.data);

        if (event)
            event.target.complete();

        props.loading = false;

    }).catch(() => {
        props.loading = false;
    });
}

</script>
