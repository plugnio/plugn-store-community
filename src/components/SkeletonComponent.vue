<template>
    <template v-if="loading">
        <ion-item>
            <ion-label>
                <h3>
                    <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                </h3>
                <p>
                    <ion-skeleton-text :animated="true" style="width: 60%;"></ion-skeleton-text>
                </p>
            </ion-label>
        </ion-item>
        <ion-item>
            <ion-label>
                <h3>
                    <ion-skeleton-text :animated="true" style="width: 80%;"></ion-skeleton-text>
                </h3>
                <p>
                    <ion-skeleton-text :animated="true" style="width: 30%;"></ion-skeleton-text>
                </p>
            </ion-label>
        </ion-item>
    </template>
</template>
<script setup lang="ts">
import { IonItem, IonLabel, IonSkeletonText } from '@ionic/vue';

defineProps(['loading', 'type']);
</script>