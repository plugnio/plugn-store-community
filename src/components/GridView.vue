<template> 
    <div class="category-wrapper">

      <button @click="onCategorySelect(null, -1)" :class="categoryIndex == -1 ? 'active' : ''"
          ><!-- v-if="category.noOfItems > 0"-->
          {{ $t('All') }}
      </button>

      <template v-for="(category, index) of store.state.store.categories" :key="index">
          <button @click="onCategorySelect(category, index)" :class="index == categoryIndex ? 'active' : ''"
              ><!-- v-if="category.noOfItems > 0"-->
              {{ langContent(category.title, category.title_ar) }}
          </button>
      </template>
      <div class="clearfix"></div>
    </div>
   
    <div class="grid-view">

      <template v-if="categoryIndex != -1 && store.state.store.categories[categoryIndex] && store.state.store.categories[categoryIndex].items">
        <StoreItem layout="grid" :item="item" v-for="(item, itemIndex) of store.state.store.categories[categoryIndex].items" 
            :key="itemIndex">
        </StoreItem>
      </template>

      <template v-if="categoryIndex == -1">
        <StoreItem layout="grid" :item="item" v-for="(item, itemIndex) of props.items" 
            :key="itemIndex">
        </StoreItem>
      </template>
    
      <template v-if="loadingItems">
        <StoreItem layout="grid"></StoreItem>
        <StoreItem layout="grid"></StoreItem>
        <StoreItem layout="grid"></StoreItem>
        <StoreItem layout="grid"></StoreItem>
      </template>

      <div class="no-data" v-if="props.noItems && !loadingItems">

          <img src="@/assets/icons/empty-box.svg" />

          <h5>{{ $t('No items added in selected category yet!') }}</h5>

      </div>
    </div>
 
    <div class="clearfix"></div>

    <ion-infinite-scroll @ionInfinite="doInfiniteItems">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
</template>
<script setup lang="ts">
import StoreItem from '@/components/StoreItem.vue';
import store from '@/store';
import { getItems } from '@/services/StoreService';
 
import { onMounted, reactive, ref } from 'vue';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { langContent } from '@/services/TranslateService';
  
const loadingItems = ref(false);
const categoryIndex = ref(-1);
  
const props = reactive({
  items: [],
  currentPage: 1, 
  totalPages: null, 
  noItems: false
});

function onCategorySelect(category, index) {

  categoryIndex.value = index;

  loadCategoryData(category);
}

/**
 * load category data
 */
function loadCategoryData(category = null, event = null) {
 
  loadingItems.value = true;

  getItems(1, category?.category_id).then((response: any) => {

    if(category) {

      category.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      category.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
       
      category.items = response.data;

      store.commit('updateCategory', {
        categoryIndex: categoryIndex,
        category: category
      });

    } else {

      props.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      props.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
       
      props.items = response.data;
    }

    if(response.data.length == 0) {
      props.noItems = true;
    } else {
      props.noItems = false;
    }

    if (event) {
      event.target.complete();
    }

    loadingItems.value = false;
  }).catch(() => {

    if (event) {
      event.target.complete();
    }
    
    loadingItems.value = false;
  });
}

/**
 * load more on scroll to bottom
 * @param event 
 */
function doInfiniteItems(event = null) {
 
  let action;
  let currentCat;

  if(categoryIndex.value > -1) {

    currentCat = store.state.store.categories[categoryIndex.value];

    if (!currentCat || !currentCat.currentPage) {

      if (event)
        event.target.complete();

      return true; 
    }

    //if no more items load next cat if not all cat loaded 

    if (currentCat.currentPage >= currentCat.totalPages) {

      //all items with cat loaded 

      if (event)
        event.target.complete();

      return null;
    }

    currentCat.currentPage++;

    action = getItems(currentCat.currentPage, currentCat.category_id);
  }
  else 
  {

    //if no more items load next cat if not all cat loaded 

    if (props.currentPage >= props.totalPages) {

      //all items with cat loaded 

      if (event)
        event.target.complete();

      return null;
    }

    props.currentPage++;

    action = getItems(props.currentPage)
  }
  
  loadingItems.value = true;
  
  action.then((response: any) => {

    if(currentCat) {

      currentCat.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      currentCat.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
      
      if (!currentCat.items) {
        currentCat.items = [];
      }

      currentCat.items = currentCat.items.concat(response.data);
      
      store.commit('updateCategory', {
        categoryIndex: categoryIndex,
        category: currentCat
      });

    } else {

      props.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
      props.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
 
      props.items = props.items.concat(response.data);
    }

    if (event)
      event.target.complete();

    //if scrolled to bottom load again   

    loadingItems.value = false;
    
  }, err => {
    loadingItems.value = false;
  });
}

onMounted(() => {
  loadCategoryData();
  //store.state.store.categories[categoryIndex.value]
});

</script>
<style lang="scss" scoped>
.category-wrapper,
.voucher-wrapper {
    width: 100%;
    display: flex;
    overflow-x: auto;
}

.category-wrapper {
    margin-top: 16px;
    padding: 8px 14px;

    button {
        display: flex;
        padding: 6px 8px;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 8px;
        flex-shrink: 0;
        border-radius: 24px;
        text-align: center;
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-inline-end: 8px;
        float: var(--start);
        color: var(--ion-color-medium-shade, #707070);
        border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
        background: var(--ion-color-primary-contrast, #f0f0f0);
    }

    .active {
        font-weight: 600;
        color: var(--ion-color-primary, #453E9A);
        border: 1px solid var(--ion-color-primary, #453E9A);
        background: var(--ion-color-primary-tint, #F6F5FF);
    }
}

.category-title {
    padding: 8px 16px;
    border-bottom: 1px solid var(--ion-color-primary-shade, #F0F0F0);
  
    h5 {
        color: var(--ion-color-dark);
        font-size: 18px;
        font-style: normal;
        font-weight: 600;
        line-height: 24.8px;
        /* 137.778% */
        margin: 0;
    }

    button {
        float: var(--end);
        background: transparent;
    }
}
</style>
