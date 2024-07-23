<template>
    <ion-header>
        <ion-toolbar>
            <!-- Back Button -->
            <ion-buttons slot="start">
                <button type="button" color="primary" @click="dismiss()">
                    <img src="@/assets/icons/close.svg" />
                </button>
                    <!--
                <ion-back-button text="" mode="md" @click="dismiss()" defaultHref="/"></ion-back-button>-->
            </ion-buttons>

            <ion-title>
                <span v-if="store.state.store.supportDelivery && store.state.store.supportPickup">
                    {{ $t('Order Mode') }}
                </span>

                <span v-if="store.state.store.supportDelivery && !store.state.store.supportPickup">
                    {{ $t('Deliver to') }}
                </span>

                <span value="pickup" v-if="store.state.store.supportPickup && !store.state.store.supportDelivery">
                    {{ $t('Pickup from') }}
                </span>
            </ion-title>

        </ion-toolbar>

        <ion-toolbar v-if="store.state.store.supportDelivery && store.state.store.supportPickup">
            <ion-segment @ionChange="changeShippingMethod($event)" v-model="selected_shipping_method" mode="md">
                <ion-segment-button value="delivery" v-if="store.state.store.supportDelivery">
                    <ion-label>{{ $t('Delivery') }}</ion-label>
                </ion-segment-button>
                <ion-segment-button value="pickup" v-if="store.state.store.supportPickup">
                    <ion-label>{{ $t('Pickup') }}</ion-label>
                </ion-segment-button>
            </ion-segment>
        </ion-toolbar>
    </ion-header>

    <ion-content v-if="selected_shipping_method">

        <!-- Store's Branches-->
        <div v-if="selected_shipping_method == 'pickup'">

            <!-- Search Input -->
            <ion-searchbar v-if="(businessLocations && businessLocations.length > 0) || searchText.value" v-model="searchTerm"
                mode="ios" :debounce="350" @ionInput="searchBusinessLocations()" :moda="'ios'"
                :placeholder="$t('Search branches')">
            </ion-searchbar>

            <skeleton-component :loading="businessLocations && businessLocations.length == 0 && loadingPickupLocations"
                type="country-list"></skeleton-component>

            <ion-list>
                <!-- Branch name-->
                <ion-item v-for="(businessLocation, index) of businessLocations" :key="index">

                    <ion-button v-if="businessLocation.latitude && businessLocation.longitude" slot="end" fill="clear"
                        size="large" color="primary" @click="getDirection(businessLocation)">
                        <ion-icon name="navigate"></ion-icon>
                    </ion-button>

                    <ion-label style="font-size: 20px; white-space: inherit;" tappable
                        @click="selectShippingMethod(businessLocation)">
                        {{
                            langContent(businessLocation.business_location_name, businessLocation.business_location_name_ar)
                        }}
                    </ion-label>
                </ion-item>
            </ion-list>
        </div>

        <div v-if="selected_shipping_method == 'delivery'">

            <!-- Search Input for country -->

            <ion-searchbar v-if="!country && countries && countries.length > 0"
                :placeholder="$t('Search Country')" v-model="searchTerm" mode="ios" :debounce="350"
                @ionInput="searchFilter()" :moda="'ios'"></ion-searchbar>

            <!-- Search Input for state -->

            <ion-searchbar v-if="country && country.iso != 'KW' && !state" 
                :placeholder="$t('Search state')"
                mode="ios" :debounce="350" @ionInput="searchState($event)" :moda="'ios'"></ion-searchbar>

            <!-- Search Input for cities -->

            <ion-searchbar v-if="country && state && country.iso != 'KW'" 
                :placeholder="$t('Search city')"
                mode="ios" :debounce="350" @ionInput="searchCity($event)" :moda="'ios'"></ion-searchbar>

            <!-- Search Input for areas -->

            <ion-searchbar v-if="country && country.iso == 'KW' && cities.length > 0"
                :placeholder="$t('Search areas')" v-model="searchText" mode="ios" :debounce="350"
                @ionInput="searchArea()" :moda="'ios'"></ion-searchbar>

            <skeleton-component :loading="cities && cities.length == 0 && country && loadingAreasData"
                type="area-list"></skeleton-component>

            <skeleton-component
                :loading="!country && countries && countries.length == 0 && loadingCountriesAvailableForDelivery"
                type="country-list"></skeleton-component>

            <!-- Store shipping to the following countries  -->

            <ion-list v-if="!country">
                <ion-item v-for="(countryRow, index) of countries" :key="index" @click="goToShippingMethodPage(countryRow)"
                    tappable>
                    <ion-label>
                        <p style="display: inline-flex;  font-size: 20px; " v-if="countryRow.emoji"> {{ countryRow.emoji }}
                        </p>
                        <span style=" font-size: 20px; ">
                            {{ langContent(countryRow.country_name, countryRow.country_name_ar) }}
                        </span>
                    </ion-label>
                </ion-item>
            </ion-list>

            <!-- Delivery states -->

            <div v-if="country && !state && states.length > 0">

                <ion-list v-for="(st, index) of states" :key="index" tappable @click="onStateSelected(st)">
                    <ion-item>
                        <ion-label>
                            {{ langContent(st.name, st.name_ar) }} 
                        </ion-label>
                    </ion-item>
                </ion-list>
            </div>

            <!-- Delivery cities-->

            <div v-if="country && country.iso != 'KW' && state">

                <ion-item v-for="(city, index) of cities" :key="index" tappable @click="onCitySelected(city)">
                    <ion-label>
                        {{ langContent(city.city_name, city.city_name_ar) }}
                    </ion-label>
                </ion-item>

                <ion-infinite-scroll threshold="100px" v-if="currentPage < totalPages" @ionInfinite="ionInfinite">
                    <ion-infinite-scroll-content loadingSpinner="bubbles">
                    </ion-infinite-scroll-content>
                </ion-infinite-scroll>
            </div>

            <!-- Delivery areas-->

            <div v-if="country && country.iso == 'KW' && cities && cities.length > 0">

                <ion-list v-for="(city, index) of cities" :key="index">
                    <!-- City name-->
                    <ion-list-header>
                        <h4 style="font-weight: 800;">
                            {{ langContent(city.city_name, city.city_name_ar) }}
                        </h4>
                    </ion-list-header>

                    <!-- Area name-->
                    <ion-item v-for="(areaDeliveryZone, index) of city.areas" :key="index"
                        @click="onAreaSelect(areaDeliveryZone)" tappable>
                        <ion-label>
                            {{
                               langContent(areaDeliveryZone.area.area_name, areaDeliveryZone.area.area_name_ar)
                            }}
                        </ion-label>
                    </ion-item>
                </ion-list>

            </div>

        </div>

        <div class="ion-text-center"
            v-if="selected_shipping_method == 'delivery' && !loadingCountriesAvailableForDelivery && !loadingPickupLocations && countries.length == 0 && !searchTerm.value">

            <h4>
                {{ $t("This store currently doesn't deliver to any country") }}
            </h4>
        </div>


        <div class="ion-text-center"
            v-if="selected_shipping_method == 'pickup' && !loadingPickupLocations && businessLocations.length == 0">

            <h4>
                {{ $t("This store currently doesn't support pickup") }}
            </h4>

        </div>

        <!--
        <template v-if="loadingCountriesAvailableForDelivery || loadingCitiesData || loadingAreasData || loadingPickupLocations">
            <ion-item>   
                <ion-label>
                    <IonSkeletonText :animated="true" style="width: 300px;"></IonSkeletonText>
                </ion-label>
            </ion-item>
            
            <ion-item>   
                <ion-label>
                    <IonSkeletonText :animated="true" style="width: 350px;"></IonSkeletonText>
                </ion-label>
            </ion-item>
            
            <ion-item>   
                <ion-label>
                    <IonSkeletonText :animated="true" style="width: 250px;"></IonSkeletonText>
                </ion-label>
            </ion-item>

        </template> -->

    </ion-content>
</template>
<script setup lang="ts">
import SkeletonComponent from '@/components/SkeletonComponent.vue';
import router from '@/router';
import { trackView } from '@/services/AnalyticsService';
import { getCities, getDeliveryAreaList, getStates, getCountriesAvailableForDelivery, getPickupLocations } from '@/services/DeliveryZoneService';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import { IonTitle, IonButton, IonHeader, IonToolbar, IonButtons, IonList, IonListHeader, IonItem, IonLabel, IonSegment, IonSegmentButton, 
     IonInfiniteScroll, IonInfiniteScrollContent, IonSearchbar, InfiniteScrollCustomEvent, 
     alertController, modalController, onIonViewDidEnter } from '@ionic/vue';
import { reactive, ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: "global" });

const searchTerm = ref(null);
const searchText = ref(null);
 
let { unfilteredCountries, unfilteredBusinessLocations, unfilteredCities, countries, cities, businessLocations, states,
    state_id, state, country_id, country, loadingCountriesAvailableForDelivery,
    loadingAreasData, loadingPickupLocations, areaExists, countryExists, businessLocationyExists,
    selected_shipping_method, currentPage, totalPages } = reactive({
        unfilteredCountries: [],
        unfilteredBusinessLocations: [],
        unfilteredCities: [],
        countries: [],
        cities: [],
        businessLocations: [],
        states: [],

        state_id: null,
        state: null,
        country_id: null,
        country: null,

        loadingCountriesAvailableForDelivery: true,
        loadingCitiesData: true,
        loadingAreasData: true,
        loadingPickupLocations: true,

        areaExists: false,
        countryExists: false,
        businessLocationyExists: false,

        selected_shipping_method: '',
 
        currentPage: 1,
        totalPages: null,
        loading: true
    });

onIonViewDidEnter(() => {

    trackView('shipping-to-page');

    listOfCountriesAvailableForDelivery();
});

const ionInfinite = (event: InfiniteScrollCustomEvent) => {

    if (currentPage >= totalPages) {
        if (event && event.target)
            event.target.complete();
        return null;
    }

    loadingAreasData = true;

    currentPage += 1;

    const action = state_id ?
        getCities(state_id) :
        getStates(country_id);

    action.then(response => {

        loadingAreasData = false;

        currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

        if (state_id) {
            cities.push(...response.data);
        } else {
            states.push(...response.data);
        }

        if (event && event.target)
            event.target.complete();
    }).catch(() => {
        loadingAreasData = false
    }); 
}

function searchState(event) {
    loadStoreStates(country.country_id, event.target.value);
}

function loadStoreStates(country_id: any, query = '') {

    loadingAreasData = true;

    getStates(country_id, query).then(response => {

        loadingAreasData = false;

        currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

        states = response.data;
    }).catch(() => {
        loadingAreasData = false;
    });
}

function searchCity(event) {
    loadStoreCities(state.state_id, event.target.value);
}

function loadStoreCities(state_id: any, query = '') {

    loadingAreasData = true;

    getCities(state_id, query).then(response => {

        loadingAreasData = false;

        currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
        totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));

        cities = response.data;

        //if no city and delivering to while state 


    }).catch(() => {
        loadingAreasData = false;
    });
}

/**
 * load all restaurant delivery areas
 */
function loadStoreDeliveryAreas(countryId: any) {
    loadingAreasData = true;

    getDeliveryAreaList(countryId).then(response => {

        loadingAreasData = false;

        if (response) {
            cities = response;
            unfilteredCities = cities;
        }
    }).catch(() => {
        loadingAreasData = false;
    });
}

/**
 * List all countries and areas that store shipping to
 */
function listOfCountriesAvailableForDelivery() {
    
    if (store.state.shippingMethod && store.state.shippingMethod.order_mode == 1 &&
        store.state.store.supportDelivery) {
        selected_shipping_method = 'delivery';
    }
    else if (store.state.shippingMethod && store.state.shippingMethod.order_mode == 2 &&
        store.state.store.supportPickup) {
        selected_shipping_method = 'pickup';
    }
    else if (store.state.store.supportDelivery) {
        selected_shipping_method = 'delivery';
    }
    else if (store.state.store.supportPickup) {
        selected_shipping_method = 'pickup';
    } 

    loadingCountriesAvailableForDelivery = true;

    getCountriesAvailableForDelivery().then(response => {

        listPickupLocations();

        countries = response;

        if (countries && countries.length == 1 && countries[0]['areas'] > 0) {
            country = countries[0];
            loadStoreDeliveryAreas(countries[0]['country_id']);
        }

        unfilteredCountries = countries;

        loadingCountriesAvailableForDelivery = false;
    }).catch(() => {
        loadingCountriesAvailableForDelivery = false;
    });
}

/**
 * List all pick up locations
 */
function listPickupLocations() {

    loadingPickupLocations = true;

    getPickupLocations().then(response => {

        businessLocations = response;

        unfilteredBusinessLocations = businessLocations;

        loadingPickupLocations = false;
    }).catch(() => {
        loadingPickupLocations = false;
    });
}

/**
 * Display search results based on user input
 */
function searchFilter() {

    loadingCountriesAvailableForDelivery = true;

    const clonedCountries = JSON.parse(JSON.stringify(unfilteredCountries));

    countries = clonedCountries.filter((country: { country_name: string; country_name_ar: string; }) => {
        countryExists = false;

        if (country.country_name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1 || country.country_name_ar.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1) {
            countryExists = true;
            return true;
        }

        loadingCountriesAvailableForDelivery = false;

        return countryExists;
    });
}

/**
* Display search results based on user input
*/
function searchBusinessLocations() {

    loadingPickupLocations = true;

    const clonedBusinessLocations = JSON.parse(JSON.stringify(unfilteredBusinessLocations));

    businessLocations = clonedBusinessLocations.filter((businessLocation: { business_location_name: string; business_location_name_ar: string; }) => {
        businessLocationyExists = false;

        if (businessLocation.business_location_name.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1 || businessLocation.business_location_name_ar.toLowerCase().indexOf(searchTerm.value.toLowerCase()) > -1) {
            businessLocationyExists = true;
            return true;
        }

        loadingPickupLocations = false;

        return businessLocationyExists;
    });
}

/**
 * on state selected, list cities or areas based on country
 */
function onStateSelected(s) {

    //todo: check if delivering to ( whole state or whole country) and no delivery areas 
 
    state = s;

    state_id = state.state_id;

    if (state.areaDeliveryZone) {

        const params = Object.assign({
            country: country,
            state: state
        }, state.areaDeliveryZone);

        if (selected_shipping_method == 'delivery')
            params['order_mode'] = 1;
        else
            params['order_mode'] = 2;

        store.commit('setShippingMethod', params);

        dismiss();
    }
    else {
        loadStoreCities(state_id);
    }
}

async function onCitySelected(city: any) {

    const areaDeliveryZone = city.areaDeliveryZone ? city.areaDeliveryZone : state.areaDeliveryZone;

    if (!areaDeliveryZone) {

        const alert = await alertController.create({
            header: t("Sorry!"),
            message: t("This store currently doesn't deliver to this location"),
            buttons: [t("Okay")],
        });
        await alert.present();

        return false;
    }

    const params = {
        ...areaDeliveryZone,
        city: city,
        country: country,
        state: state
    };

    if (selected_shipping_method == 'delivery')
        params['order_mode'] = 1;
    else
        params['order_mode'] = 2;

    store.commit('setShippingMethod', params);
 
    dismiss();
}

function onAreaSelect(areaDeliveryZone) {

    const params = {
        ...areaDeliveryZone,
        country: country,
        order_mode: 1
    };

    store.commit('setShippingMethod', params);
  
    dismiss();
}

/**
 * goToShippingToPageModule
 */
function goToShippingMethodPage(selectedCountry) {

    country = selectedCountry;

    country_id = selectedCountry['country_id'];

    //deliveryZone
    if (country['areas'] == 0 || (country.deliveryZone && country.deliveryZone.deliver_whole_country)) {

        const params = {
            ...country.deliveryZone,
            country: country,
            order_mode: 1
        };

        store.commit('setShippingMethod', params);
  
        dismiss(); 
    }
    else if (country.iso == "KW") {
        loadStoreDeliveryAreas(selectedCountry['country_id']);
    } else {
        loadStoreStates(selectedCountry['country_id']);
    }
}

function dismiss() {
    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss();
        } else if(window.history.length > 0) {
            router.back();
        } else {
            router.push('/');
        }
    });
}

/**
 * Update selected method value
 */
function changeShippingMethod(ev: any) {
    selected_shipping_method = ev.detail.value;
}


/**
 * Display search results based on user input
 */
function searchArea() {

    loadingAreasData = true;

    //Search through restaurant delivery areas
    const clonedCities = JSON.parse(JSON.stringify(unfilteredCities));

    cities = clonedCities.filter((city: { areas: any[]; city_name: string; city_name_ar: string; }) => {
        areaExists = false;

        city.areas = city.areas.filter((areaDeliveryZone: { area: { area_name: string; area_name_ar: string; }; }) => {

            if (
                areaDeliveryZone.area.area_name.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1 || areaDeliveryZone.area.area_name_ar.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1
                ||
                city.city_name.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1 || city.city_name_ar.toLowerCase().indexOf(searchText.value.toLowerCase()) > -1
            ) {
                areaExists = true;

                return true;
            }
        });

        loadingAreasData = false;

        return areaExists;
    });
}

/**
 * select shipping method
 * @param selected_area 
 */
function selectShippingMethod(selectedShippingMethod: any) {

    if (selected_shipping_method == 'delivery')
        selectedShippingMethod['order_mode'] = 1;
    else
        selectedShippingMethod['order_mode'] = 2;

    store.commit('setShippingMethod', selectedShippingMethod);
  
    dismiss(); 
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