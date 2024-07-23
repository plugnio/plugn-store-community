<template>
<div class="store-category" tappable @click="onCategorySelect(category)">
    <div class="img-wrapper">

        <ion-img v-if="category.category_image" :alt="category.title" @ionError="onImageError(category)"
            :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_500/restaurants/'+ store.state.store.restaurant_uuid + '/category/' + category.category_image"></ion-img>

        <ion-img v-if="!category.category_image && store.state.store.logo" :alt="category.title"
            :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_100,w_128/restaurants/' 
                    + store.state.store.restaurant_uuid + '/logo/' + store.state.store.logo"></ion-img>

        <ion-img v-if="!category.category_image && !store.state.store.logo" class="store-logo" 
                    src="@/assets/icons/store.svg"></ion-img>

        <!--
        <ion-img v-if="!category.category_image" class="placeholder"
            :src="'https://placehold.co/500x500?text=' + category.title">
        </ion-img> -->

    </div>

    <h5>{{ langContent(category.title, category.title_ar) }}</h5>
 
    <p>{{ $t('{count} products', { count: category.noOfItems }) }} </p> 

</div>
</template>
<script setup lang="ts">
import router from '@/router';
import { langContent } from '@/services/TranslateService';
import store from '@/store';
import { IonImg } from '@ionic/vue';

defineProps(['category']);
 
function onImageError(item) {
  item.category_image = null;
}

//todo: add category page 
function onCategorySelect(category) {
    router.push('/category/' + category['slug']);
}

</script>
<style scoped lang="scss">

.store-category {
    display: block;
    float: var(--start);
    margin: 12px;
    text-align: center;
}

.img-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    align-self: stretch;
    border-radius: 20px;
    background: #EDEDED;
    overflow: hidden;
    border-radius: 20px;
}

h5 {
    color: var(--ion-color-medium-shade, #202020);
    text-align: center;
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: 22.4px; /* 140% */
    margin-bottom: 2px;
    margin-top: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
}

p {
    color: var(--ion-color-medium-shade, #707070);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: normal;
    margin-top: 0;
    margin-bottom: 0;
}

.img-wrapper,
ion-img {
  overflow: hidden;
  height: 100%;
  aspect-ratio: 1 /1;
  display: block;
  //min-height: 100px;
}
</style>