<template>
    <div class="search-wrapper">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M11.1667 5.33317C7.94509 5.33317 5.33341 7.94484 5.33341 11.1665C5.33341 14.3882 7.94509 16.9998 11.1667 16.9998C14.3884 16.9998 17.0001 14.3882 17.0001 11.1665C17.0001 7.94484 14.3884 5.33317 11.1667 5.33317ZM3.66675 11.1665C3.66675 7.02437 7.02461 3.6665 11.1667 3.6665C15.3089 3.6665 18.6667 7.02437 18.6667 11.1665C18.6667 15.3086 15.3089 18.6665 11.1667 18.6665C7.02461 18.6665 3.66675 15.3086 3.66675 11.1665Z"
                fill="#3D3D3D" />
            <path fill-rule="evenodd" clip-rule="evenodd"
                d="M15.2858 15.2856C15.6113 14.9601 16.1389 14.9601 16.4643 15.2856L20.0893 18.9106C20.4148 19.236 20.4148 19.7637 20.0893 20.0891C19.7639 20.4145 19.2363 20.4145 18.9108 20.0891L15.2858 16.4641C14.9604 16.1387 14.9604 15.611 15.2858 15.2856Z"
                fill="#3D3D3D" />
        </svg>

        <input autocomplete="off" ref="inptSearch" @click="onClick" v-model="query" 
            :placeholder="$t('Search here')" />

        <button @click="reset()" class="btn-reset" v-if="query">
            <img src="../assets/icons/close-circle.svg" />
        </button>
    </div>
</template>

<script setup lang="ts">
import router from '@/router';
import debounce from 'lodash.debounce';
import { onMounted, ref, watch } from 'vue';

const props = defineProps(['isDummy']);

const emit = defineEmits(['change']);

const inptSearch = ref();

const query = ref();

onMounted(() => {
    if(props.isDummy) {
        return null;
    }

    setTimeout(() => {
        inptSearch.value.focus()
    }, 300)
}) 

watch(query, debounce(() => {
    emit('change', { value: query.value });
}, 500));

function onClick() {
    if(props.isDummy) {
        router.push('/search');
    }
}

function reset() {
    query.value = null;
    emit('change', { value: null });
}

</script>

<style lang="scss" scoped>
.search-wrapper {
    position: relative;
}

svg {
    position: absolute;
    left: 12px;
    top: 7px;
}

input {
    display: flex;
    padding: 8px 12px;
    padding-inline-start: 44px;
    align-items: center;
    gap: 12px;
    flex: 1 0 0;
    border-radius: 24px;
    background: var(--ion-color-light-shade, #F7F7F7);
    color: var(--ion-color-medium-shade, #707070);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    /* 157.143% */
    border: 0;
    width: calc(100% - 8px);
}

button {
    position: absolute;
    background: transparent;
    right: 18px;
    top: 8px;
}
</style>