<template>
    <div class="voucher">
        <div class="icon-wrapper">
            <img src="../assets/icons/voucher-percent.svg" />
        </div>
        <div class="detail">
            
            <!-- on {{ toPrice(voucher.minimum_order_amount) }} or more order total!-->
            <h5 v-if="voucher.discount_type == 1">
                {{ 
                    $t('{value} OFF!', {
                        value: voucher.discount_amount + '%'
                    }) 
                }} 
            </h5>
            <h5 v-if="voucher.discount_type == 2">
                {{ 
                    $t('{value} OFF!', {
                        value: toPrice(voucher.discount_amount)
                    }) 
                }} 
            </h5>    
            <h5 v-if="voucher.discount_type == 3">
                {{ $t('Free delivery!') }}
            </h5>

            <p>{{ $t('Use code {code}', { code: voucher.code }) }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
import { toPrice } from '@/pipes/price';

defineProps(['voucher']);

</script>

<style lang="scss" scoped>
.voucher {
    width: 329px;
    padding-inline-end: 0px;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
    border-radius: 16px;
    background: var(--ion-color-warning-tint, #FFF7EB);
    margin-inline-end: 16px;

    .icon-wrapper { 
        padding: 20px;
        align-items: flex-start;
        gap: 8px;
        align-self: stretch;
        border-radius: 16px 0px 0px 16px;
        background: var(--ion-shades-yellow-y-2, #FFEFD9);
        float: var(--start);

        .icon {
            display: flex;
            width: 24px;
            height: 24px;
            padding: 0.937px 0.921px;
            justify-content: center;
            align-items: center;
        }
    }

    .detail {
        padding: 10px 16px;
        float: var(--start);
        
        h5, p {
            line-height: 22px; /* 157.143% */
            margin: 0;
        }

        h5 {
            color: var(--ion-color-dark-shade);
            font-size: 14px; 
            font-weight: 600; 
        }

        p {
            color: var(--ion-color-medium-shade, #707070);
            font-size: 14px;
            font-weight: 400; 
        }
    }
}

[dir="rtl"] .icon-wrapper {
    border-radius:  0px 16px 16px 0px;
}

</style>