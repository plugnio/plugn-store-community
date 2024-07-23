<template>
    <ion-header>
        <ion-toolbar>
            <!-- Back Button -->
            <ion-buttons slot="start">
                <ion-back-button text="" mode="md" @click="dismiss()" defaultHref="/"></ion-back-button>
            </ion-buttons>

            <ion-title>
               {{ $t("Pickup from ") }}
            </ion-title>

        </ion-toolbar> 
    </ion-header>

    <ion-content>
 
            <!-- Search Input -->
            <ion-searchbar v-if="searchText" v-model="searchTerm"
                mode="ios" :debounce="350" @ionInput="searchBusinessLocations()" :moda="'ios'"
                :placeholder="$t('Search branches')">
            </ion-searchbar>

            <ion-list>
                <!-- Branch name-->
                <ion-item v-for="(businessLocation, index) of props.businessLocations" :key="index">

                    <!-- todo: ui if lat long provided -->
                    <ion-button v-if="businessLocation.latitude && businessLocation.longitude" slot="end" fill="clear"
                        size="large" color="primary" @click="getDirection(businessLocation)">
                        <ion-icon :icon="openOutline"></ion-icon>
                    </ion-button>

                    <ion-label style="font-size: 20px; white-space: inherit;" tappable
                        @click="onBranchSelected(businessLocation)">
                        <h5>{{ langContent(businessLocation.business_location_name, businessLocation.business_location_name_ar) }}</h5>
                        <p v-if="businessLocation.address">{{ businessLocation.address }}</p>
                        <p v-if="businessLocation['country']">{{ businessLocation['country']['country_name'] }}</p>
                    </ion-label>
                </ion-item>

                <template v-if="props.loadingPickupLocations">
                    <ion-item>   
                        <ion-label style="font-size: 20px; white-space: inherit;">
                            <h5><IonSkeletonText :animated="true" style="width: 300px;"></IonSkeletonText></h5>
                            <p><IonSkeletonText :animated="true" style="width: 350px;"></IonSkeletonText></p>
                            <p><IonSkeletonText :animated="true" style="width: 250px;"></IonSkeletonText></p>
                        </ion-label>
                    </ion-item>
                    
                    <ion-item>   
                        <ion-label style="font-size: 20px; white-space: inherit;">
                            <h5><IonSkeletonText :animated="true" style="width: 300px;"></IonSkeletonText></h5>
                            <p><IonSkeletonText :animated="true" style="width: 350px;"></IonSkeletonText></p>
                            <p><IonSkeletonText :animated="true" style="width: 250px;"></IonSkeletonText></p>
                        </ion-label>
                    </ion-item>
                    
                    <ion-item>   
                        <ion-label style="font-size: 20px; white-space: inherit;">
                            <h5><IonSkeletonText :animated="true" style="width: 300px;"></IonSkeletonText></h5>
                            <p><IonSkeletonText :animated="true" style="width: 350px;"></IonSkeletonText></p>
                            <p><IonSkeletonText :animated="true" style="width: 250px;"></IonSkeletonText></p>
                        </ion-label>
                    </ion-item>

                </template>
            </ion-list>
         
    </ion-content>
</template>
<script setup lang="ts">
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';
import { getPickupLocations } from '@/services/DeliveryZoneService';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import { IonButtons, IonBackButton, IonContent, IonButton, IonIcon, IonHeader, IonToolbar, IonTitle, IonList, IonItem, IonLabel, IonSearchbar, modalController, IonSkeletonText } from '@ionic/vue';
import { openOutline } from 'ionicons/icons';
import { onMounted, reactive, ref } from 'vue';

const searchTerm = ref(null);
const searchText = ref(null);
 
//unfilteredBusinessLocations, businessLocations, loadingPickupLocations

const props = reactive({
       
    unfilteredBusinessLocations: [],
    businessLocations: [], 
    loadingPickupLocations: true, 

    selected_shipping_method: ''
});

onMounted(() => {
    
    trackView('business-location-page');

    listPickupLocations();
});

/**
 * List all pick up locations
 */
function listPickupLocations() {

    props.loadingPickupLocations = true;

    getPickupLocations().then(response => {

        props.businessLocations = response;

        props.unfilteredBusinessLocations = response;

        props.loadingPickupLocations = false;

    }).catch(() => {
        props.loadingPickupLocations = false;
    });
}
 
/**
* Display search results based on user input
*/
function searchBusinessLocations() {

    props.loadingPickupLocations = true;

    const clonedBusinessLocations = JSON.parse(JSON.stringify(props.unfilteredBusinessLocations));

    props.businessLocations = clonedBusinessLocations.filter((businessLocation: { business_location_name: string; business_location_name_ar: string; }) => {
        
        if (
            businessLocation.business_location_name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1 || 
            businessLocation.business_location_name_ar.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1
        ) {
            return true;
        }
 
        return false;
    });
}
 
function dismiss(data = {}) {
    modalController.getTop().then(o => {
        if (o) {
            o.dismiss(data);
        } else {
            router.back();
        }
    });
}

/**
 * select shipping method
 * @param selected_area 
 */
function onBranchSelected(businessLocation) {
 
    store.commit('setShippingMethod', {
        ...businessLocation,
        'order_mode': 2
    });
  
    dismiss({
        businessLocation: businessLocation
    }); 
}

/**
 * 
 */
function getDirection(businessLocation: { latitude: string; longitude: string; }) {
    if (businessLocation && businessLocation.latitude && businessLocation.longitude) {
        const redirectUrl = 'https://www.google.com/maps/dir/?api=1&destination=' + businessLocation.latitude + ',' + businessLocation.longitude;
        window.open(redirectUrl, '_blank');
    }
}
</script>