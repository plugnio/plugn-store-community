<template> 
    <ion-item tappable @click="setLanguage('en')">
        <ion-label>
            <h5>English</h5>
        </ion-label>
        <ion-icon v-if="store.state.language && store.state.language.code == 'en'" :icon="checkmark"></ion-icon>
    </ion-item>
    <ion-item tappable @click="setLanguage('ar')">
        <ion-label>
            <h5>عربى</h5>
        </ion-label>
        <ion-icon v-if="store.state.language && store.state.language.code == 'ar'" :icon="checkmark"></ion-icon>
    </ion-item> 
</template>
<script setup lang="ts">
import store from '@/store';
import { IonIcon, IonItem, IonLabel, popoverController } from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import { inject } from 'vue';

const i18n: any = inject('i18n');
    
function setLanguage(code) {
  
  const lang = code == 'en'? {
    code: 'en',
    name: 'English'
  }: {
    name: 'عربى',
    code: 'ar'
  }; 

    i18n.global.locale.value = code;

    if(code == "ar") {
        document.querySelector('html').setAttribute("dir", 'rtl');
    } else {
        document.querySelector('html').setAttribute("dir", 'ltr');
    }
    
  store.commit('setLanguagePref', lang);

  popoverController.dismiss();
}
</script>