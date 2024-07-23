import { modalController } from "@ionic/vue";
import NotificationToast from '../components/NotificationToast.vue';
import { startFbPixilWithId, startGoogleAnalytics, startGoogleTagManagerWithId, startGoogleTagWithId, startSnapchatPixilWithId, startTiktokPixelWithId } from "@/services/AnalyticsService";
import { setTheme } from './ThemeService';
import store from "@/store";


declare let window;
 
export function setTitle(title: string) {
    const head = document.getElementsByTagName('title')[0];
    head.innerHTML = title;
}

/**
 * add meta tags for SEO in header
 * @param name 
 * @param value 
 */
export function addMeta(name: string, value: string) {

    const head = document.getElementsByTagName('head')[0];
    
    let tag = document.querySelector('meta[name="' + name + '"]') as HTMLMetaElement;

    if(!tag)
        tag = document.querySelector('meta[property="' + name + '"]') as HTMLMetaElement;

    if(!tag)
        tag = document.createElement('meta');

    tag.name = name;
    tag.content = value;

    head.appendChild(tag);
}

/**
 * method is used to add json-ld script in page head
 * @param json
 */
export function addStructuredData(json: JSON) {
    const script = document.createElement('script');
    script.type = "application/ld+json";
    script.innerText = JSON.stringify(json);
    document.getElementsByTagName('head')[0].appendChild(script);
}

export function appendHTML(html: string) { 
    //setTimeout(() => {
        document.getElementById('extra-scripts').append(html);
    //}, 1500);
}

export function setStoreIcons(restaurant_uuid, logo) {
 
    const icon1 = document.querySelector('link[rel="icon"][sizes="32x32"') as HTMLLinkElement;
    icon1.href = 'https://res.cloudinary.com/plugn/image/upload/w_32,h_32/restaurants/' + restaurant_uuid + '/logo/' + logo;
    //document.head.removeChild(icon1)

    const icon2 = document.querySelector('link[rel="icon"][sizes="16x16"') as HTMLLinkElement;
    icon2.href = 'https://res.cloudinary.com/plugn/image/upload/w_16,h_16/restaurants/' + restaurant_uuid + '/logo/' + logo;
    //document.head.removeChild(icon2)
    
    let icon3 = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement;
    if(!icon3) {
        icon3 = document.createElement('link');
        icon3.rel = 'apple-touch-icon';
    }
    icon3.href = 'https://res.cloudinary.com/plugn/image/upload/w_300,h_300,b_rgb:ffffff/restaurants/' + restaurant_uuid + '/logo/' + logo;
 
    let icon4 = document.querySelector('link[rel="apple-touch-startup-image"]') as HTMLLinkElement;
    if(!icon4) {
        icon4 = document.createElement('link');
        icon4.rel = 'apple-touch-startup-image';
    }
    icon4.href = 'https://res.cloudinary.com/plugn/image/upload/w_300,h_300,b_rgb:ffffff/restaurants/' + restaurant_uuid + '/logo/' + logo;
  
    document.querySelector('link[rel="mask-icon"]').remove();

    const icon5 = document.querySelector('link[rel="msapplication-TileImage"]') as HTMLLinkElement;
    if(icon5) {
        icon5.href = 'https://res.cloudinary.com/plugn/image/upload/w_300,h_300,b_rgb:ffffff/restaurants/' + restaurant_uuid + '/logo/' + logo;
    } 
    
    const headElement = document.head || document.getElementsByTagName('head')[0];
    
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = "<meta property='og:image' itemprop='image primaryImageOfPage' content='/assets/icon/icon.png' /> ";
     
    headElement.appendChild(tempContainer)
}

export function onImageError(object, attribute) {
    object[attribute] = null;
}

export function getDomain() {
    const domain = (new URL(window.location));
    return domain.hostname.replace('www.','');
}

export function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

/**
 * json to string error message 
 * @param message 
 */
export function errorMessage(message): string {

    if (isString(message)) {
        return message + '';
    }

    const a = [];

    for (const i in message) {

        if (!Array.isArray(message[i])) {
            a.push(message[i]);
            continue;
        }

        for (const j of message[i]) {
            a.push(j);
        }
    }

    return a.join(' ');
}

/**
 * Make date readable by Safari
 * @param date
 */
export function toDate(date) {
    if (date) {
        return new Date(date.replace(/-/g, '/'));
    }
}

declare let $i18n;

export async function showToast(message, params = {}, position = null) {
    window.history.pushState({
        navigationId: window.history.state.navigationId
      }, null, window.location.pathname);
    
    const popover = await modalController.create({
        component: NotificationToast,
        cssClass: "toast",
        showBackdrop: false,
        componentProps: {
            message: message,
            params: params, 
            position: position,
            type: position == "middle"? "warning": "success"
        }
    });
    popover.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
          window['history-back-from'] = 'onDidDismiss';
          window.history.back();
        }
    });
    await popover.present();

    /*store.commit("setToast", {
        message: message,
        params: params, 
        position: position,
        type: position == "middle"? "warning": "success"
    });*/

    //console.log($i18n)
    //.global.

    //const { t } = useI18n({ useScope: "global" })

    /*const toast = await toastController.create({
        message: message,
        duration: 1500,
        position: position,
    });
    toast.present();*/
}

export function updateHTML() {

    if (store.state.language.code == 'ar') {
        document.getElementsByTagName('html')[0].setAttribute('dir', 'rtl');
      } else {
          document.getElementsByTagName('html')[0].setAttribute('dir', 'ltr');
      }
  
      //todo translate.use(language.code);
  
      //i18n.locale.value = state.language.code;
  
      // set direction based on language
  
      /*if (state.language.code == 'ar') {
          // _platform.setDir('rtl', true);
          document.documentElement.dir = 'rtl';
      } else {
          // _platform.setDir('ltr', true);
          document.documentElement.dir = 'ltr';
      }*/
  
    setTheme(store.state.store.storeTheme);
  
    if (store.thumbnail_image)
        store.state.store.thumbnail_image_url = 'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg/restaurants/' + store.restaurant_uuid + '/thumbnail-image/' + store.thumbnail_image;
  
    if (store.state.language.code == 'en') {
        setTitle(store.state.store.name);
        addMeta("apple-mobile-web-app-title", store.state.store.name)
  
        if(store.state.store.meta_description)
          addMeta("meta_description", store.state.store.meta_description)
    } else {
        setTitle(store.state.store.name_ar);
        addMeta("apple-mobile-web-app-title", store.state.store.name_ar)
  
        if(store.state.store.meta_description_ar)
          addMeta("meta_description", store.state.store.meta_description_ar)
    } 
  
    if (store.state.store.google_analytics_id)
        startGoogleAnalytics(store.state.store.google_analytics_id);
  
    if (store.state.store.facebook_pixil_id)
        startFbPixilWithId(store.state.store.facebook_pixil_id);
  
    if(store.state.store.snapchat_pixil_id) 
        startSnapchatPixilWithId(store.state.store.snapchat_pixil_id);
  
    if(store.state.store.google_tag_manager_id) 
        startGoogleTagManagerWithId(store.state.store.google_tag_manager_id);
  
    if(store.state.store.google_tag_id) 
        startGoogleTagWithId(store.state.store.google_tag_id);
  
    if(store.state.store.tiktok_pixel_id) 
        startTiktokPixelWithId(store.state.store.tiktok_pixel_id);
  
    if(store.state.store.logo) {
        setStoreIcons(store.state.store.restaurant_uuid, store.state.store.logo);
    }
    
  }