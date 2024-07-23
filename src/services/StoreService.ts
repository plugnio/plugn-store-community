
import axios from "@/services/AxiosService";
import store from "@/store";
import { getDomain } from "./HTMLService";

/**
 * return promise for store detail
 * @returns Promise
 */
export async function getStoreDetail() {

  let url = store.state.restaurant_uuid && store.state.restaurant_uuid.length > 0 ? 
    '/store/' + store.state.restaurant_uuid :'/store/by-domain/' + getDomain();
  
  url += '?expand=noOfItems,categories,categories.noOfItems,isOpen,reopeningAt,webLinks,country,currency,currencies,' 
    + 'supportPickup,supportDelivery,storeTheme,openingHours';

  const response = await axios.get(url);
  return response.data;
}

/**
 * Get restaurant's branches
 */
export async function getBusinessLocaiton(): Promise<any> {
  const response = await axios.get('/store/locations/' + store.state.store.restaurant_uuid + '?expand=country');
  return response.data;
}

/**
 * Get all category's products
 */
export async function getCategoryProductsBySlug(category_slug: string) {
  const response = await axios.get('/item/category/' + category_slug + '?restaurant_uuid=' + store.state.store.restaurant_uuid);
  return response.data;
}

/**
 * Get all category's products
 */
export async function getCategoryProducts(category_id: number) {
  const response = await axios.get('/item/' + category_id + '?restaurant_uuid=' + store.state.store.restaurant_uuid);
  return response.data;
}

/**
 * return store items
 * @returns 
 */
export async function getItems(page: number, category_id = null, keyword = null, category_slug = null) {
  let url = '/item/items?restaurant_uuid=' + store.state.store.restaurant_uuid +
    '&expand=options,itemImage&page=' + page;//options.extraOptions,

  //per-page=4&

  if (keyword) {
    url += '&keyword=' + keyword;
  }

  if (category_id) {
    url += '&category_id=' + category_id;
  }

  if (category_slug) {
    url += '&category_slug=' + category_slug;
  }

  return await axios.get(url);
}

/**
 * return store items group by category
 * @returns 
 */
export async function getCategoryItems(category_id = null, keyword = null, category_slug = null) {
  let url = '/item/category-items?restaurant_uuid=' + store.state.store.restaurant_uuid +
    '&expand=items,items.options,items.itemImage';//options.extraOptions,

  if (keyword) {
    url += '&keyword=' + keyword;
  }

  if (category_id) {
    url += '&category_id=' + category_id;
  }

  if (category_slug) {
    url += '&category_slug=' + category_slug;
  }

  return (await axios.get(url)).data;
}

/**
 * Load Restaurant's menu
 */
export async function loadRestaurantMenu(withoutItems = true) {
  let url = '/item?restaurant_uuid=' + store.state.store.restaurant_uuid +
    '&expand=';

  if (withoutItems) {
    url += '&wihoutItems=1';
  }
  return (await axios.get(url)).data;
}

/**
 * Get menu data by restaurant ID
 *
export async function getStoreMenu(): Promise<any> {

  return new Promise((resolve, reject) => {
    
    if (!authService.store || !categories || !items) {

      loading = true; 

      loadRestaurantMenu(true).then((response: any) => {

        //todo: move to listing with infinite scrolling 

        categories = [];

        items = [];

        response.restaurantMenu.forEach(category => {
          if (category.items.length > 0){
            categories.push(category);

            category.items.forEach(item => {
              items.push(item);
            });
          }
        });

        loading = false; 

        resolve(true);
      });

    } else {
      
      loading = false;

      resolve(true);
    }
  });

}*/

/**
 * load item data from db
 */
export async function loadItemBySlug(slug: string) {
  const url = '/item/view/' + slug + '?expand=itemVariants,itemVariants.itemVariantImages,itemVariants.itemVariantOptions,itemVariants.itemVariantOptions.option,itemVariants.itemVariantOptions.extraOption,options,options.extraOptions,itemImages,itemVideos,itemSchema&restaurant_uuid=' + store.state.store.restaurant_uuid;
  const response = await axios.get(url);
  return response.data;
}

/**
 * load item data from db
 */
export async function loadItemData(item_uuid: string) {
  const url = '/item/detail?expand=itemVariants,itemVariants.itemVariantImages,itemVariants.itemVariantOptions,itemVariants.itemVariantOptions.option,itemVariants.itemVariantOptions.extraOption,options,options.extraOptions,itemImages,itemVideos,itemSchema&item_uuid=' + item_uuid + '&restaurant_uuid=' + store.state.store.restaurant_uuid;
  const response = await axios.get(url);
  return response.data;
} 