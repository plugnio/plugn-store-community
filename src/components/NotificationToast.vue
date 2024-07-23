<template>
    <div class="alert" :class="'alert-' + props.type" v-if="props">
        {{ $t(props.message, props.params) }}
    </div>  
</template>
<script setup lang="ts">
import { modalController } from '@ionic/vue';
import { onMounted } from 'vue';

const props = defineProps(["message", "params", "position", "type"]);

onMounted(() => {
    setTimeout(() => {
        modalController.dismiss(); 
    }, 1000)
});

</script>
<style scoped lang="scss">

.toast {
    --height: 75px;
    --width: 250px;

    .modal-wrapper  {
        top: 75px !important;
        left: 15px !important;
        display: block;
        position: fixed !important;    
    }
}
</style>