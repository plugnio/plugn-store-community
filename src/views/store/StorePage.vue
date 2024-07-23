<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-back-button text="" :icon="chevronBack" defaultHref="/" color="primary">
                        <img src="../../assets/icons/chevron-left.svg" />
                    </ion-back-button>
                </ion-buttons>                    
                <ion-title>
                    {{ $t('Store Info') }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">

            <div class="store-info" v-if="store.state.store">
                         
                <img v-if="store.state.store.logo" class="store-logo" :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo" />

                <img v-if="!store.state.store.logo" class="store-logo" src="../../assets/icons/store.svg" />

                <h3>{{ langContent(store.state.store.name, store.state.store.name_ar) }}</h3>
                            
                <div class="store-timing" v-if="store.getters.isStoreOpen">
                    <span>{{ $t('Open now') }}</span>
                    <span class="sep">·</span>
                    <span> {{ store.getters.storeCloseAt }}</span>

                    <!-- todo: show opening hours 
                    <button v-if="!store.state.store.accept_order_247">
                        <img src="../../assets/icons/info.svg" />
                    </button> -->
                </div>

                <div class="store-timing" v-if="!store.getters.isStoreOpen">
                    <span>{{ $t('Close now') }}</span>
                    <template v-if="store.getters.storeReopenAt">
                        <span class="sep">·</span>
                        <span>{{ $t('Reopen at {time}', { time: store.getters.storeReopenAt }) }}</span>
                        <button>
                        <img src="../../assets/icons/info.svg" />
                        </button>
                    </template>
                </div>
         
                <div class="social-wrapper" v-if="store.state.store.webLinks">
 
                    <!-- @click="store.dispatch('goToExternalUrl', link)"-->
                    <a target="_blank" :href="store.getters.weblink(link)" v-for="(link, index) in store.state.store.webLinks"  :key="index">                                            
                        <ion-icon v-if="link.web_link_type == 1" slot="start" :icon="openOutline"></ion-icon>      
                        <ion-icon v-if="link.web_link_type == 5" slot="start" :icon="logoSnapchat"></ion-icon>
                        <ion-icon v-if="link.web_link_type == 6" slot="start" :icon="logoWhatsapp"></ion-icon>
                        <ion-icon v-if="link.web_link_type == 7" slot="start" :icon="mailOutline"></ion-icon>
                        <img v-if="link.web_link_type == 3" src="../../assets/icons/instagram.svg" />                    
                        <img v-if="link.web_link_type == 2" src="../..//assets/icons/facebook.png" />                     
                        <img v-if="link.web_link_type == 4" src="../..//assets/icons/twitter.png" />                     
                        <img v-if="link.web_link_type == 8" src="../..//assets/icons/youtube.svg" /> 
                    </a>
                </div>
            </div>

            <h5>{{ $t('Branches') }}</h5>

            <ion-list>
       
                <div v-for="(businessLocaiton, index) in store.state.businessLocations" :key="index">
                    <ion-item>
                        <ion-label>
                            <h5>{{ langContent(businessLocaiton['business_location_name'], businessLocaiton['business_location_name_ar']) }}</h5>
                            <p v-if="businessLocaiton['country']">
                                {{ langContent(businessLocaiton['country']['country_name'], businessLocaiton['country']['country_name_ar']) }}</p>
                        </ion-label> 
                        <!-- <img class="rotate-ar" slot="end" src="../../assets/icons/chevron-right.svg" />-->                        
                    </ion-item>

                    <div class="sep" ></div>
                </div>    
                
            </ion-list>

            <h5>{{ $t('Contact Details') }}</h5>
            
            <ion-list>
                <ion-item :href="'tel:+' + store.state.store.phone_number" v-if="store.state.store.phone_number">
                    <ion-label>
                        {{ store.state.store.phone_number }} 
                    </ion-label>
                </ion-item>
                <ion-item :href="'mailto:+' + store.state.store.restaurant_email" v-if="store.state.store.restaurant_email">
                    <ion-label>
                        {{ store.state.store.restaurant_email }} 
                    </ion-label>
                </ion-item>
            </ion-list>
        </ion-content>
    </ion-page>    
</template>    

<script setup  lang="ts">
import { IonBackButton, IonList, IonItem, IonLabel, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter, IonIcon } from '@ionic/vue';
import store from '@/store';
import { getBusinessLocaiton } from '@/services/StoreService';
import { chevronBack, logoSnapchat, logoWhatsapp, mailOutline, openOutline } from 'ionicons/icons';
import { trackView } from '@/services/AnalyticsService';
import { langContent } from '@/services/TranslateService';

onIonViewDidEnter(() => {

    trackView('store-info-page');

    if(store.state.businessLocations.length > 0) 
        return;

    getBusinessLocaiton().then(res => {
        store.commit('setBusinessLocation', res);
    }).catch((e) => {
        console.error(e);
    });
}); 

</script>
<style lang="scss" scoped>

.store-timing { 
  margin: 4px 16px 0 16px;
  color: var(--ion-color-success);
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 157.143% */
text-align: center; 
  .sep { 
    margin: 0 4px;
  }

  button {
    background: transparent;
    margin: 0 4px;
    top: 2px;
    position: relative;

    img {
      width: 100%;
      height: 100%;
    }
  }
}

.store-info {
    width: 100%;
    padding: 16px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 16px;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    margin: auto;
    display: block;

    .store-logo { 
        margin: auto;
        display: block;
        width: 64px;
        height: 64px;
        padding: 8px 8.5px 8px 7.5px;
        justify-content: center;
        align-items: center;
        border-radius: 32px;
        background: var(--ion-color-primary-contrast, #FFF);
        box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.12);
    }

    h3 {
        color: var(--ion-color-dark-shade, #1A1A1A);
        text-align: center;
        font-size: 24px;
        font-style: normal;
        font-weight: 600;
        line-height: normal;
        margin-bottom: 4px;
        margin-top: 16px;
    }

    .social-wrapper {
        width: 100%;
        position: relative;
        display: block;
        bottom: auto;
        text-align: center;
        margin-top: 8px;
        
        img {
            width: auto;
            height: 22px;
            flex-shrink: 0;
            margin-inline-end: 16px;
        }

        ion-icon {
            font-size: 22px;
            flex-shrink: 0;
            margin-inline-end: 16px;
        }

        .youtube img{
            height: 30px;
            position: relative;
            top: 5px;
        }
    }
}

ion-list {
    padding: 0;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 12px;
    border-radius: 16px;
    border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
    margin-bottom: 24px;

    .sep {
        width: calc(100% - 32px);
        height: 1px;
        background: #f0f0f0;
        margin: auto;
    }

    ion-item {
        --inner-border-width: 0;
 
        h5 {
            color: var(--ion-color-dark-shade, #1A1A1A);
            font-size: 14px;
            font-style: normal;
            font-weight: 500;
            line-height: 22px; /* 157.143% */
        }

        p {
            color: var(--ion-color-medium-shade, #707070);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px; /* 157.143% */
        }
 
    }
}


ion-list div:last-child .sep{
        display: none;
    }
</style>
