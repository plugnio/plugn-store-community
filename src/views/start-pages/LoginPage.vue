<template>
<ion-page>
    <ion-content :fullscreen="true">
    
      <button>
        <img src="../../assets/icons/chevron-left.svg" />
      </button>  

      <!-- todo if no over -->
      <div class="cover">
        <div class="store-logo">
          <img src="../../assets/images/store-logo.jpg" />
        </div>
      </div>

      <button>
        {{ $t("Continue with Google") }} 
      </button>

      <button>
        {{ $t("Continue with Apple") }}  
      </button>

      <button>
        {{ $t("Continue with BAWES") }} 
      </button>

      <div class="sep">
        <span>{{ $t("or") }}</span>
      </div>

      <button>
        {{ $t("Continue with Email") }} 
      </button>
    </ion-content>
</ion-page>
</template>

<script setup lang="ts"> 
import { trackView } from '@/services/AnalyticsService';
import { IonContent, IonPage, onIonViewDidEnter } from '@ionic/vue';

onIonViewDidEnter(() => {
  trackView('login-page');
})

</script>

<style lang="scss" scoped>

.store-logo { 
    left: calc(100% - 40px);
    width: 80px;
    height: 80px;
    bottom: -40px;
}

</style>