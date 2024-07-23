<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>
                <ion-title>
                    {{ $t("Addresses") }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <div class="no-data" v-if="props.noData">

                <img src="@/assets/icons/no-address.svg" />

                <h5>{{ $t("No addresses saved yet") }}</h5>

                <p>{{ $t("You can manage your address book from here") }}</p>

                <router-link to="/address-form" class="btn">
                    {{ $t("Add New Address") }}
                </router-link>

            </div>

            <ion-item tappable @click="openAddressForm(address)" v-for="(address, index) of props.addresses" :key="index">
                <ion-thumbnail slot="start">
                    <img v-if="address.unit_type == 'apartment'" src="../../../assets/icons/home.svg" />
                    <img v-if="address.unit_type == 'office'" src="../../../assets/icons/work.svg" />
                    <img v-if="address.unit_type == 'home'" src="../../../assets/icons/location.svg" />
                </ion-thumbnail>

                <ion-label>
                    <h5>{{ $t(address.unit_type) }}</h5>
                    <p>
                        <!--
                        <span v-if="address.house_number">
                            {{ address.house_number }}, 
                        </span>
                        office
                        <span v-if="address.unit_type == 'apartment'">
                            {{ address.floor }}th floor {{ address.apartment }}, 
                        </span>-->

                        <span v-if="address.building">{{ address.building }}, </span>
                    
                        <span v-if="address.block">{{ address.block }}, </span>
                        <span v-if="address.street">{{ address.street }}, </span>
                        <span v-if="address.avenue">{{ address.avenue }}, </span>
                        <span v-if="address.address_1">{{ address.address_1 }}, </span>
                        <span v-if="address.address_2">{{ address.address_2 }}, </span>

                        <br />
                        
                        <span v-if="address.area">{{ langContent(address.area.area_name, address.area.area_name_ar) }}</span>
                        <span v-if="address.city">{{ langContent(address.city.city_name, address.city.city_name_ar) }}</span>
                        <span v-if="address.postalcode"> - {{ address.postalcode }}, </span>
                        <span v-if="address.country">{{ langContent(address.country.country_name, address.country.country_name_ar) }}</span>
                    </p>
                </ion-label>
                <img slot="end" class="rotate-ar" src="../../../assets/icons/chevron-right.svg" />
            </ion-item>

            <template v-if="props.loading">
                <ion-item>
                    <ion-thumbnail slot="start">
                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                    </ion-thumbnail>
                    <ion-label>
                        <h5>
                            <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                        </h5>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                        </p>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                        </p>
                    </ion-label>
                </ion-item>
                
                <ion-item>
                    <ion-thumbnail slot="start">
                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                    </ion-thumbnail>
                    <ion-label>
                        <h5>
                            <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                        </h5>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                        </p>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                        </p>
                    </ion-label>
                </ion-item>

                <ion-item>
                    <ion-thumbnail slot="start">
                        <ion-skeleton-text :animated="true"></ion-skeleton-text>
                    </ion-thumbnail>
                    <ion-label>
                        <h5>
                            <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                        </h5>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                        </p>
                        <p>
                            <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                        </p>
                    </ion-label>
                </ion-item>
            </template>
            
            <ion-infinite-scroll @ionInfinite="ionInfinite">
                <ion-infinite-scroll-content></ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </ion-content>

        <div class="btn-wrapper" v-if="props.addresses.length > 0">
            <router-link to="/address-form">
                <button class="btn-submit">{{ $t("Add New Address") }}</button>
            </router-link>
        </div>
    </ion-page>
</template>
<script setup  lang="ts">
import { IonBackButton, IonInfiniteScroll, IonInfiniteScrollContent, IonButtons, IonThumbnail, 
    IonSkeletonText, IonLabel, IonItem, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, 
    onIonViewDidEnter, InfiniteScrollCustomEvent } from '@ionic/vue';
import { chevronBack } from 'ionicons/icons';
import { reactive, ref } from 'vue';
import { getAddresses } from '@/services/AddressService';
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';
import { langContent } from '@/services/TranslateService';

//{ addresses, currentPage, totalPages, loading }

const props = reactive({
    addresses: [],
    currentPage: 1,
    totalPages: null,
    loading: true,
    noData: false
});

onIonViewDidEnter(() => {
    
    trackView('address-list-page');

    props.loading = true;

    getAddresses(props.currentPage).then(res => {
        
        if(props.currentPage == 1) {
            props.addresses = res.data;
        } else {
            props.addresses = props.addresses.concat(res.data);
        }
        
        props.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'));
         
        props.loading = false;

        if(props.addresses.length == 0) {
            props.noData = true;
        } else {
            props.noData = false;
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

    getAddresses(props.currentPage).then(res => {

        props.addresses = props.addresses.concat(res.data);
        props.totalPages = parseInt(res.headers.get('X-Pagination-Page-Count'));
        
        props.loading = false;
        ev.target.complete();
    }).catch(() => {
        props.loading = false;
    });
};

function openAddressForm(address) {
    router.push('/address-form/' + address.address_id);
}

</script>
<style lang="scss" scoped>
ion-item {
    align-items: center;
    gap: 12px;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    --inner-border-width: 0;
    margin-bottom: 14px;
    --ion-padding-end: 0;
    --padding-end: 0;

    h5 {
        color: #000;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 21px;
        /* 131.25% */
        letter-spacing: -0.32px;
    }

    p {
        color: var(--ion-color-medium-shade, #707070);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
    }

    ion-thumbnail {
        border-radius: 12px;
        background: var(--ion-color-light-shade, #F7F7F7);
        margin-inline-end: 12px;
        width: 40px;
        height: 40px;
        --size: 40px;
        overflow: hidden;

        img {
            width: 24px;
            height: 24px;
            margin: 8px;
        }
    }

}
</style>
