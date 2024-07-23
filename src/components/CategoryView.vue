<template>

    <h5>{{ $t('Categories') }}</h5>

    <StoreCategory :category="category" v-for="(category, index) of store.state.store.categories" :key="index">
    </StoreCategory>
    
    <div class="category-skeleton-wrapper" v-if="!store.state.store.categories">
        <div class="category-skeleton store-category">
            <div class="img-wrapper">
                <ion-skeleton-text :animated="true"></ion-skeleton-text> 
            </div>
            <ion-skeleton-text class="title" :animated="true"></ion-skeleton-text>
            <ion-skeleton-text class="subtitle" :animated="true"></ion-skeleton-text>
        </div>
        <div class="category-skeleton store-category">
            <div class="img-wrapper">
                <ion-skeleton-text :animated="true"></ion-skeleton-text> 
            </div>
            <ion-skeleton-text class="title" :animated="true"></ion-skeleton-text>
            <ion-skeleton-text class="subtitle" :animated="true"></ion-skeleton-text>
        </div>
        <div class="category-skeleton store-category">
            <div class="img-wrapper">
                <ion-skeleton-text :animated="true"></ion-skeleton-text> 
            </div>
            <ion-skeleton-text class="title" :animated="true"></ion-skeleton-text>
            <ion-skeleton-text class="subtitle" :animated="true"></ion-skeleton-text>
        </div>
        <div class="category-skeleton store-category">
            <div class="img-wrapper">
                <ion-skeleton-text :animated="true"></ion-skeleton-text> 
            </div>
            <ion-skeleton-text class="title" :animated="true"></ion-skeleton-text>
            <ion-skeleton-text class="subtitle" :animated="true"></ion-skeleton-text>
        </div>
    </div>
    
    <div class="clearfix"></div>

</template>
<script setup lang="ts">
import store from '@/store';
import StoreCategory from './StoreCategory.vue';
import { IonSkeletonText } from '@ionic/vue';

</script>
<style scoped lang="scss">

.category-skeleton-wrapper {
    clear: both;
    display: block;

    .category-skeleton {
        display: block;
        float: var(--start);
        margin: 12px;
        text-align: center; 

        .img-wrapper {
            display: flex;
            justify-content: center;
            align-items: center;
            align-self: stretch;
            border-radius: 20px;
            background: #EDEDED;
            overflow: hidden;

            ion-skeleton-text {
                margin: 0;
                aspect-ratio : 1 / 1;
                width: 100%;
            }
        }

        .title {
            color: var(--ion-color-medium-shade, #202020);
            text-align: center;
            height: 16px;
            line-height: 22.4px; /* 140% */
            margin-bottom: 7px;
            margin-top: 12px;
            width: 50%;
            margin-left: auto;
            margin-right: auto;
        }

        .subtitle {
            height: 12px;
            margin-top: 0;
            margin-bottom: 0;
            width: 70%;
            margin-left: auto;
            margin-right: auto;
        }
    }
}
h5 {
    margin: 12px;
    color: var(--ion-color-dark-shade, #1A1A1A);
    font-size: 18px;
    font-style: normal;
    font-weight: 600;
    line-height: 24.8px; /* 137.778% */
}

</style>