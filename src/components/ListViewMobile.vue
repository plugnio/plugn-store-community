<template>
    <!-- v-if="store.state.store.noOfItems > 200" -->
    <div class="category-wrapper">
      <template v-for="(category, index) of store.state.store.categories" :key="index">
          <button @click="onCategorySelect(category, index)" :class="index == categoryIndex ? 'active' : ''">
              {{ langContent(category.title, category.title_ar)  }}
          </button>
      </template>
      <div class="clearfix"></div>
    </div>

    <div :id="'category_' + index" v-for="(category, index) of store.state.store.categories" :key="index">

        <div class="category-title" v-if="store.state.store.noOfItems < 201 && category.items?.length > 0">
            <h5> {{ langContent(category.title, category.title_ar)  }}
                <button @click="toggleCategoryView(category)">
                    <img v-if="!category.collapse" src="../assets/icons/chevron-up.svg" />
                    <img v-if="category.collapse" src="../assets/icons/chevron-down.svg" />
                </button>
            </h5>
        </div>

        <!-- if more than 200 show all category items else just selected -->

        <template
            v-if="!category.collapse && category.items && (store.state.store.noOfItems < 201 || index == categoryIndex)">
            
            <StoreItem layout="list" :item="item" v-for="(item, itemIndex) of category.items" :key="itemIndex">
            </StoreItem>
                
            <template v-if="loadingItems">
              <StoreItem layout="list"></StoreItem>
              <StoreItem layout="list"></StoreItem>
              <StoreItem layout="list"></StoreItem>
            </template>
            
        </template>

        <div class="clearfix"></div>
    </div>

    <ion-infinite-scroll @ionInfinite="doInfiniteItems" v-if="store.state.store.noOfItems > 200">
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
</template>
<script setup lang="ts">
import StoreItem from '@/components/StoreItem.vue';
import store from '@/store';
import { getItems, getCategoryItems } from '@/services/StoreService';
 
import { onMounted, ref } from 'vue';
import { IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { langContent } from '@/services/TranslateService';
 
const content = ref();
 
const loadingItems = ref(false);
const categoryIndex = ref(0);

function toggleCategoryView(category) {
  category.collapse = !category.collapse;
}

function onCategorySelect(category, index) {
  categoryIndex.value = index;

  if(store.state.store.noOfItems > 200) 
    loadCategoryData(category);

  const element = document.getElementById("category_" + index);

  if(element) {
    const headerOffset = 0; 
    const offsetPosition = element.offsetTop - headerOffset;
    
    content.value.$el.scrollToPoint(0, offsetPosition);
  }
}

/**
 * load category data
 */
function loadCategoryData(category, event = null, totalLoaded = 0) {
 
  loadingItems.value = true;

  getItems(1, category.category_id).then((response: any) => {

    category.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    category.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
    //totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

    totalLoaded += parseInt(response.headers.get('X-Pagination-Total-Count'));

    category.items = response.data;

    store.commit('updateCategory', {
      categoryIndex: categoryIndex,
      category: category
    });

    if (event) {
      event.target.complete();
    }

    loadingItems.value = false;

    /**
     * problems
     * -----------------------------
     * 1) what if user scrolled to bottom with all items  
     * 2) what if caurent cat having less item and ion-infinite will not trigger   
     */

    //scrolltobottom < 200 

    //category.totalPages < 2

    /*if (totalLoaded < 20 && store.state.store.categories.length > categories.length) {
      const nextCat = store.state.store.categories[categories.length];

      loadCategoryData(nextCat, null, totalLoaded);
    }*/

    if(category.items.length == 0) {
      categoryIndex.value++;
      const nextCat = store.state.store.categories[categoryIndex.value];
      loadCategoryData(nextCat);
    }
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

  //avoid blocking scroll events 

  /*if(event) {
   setTimeout(() => {
    event.target.complete();
   }, 200) 
  }*/

  const currentCat = store.state.store.categories[categoryIndex.value];

  if (!currentCat || !currentCat.currentPage) {
    if (event)
      event.target.complete();

    return true;
  }

  //const currentCat = categories[categories.length - 1];

  //if no more items load next cat if not all cat loaded 

  if (currentCat.currentPage >= currentCat.totalPages) {

    /*
    if (store.state.store.categories.length > categories.length) {
      return loadCategoryData(store.state.store.categories[categories.length], event);
    }*/

    //all items with cat loaded 

    if (event)
      event.target.complete();
      
    loadingItems.value = false;

    return null;
  }

  loadingItems.value = true;

  currentCat.currentPage++;

  getItems(currentCat.currentPage, currentCat.category_id).then((response: any) => {

    currentCat.currentPage = parseInt(response.headers.get('X-Pagination-Current-Page'));
    currentCat.totalPages = parseInt(response.headers.get('X-Pagination-Page-Count'));
    //totalCount = parseInt(response.headers.get('X-Pagination-Total-Count'));

    if (!currentCat.items) {
      currentCat.items = [];
    }

    /**
     * if first item or not duplicate 
     */
    if (
      currentCat.items.length == 0 ||
      (
        response.data.length > 0 &&
        currentCat.items[currentCat.items.length - 1].item_uuid != response.data[response.data.length - 1].item_uuid
      )
    ) {
      currentCat.items = currentCat.items.concat(response.data);
    }

    store.commit('updateCategory', {
      categoryIndex: categoryIndex,
      category: currentCat
    });

    if (event)
      event.target.complete();

    //if scrolled to bottom load again   

    loadingItems.value = false;
    
  }, err => {
    loadingItems.value = false;
  });
}

/**
 * load catalog
 */
function loadData() {

  loadingItems.value = true;

  getCategoryItems().then((response: any) => {
    store.commit('updateCategories', response);
    loadingItems.value = false;
  }).catch(() => {
    loadingItems.value = false;
  });
}

onMounted(() => {

  if (store.state.store.noOfItems < 201) 
  {
    loadData();
  }
  else  //load first category data 
  {
    loadCategoryData(store.state.store.categories[categoryIndex.value]);
  }
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
