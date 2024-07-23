<template>
    <ion-nav :root="component"></ion-nav>
</template>
  
<script setup lang="ts">
import { IonNav } from '@ionic/vue';

defineProps(['component']);

</script>