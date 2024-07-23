<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text=""  defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title>
                    {{ $t("Orders") }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <customer-order :order="order" v-for="(order, index) in props.orders" :key="index"></customer-order>

            <template v-if="props.loading">
                <customer-order></customer-order>
                <customer-order></customer-order>
                <customer-order></customer-order>
            </template>

            <div class="no-data" v-if="props.noItems">

                <img src="@/assets/icons/empty-box.svg" />

                <h5>{{ $t("No orders history yet") }}</h5>

                <p>{{ $t("Your orders will appear hear once you make one") }}</p>

                <router-link to="/" class="btn">
                    {{ $t("Order Now") }}
                </router-link>
            </div>

            <ion-infinite-scroll @ionInfinite="ionInfinite">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import CustomerOrder from '@/components/CustomerOrder.vue';
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';
import { getOrders } from '@/services/OrderService';
import { InfiniteScrollCustomEvent, IonBackButton, IonButtons, IonContent, IonHeader, IonInfiniteScroll, IonInfiniteScrollContent, IonPage, IonTitle, IonToolbar, onIonViewDidEnter } from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import { reactive } from 'vue';

const props = reactive({
    orders: [],
    currentPage: 1,
    totalPages: null,
    loading: true,
    noItems: false
});

onIonViewDidEnter(() => {
    
    trackView('order-list-page');

    props.loading = true;

    getOrders(props.currentPage).then(res => {
        
        if(props.currentPage == 1) {
            props.orders = res.data;
        } else {
            props.orders = props.orders.concat(res.data);
        }
        
        props.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'));
         
        props.loading = false;

        if(props.orders.length == 0) {
            props.noItems = true;
        } else {
            props.noItems = false;
        }

    }).catch(() => {
        props.loading = false;
    });
});

const ionInfinite = (ev: InfiniteScrollCustomEvent) => {

    if (props.currentPage == props.totalPages) {
        ev.target.complete();
        return false;
    }

    props.currentPage++;
     
    props.loading = true;

    getOrders(props.currentPage).then(res => {

        props.orders = props.orders.concat(res.data);
        props.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'));
        
        props.loading = false;
        ev.target.complete();
    }).catch(() => {
        props.loading = false;
        ev.target.complete();
    });
};

</script>