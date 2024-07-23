<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="back()">
                        <img src="../../../assets/icons/chevron-left.svg" />
                        <!--
                        <img src="../../../assets/icons/close.svg" />-->
                    </button>
                    <!--
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../../assets/icons/chevron-left.svg" />
                    </ion-back-button>-->
                </ion-buttons>
                <ion-title>
                    <span v-if="!country">{{ $t('Select country') }}</span>
                    <span v-if="country && country.iso != 'KW' && !state">{{ $t('Select state') }}</span>
                    <span v-if="country && (state || country.iso == 'KW') && !city">
                        {{ $t('Select city') }}
                    </span>
                    <span v-if="city && !area">{{ $t('Select area') }}</span>
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content>
           
            <ul class="breadcrumb" v-if="country">
                <li>
                    {{ langContent(country.country_name, country.country_name_ar) }} 
                    <ion-icon v-if="state || city" :icon="chevronForwardOutline"></ion-icon>
                </li>
                <li v-if="state">
                    {{ langContent(state.name, state.name_ar) }}
                    <ion-icon v-if="city" :icon="chevronForwardOutline"></ion-icon>
                </li>
                <li v-if="city">
                    {{ langContent(city.city_name, city.city_name_ar) }}
                </li>
            </ul>
             
            <ion-searchbar v-model="query"
                mode="ios" @ionInput="onSearch()" :moda="'ios'" :debounce="350"
                :placeholder="$t('Search here')">
            </ion-searchbar>

            <ion-list v-if="!country">
                <ion-item v-for="(row, index) in countries" :key="index" @click="onCountrySelected(row)"
                    tappable>
                    <ion-label>
                        {{ langContent(row.country_name, row.country_name_ar) }}
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-list v-if="country && country.iso != 'KW' && !state">
                
                <ion-item v-for="(st, index) in states" :key="index" tappable @click="onStateSelected(st)">
                    <ion-label>
                        {{ langContent(st.name, st.name_ar) }}
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-list v-if="country && (country.iso == 'KW' || state) && !city">

                <ion-item v-for="(city, index) in cities" :key="index" tappable @click="onCitySelected(city)">
                    <ion-label>
                        {{ langContent(city.city_name, city.city_name_ar) }}
                    </ion-label>
                </ion-item>
            </ion-list>

            <!-- Delivery areas-->

            <ion-list v-if="city">
                
                <ion-item v-for="(area, index) in areas" :key="index" tappable @click="onAreaSelected(area)">
                    <ion-label>
                        {{ langContent(area.area_name, area.area_name_ar) }}
                    </ion-label>
                </ion-item>

            </ion-list>

            <ion-list v-if="loading">
                <ion-item>
                    <ion-label>
                        <IonSkeletonText :animated="true" style="width: 80%;"></IonSkeletonText>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <IonSkeletonText :animated="true" style="width: 60%;"></IonSkeletonText>
                    </ion-label>
                </ion-item>
                <ion-item>
                    <ion-label>
                        <IonSkeletonText :animated="true" style="width: 40%;"></IonSkeletonText>
                    </ion-label>
                </ion-item>
            </ion-list>

            <ion-infinite-scroll threshold="100px" v-if="city && currentPage < totalPages" @ionInfinite="ionInfiniteArea">
                <ion-infinite-scroll-content loadingSpinner="bubbles">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>

            <ion-infinite-scroll threshold="100px" v-if="!city && country && (country.iso == 'KW' || state) && currentPage < totalPages" @ionInfinite="ionInfiniteCity">
                <ion-infinite-scroll-content loadingSpinner="bubbles">
                </ion-infinite-scroll-content>
            </ion-infinite-scroll>

        </ion-content>

        <ion-footer v-if="country && country.iso != 'KW'">
            <ion-toolbar>
                <ion-item tappable @click="detectLocation()" lines="none">
                    <!-- v-if="!detectingLocation" -->
                    <ion-icon :icon="locateOutline" slot="start"></ion-icon>
                    <ion-label>{{ $t("Detect my location") }}</ion-label>
                    <ion-spinner v-if="detectingLocation"></ion-spinner>
                </ion-item>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { Geolocation } from '@capacitor/geolocation';
import { trackView } from '@/services/AnalyticsService';
//getCountries, 
import { getCountryStates, getStateCities, getAreas, getCountryCities, getCountriesAvailableForDelivery, getCityByLocation } from '@/services/DeliveryZoneService';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import { IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, IonIcon, IonLabel, InfiniteScrollCustomEvent, modalController, IonHeader, IonToolbar, IonContent, IonPage, IonTitle, IonButtons, IonSkeletonText, alertController, IonSpinner, IonFooter } from '@ionic/vue';
import { chevronForwardOutline, locateOutline } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';


const query = ref('');
const loading = ref(false);
const detectingLocation= ref(false);

//const city.value = ref('');
//const area.value = ref('');

const countries = ref([]);
const states = ref([]);
const cities = ref([]);
const areas = ref([]);
 
const country = ref(null);
const state = ref(null);
const city = ref(null);
const area = ref(null);
const currentPage = ref(null);
const totalPages = ref(null);
  
const { t } = useI18n({ useScope: "global" });

function onSearch() {
    
    if (!country.value) {
        loadCountries();
    } else if (country.value && country.value.iso != 'KW' && !state.value) {
        loadStates(country.value.country_id);
    } else if ((state.value || country.value.iso == 'KW') && !city.value) {
        loadKuwaitCities();
    } else if(city.value && !area.value) {
        loadAreas(city.value.city_id);
    }
}

/**
 * goToShippingToPageModule
 */
function onCountrySelected(selectedCountry) {

    query.value = '';

    currentPage.value = 1;
    totalPages.value = null;

    country.value = selectedCountry;

    if (country.value.iso == "KW") {
        loadKuwaitCities();
    } else {
        loadStates(selectedCountry['country_id']);
    }
}

function onStateSelected(selectedState) {
 
    query.value = '';

    currentPage.value = 1;
    totalPages.value = null;

    state.value = selectedState;

    loadStateCities(selectedState.state_id);
}

function onCitySelected(selectedCity) {

    query.value = '';

    currentPage.value = 1;
    totalPages.value = null;

    city.value = selectedCity;

    if (country.value.iso == 'KW') {
        loadAreas(selectedCity.city_id);
    }
    else {
        dismiss({
            city: selectedCity,
            state: state.value,
            country: country.value
        });
    }
}

//only for kuwait 
function onAreaSelected(selectedArea) {
    
    query.value = '';

    if(country.value.iso == "KW") {
        city.value = null;
    }

    dismiss({
        area: selectedArea,
        country: country.value,
        city: city.value
    });
}

function back() {
     
    if(city.value) {
        city.value = null;
        area.value = null;
    } else if (state.value) {
        state.value = null;
        city.value = null; 
        area.value = null;
    } else if(country.value) {
        country.value = null;
    } else {
        dismiss();
    }
}

function dismiss(data = {}) {
    modalController.dismiss(data);
}

function detectLocation() {
    
    const locationOptions = { enableHighAccuracy: false, maximumAge: Infinity, timeout: 60000 };

    detectingLocation.value = true; 

    Geolocation.getCurrentPosition(locationOptions).then(async (resp) => {
  
      if (resp && resp.coords) {
        store.commit('setLocationPermission', true)
        
        // we have permission
        
        getCityByLocation(resp.coords.latitude, resp.coords.longitude).then(res => {
             
            detectingLocation.value = false; 
    
            //set location and dismiss 

            if(res.operation == "success") {
                dismiss({
                    area: res.area,
                    city: res.city,
                    state: res.state,
                    country: res.country
                });
            }

        });
    
      } else {
        //getLocationByIp();
         
        const alert = await alertController.create({
            header: t('Error1'),
            message: t('We could not get your location'),
            buttons: [t('Okay')]
        });

        await alert.present();

        detectingLocation.value = false; 
      }
    }).catch(async (error) => {
    
        //console.error(error);

        const alert = await alertController.create({
            header: t('Error2'),
            message: t('Please provide location permission in your browser'),
            buttons: [t('Okay')]
        });

        await alert.present();

        store.commit('setLocationPermission', false);

        detectingLocation.value = false; 
    });
}

function loadAreas(city_id, ev = null) {

    loading.value = true;

    getAreas(city_id, query.value, currentPage.value).then(res => {

        if(currentPage.value == 1) {
            areas.value = res.data;
        } else {
            areas.value = areas.value.concat(res.data);
        }
        
        totalPages.value = parseInt(res.headers.get('X-Pagination-Page-Count'));
         
        loading.value = false;

        if (ev) {
            ev.target.complete();
        }
    }).catch(() => {

        if (ev) {
            ev.target.complete();
        }

        loading.value = false;
    });
}

function loadKuwaitCities(ev = null) {

    loading.value = true;

    getCountryCities(country.value.country_id, query.value, currentPage.value).then(res => {

        if(currentPage.value == 1) {
            cities.value = res.data;
        } else {
            cities.value = cities.value.concat(res.data);
        }
        
        totalPages.value = parseInt(res.headers.get('X-Pagination-Page-Count'));
  
        loading.value = false;

        if (ev) { 
            ev.target.complete();
        }
    }).catch(() => {

        if (ev) {
            ev.target.complete();
        }

        loading.value = false;
    });
}

function loadStateCities(state_id, ev = null) {

    loading.value = true;

    getStateCities(state_id, query.value, currentPage.value).then(res => {

        if(currentPage.value == 1) {
            cities.value = res.data;
        } else {
            cities.value = cities.value.concat(res.data);
        }
        
        totalPages.value = parseInt(res.headers.get('X-Pagination-Page-Count'));
  
        loading.value = false;

        if (ev) {
            ev.target.complete();
        }

        //todo: if no city in state in db 

        if(cities.value.length == 0) {
           
            dismiss({
                state: state.value,
                country: country.value
            });
        }
 
    }).catch(() => {

        if (ev) {
            ev.target.complete();
        }

        loading.value = false;
    });
}

function loadStates(country_id, ev = null) {
    loading.value = true;

    getCountryStates(country_id, query.value).then(res => {

        loading.value = false;

        if (ev) {
            ev.target.complete();
        }

        states.value = res;
    }).catch(() => {

        loading.value = false;

        if (ev) {
            ev.target.complete();
        }
    });
}

function loadCountries() {
    loading.value = true;

    getCountriesAvailableForDelivery(query.value, true).then(res => {
    //getCountries(query.value).then(res => {
 
        countries.value = res; 

        loading.value = false;

        if(countries.value.length == 1) {
            onCountrySelected(countries.value[0])
        }

    }).catch(() => {
        loading.value = false;
    });
}

const ionInfiniteArea = (ev: InfiniteScrollCustomEvent) => {

    if (currentPage.value == totalPages.value) {
        ev.target.complete();
        return false;
    }

    currentPage.value++;

    loadAreas(city.value.city_id, ev);
};

const ionInfiniteCity = (ev: InfiniteScrollCustomEvent) => {

    if (currentPage.value == totalPages.value) {
        ev.target.complete();
        return false;
    }

    currentPage.value++;

    if(country.value.iso == "KW") {
        loadKuwaitCities(ev);
    } else {
        loadStateCities(state.value.state_id, ev);
    }
};

//onIonViewDidEnter
onMounted(() => {
    
    trackView('area-page');

    loadCountries();
});

</script>

<style scoped type="scss">
ul {
    list-style: none;
    padding: 0;
    margin: 15px;

    li {
        display: inline-block;

        ion-icon {
            top: 2px;
            position: relative;
            margin-inline-end: 5px;
        }
    }
}

</style>