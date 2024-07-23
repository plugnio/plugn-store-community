<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <ion-buttons slot="start">
                        <button type="button" color="primary" @click="dismiss()">
                            <img src="../../assets/icons/close.svg" />
                        </button>
                    </ion-buttons>
                    <!--
                    <ion-back-button text="" defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../assets/icons/close.svg" />
                    </ion-back-button>-->
                </ion-buttons>
                <ion-title v-if="item">{{ langContent(item.item_name, item.item_name_ar) }}</ion-title>
                <ion-buttons slot="end">
                    <ion-button @click="shareItem($event)">
                        <img src="../../assets/icons/share.svg" />
                    </ion-button>
                    <!-- todo: wishlist 
                    <ion-button>
                        <img src="../../assets/icons/like.svg" />
                    </ion-button>-->
                </ion-buttons>
            </ion-toolbar>

        </ion-header>

        <ion-content :fullscreen="true">
            <template v-if="item">
                <div class="image-wrapper">

                    <!-- todo: update image on thumbnail click -->
                    <div class="main-image" v-if="mainImage"
                        :style="{ backgroundImage: 'url(' + mainImage + ')' }">
                    </div>

                    <div class="main-video" v-if="mainVideo">
                        <iframe width="100%" height="400px" :src="mainVideo" frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                            allowfullscreen></iframe>
                    </div>

                    <!--
                    <ion-img loading="lazy" v-if="item.itemImages && item.itemImages.length > 0" 
                        @ionError="onItemImagesError(item)"
                        :src="'https://res.cloudinary.com/plugn/image/upload/q_auto:eco,w_1000/restaurants/' + store.state.restaurant_uuid + '/items/' + item.itemImages[0].product_file_name"></ion-img>
                 -->
                    <div class="thumbnail-list">

                        <template v-if="variant && variant.itemVariantImages">
                            <div tappable class="thumbnail" @click="setMainImage(itemImage)" v-for="(itemImage, index) in variant.itemVariantImages" :key="index">
                                <ion-img loading="lazy" @ionError="onItemImageError(index)"
                                    :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_200/restaurants/' + store.state.restaurant_uuid + '/items/' + itemImage.product_file_name"></ion-img>
                            </div>
                        </template>

                        <template v-if="item.itemImages">
                            <div tappable class="thumbnail" @click="setMainImage(itemImage)" v-for="(itemImage, index) in item.itemImages" :key="index">
                                <ion-img loading="lazy" @ionError="onItemImageError(index)"
                                    :src="'https://res.cloudinary.com/plugn/image/upload/c_scale,f_jpg,q_80,w_200/restaurants/' + store.state.restaurant_uuid + '/items/' + itemImage.product_file_name"></ion-img>
                            </div>
                        </template>


                        <template v-if="item.itemVideos">
                            <div tappable class="thumbnail" @click="setMainVideo(video)" v-for="(video, index) in item.itemVideos" :key="index">
                                <ion-img loading="lazy" @ionError="onItemImageError(index)"
                                    :src="'https://i.ytimg.com/vi/' + video.youtube_video_id + '/hqdefault.jpg'"></ion-img>
                            </div>
                        </template>
                    </div>

                </div>

                <h5 class="item-title">{{ langContent(item.item_name, item.item_name_ar) }}</h5>

                <p class="item-description" v-html="langContent(item.item_description, item.item_description_ar)"></p>

                <template v-if="haveTextOption || (item.item_type == 1 && item.options && item.options.length > 0)">
                    <div class="option-wrapper" v-for="(option, i) of item.options" :key="i">

                        <h5>{{ langContent(option.option_name, option.option_name_ar) }}

                            <!-- todo: validation -->

                            <div class="alert alert-warning"
                                v-if="(option.is_required || option.min_qty > 0) && !selectedOptions[option.option_id]">
                                <img src="../../assets/icons/alert.svg" />
                                {{ $t('Required') }}
                            </div>

                            <div class="alert alert-success"
                                v-if="(option.is_required || option.min_qty > 0) && selectedOptions[option.option_id]">
                                <img src="../../assets/icons/check.svg" />
                                {{ $t('Required') }}
                            </div>
                        </h5>

                        <p v-if="option.min_qty > 0 && option.max_qty > 1">
                            {{ $t('Select at least {min}', { min: option.min_qty }) }} 
                        </p>

                        <p v-if="option.min_qty == 0 && option.max_qty > 1">
                            {{ $t('Select up to {max}', { min: option.max_qty }) }} 
                        </p>

                        <ion-item v-if="option.option_type == 3">
                            <ion-textarea @ionInput="$event => onTextChange($event, option)"></ion-textarea>
                        </ion-item>

                        <!-- radio -->

                        <ion-radio-group :allowEmptySelection="true" @ionChange="$event => onRadioChange($event, option)"
                            v-if="option.option_type == 2 || (!option.option_type && option.max_qty == 1)">

                            <ion-item v-for="(extraOption, ei) in option.extraOptions" :key="ei">
                                <ion-radio mode="md" label-placement="end" justify="start"
                                    :disabled="(extraOption.stock_qty !== null && extraOption.stock_qty <= 0)"
                                    :value="extraOption.extra_option_id">
                                    {{ langContent(extraOption.extra_option_name, extraOption.extra_option_name_ar) }}
                                </ion-radio>
                                <ion-note slot="end" v-if="extraOption.extra_option_price > 0">
                                    +{{ toPrice(extraOption.extra_option_price) }}
                                </ion-note>
                            </ion-item>
                        </ion-radio-group>

                        <template v-if="option.option_type == 1 || (!option.option_type && option.max_qty != 1)">

                            <ion-item v-for="(extraOption, ei) in option.extraOptions" :key="ei">
                                <!--
                                    todo: check for checkbox limit 
                                    ( 
                            (form.controls[extraOption.extra_option_id].value == false || form.controls[extraOption.extra_option_id].value == null) && 
                            numberOfChecks[option.option_id] >= checkBoxLimit[option.option_id] 
                            ) || 
                            -->
                                <ion-checkbox mode="md" label-placement="end" justify="start"
                                    @ionChange="$event => onCheckboxChange($event, option, extraOption)"
                                    :disabled="(extraOption.stock_qty !== null && extraOption.stock_qty <= 0)">
                                    {{ langContent(extraOption.extra_option_name, extraOption.extra_option_name_ar) }}
                                </ion-checkbox>
                                <ion-note slot="end" v-if="extraOption.extra_option_price > 0">
                                    +{{ toPrice(extraOption.extra_option_price) }}
                                </ion-note>
                            </ion-item>
                        </template>
                    </div>
                </template>

                <template  v-if="item.item_type == 2">
                    <h6>{{ $t("Variations") }}</h6>

                    <ul class="list-variant">
                        <li tappable @click="onVariantSelection(itemVariant)"
                            :class="{ selected: itemVariant.item_variant_uuid == item_variant_uuid }"
                            v-for="(itemVariant, index) of item.itemVariants" :key="index">
                            
                            <span :key="indexOption" v-for="(variantOption, indexOption) of itemVariant.itemVariantOptions">
                                <b>{{ langContent(variantOption.option.option_name, variantOption.option.option_name_ar) }}</b>
                                {{ langContent(variantOption.extraOption.extra_option_name, variantOption.extraOption.extra_option_name_ar) }}
                            </span>

                            <!--
                            <ion-label v-if="itemVariant.track_quantity">
                                {{ itemVariant.stock_qty }} Unit Available 
                            </ion-label>
                            <ion-badge v-if="itemVariant.sku">SKU {{ itemVariant.sku }}</ion-badge>
                            <ion-badge v-if="itemVariant.barcode">Barcode {{ itemVariant.barcode }}</ion-badge>
                            <ion-badge v-if="itemVariant.weight">Weight {{ itemVariant.weight }}</ion-badge>
                            <p v-if="itemVariant.price">
                                <span v-if="itemVariant.compare_at_price" class="txt-compare-price">
                                {{ itemVariant.compare_at_price }} {{ authService.store?.currency?.code }}
                                </span>
                                {{ itemVariant.price }} {{ authService.store?.currency?.code }}
                            </p>     -->
                        </li>
                    </ul>
                </template>

                <p v-if="stock_qty > 0">{{ $t('In Stock') }}: {{ stock_qty }}</p>
                <p v-if="stock_qty == 0">{{ $t('Out of Stock') }}</p>

                <!--
                <div class="similar-wrapper">
                    <h5>Often ordered with
                    </h5>
                    <p>People usually order these items as well</p>

                    <ul>
                        <li>
                            <img class="item-image" src="../../assets/images/item-large.png " />

                            <h6>Water Bottle Small Size</h6>

                            <div class="price">
                                KWD 0.500
                                <div class="special-price">
                                    KWD 1.750
                                </div>
                            </div>

                            <button class="btn-add">
                                <img src="../../assets/icons/add.svg" /> <span>Add</span>
                            </button>
                        </li> 
                    </ul>
                </div>-->
            </template>

            <template v-if="!item">
                <div class="image-wrapper">

                    <!-- todo: update image on thumbnail click -->
                    <div class="main-image">
                        <IonSkeletonText :animated="true"></IonSkeletonText>
                    </div>

                </div>

                <h5 class="item-title"><IonSkeletonText :animated="true" style="width: 70%;"></IonSkeletonText></h5>

                <p class="item-description">
                    <IonSkeletonText :animated="true" style="width: 80%;"></IonSkeletonText>
                    <IonSkeletonText :animated="true" style="width: 70%;"></IonSkeletonText>
                    <IonSkeletonText :animated="true" style="width: 75%;"></IonSkeletonText>
                    <IonSkeletonText :animated="true" style="width: 60%;"></IonSkeletonText>
                </p>
   
            </template>
        </ion-content>
        <ion-footer v-if="item && (item.track_quantity == false || stock_qty > 0)">
            <ion-toolbar>

                <div class="cart-qty">
                    <button class="btn-minus" @click.stop="decreaseQty()">
                        <img src="../../assets/icons/minus-circle.svg" />
                    </button>
                    <input type="number" class="count" :value="qty" />
                    <!-- store.state.cart[item.item_uuid].qty ||  -->
                    <button class="btn-plus" @click.stop="increaseQty()" :disabled="qty == stock_qty">
                        <img src="../../assets/icons/add-circle.svg" />
                    </button>
                </div>

                <!-- todo: disable button and show message if no stock 
                        :disabled="item.track_quantity && 
                            store.state.cart[item.item_uuid] 
                            item.stock_qty == store.state.cart[item.item_uuid].qty"-->

                <button class="add-to-cart" @click.stop="addItemToCart()" :disabled="!isValid">
                    {{ $t('Add to Cart') }}
                    <span class="sep">·</span>
                    <span class="txt-total">{{ toPrice(qty * item_price) }}</span>
                </button>
            </ion-toolbar>
        </ion-footer>
    </ion-page>
</template>
<script setup  lang="ts">
import { toPrice } from '@/pipes/price';
import router from '@/router';
import { trackEvent, trackView } from '@/services/AnalyticsService';
import { addToCart } from '@/services/CartService';
import { loadItemBySlug } from '@/services/StoreService';
import store from '@/store';
import { IonButtons, IonButton, IonContent, IonTextarea, IonCheckbox, IonRadio, IonRadioGroup, IonItem, IonHeader, IonPage, IonTitle, IonToolbar, IonFooter, IonNote, IonImg, onIonViewDidEnter, modalController, actionSheetController, isPlatform, popoverController, IonSkeletonText } from '@ionic/vue';
import { logoFacebook, logoTwitter, mail } from 'ionicons/icons';
import { onMounted, ref } from 'vue';
import { Share } from '@capacitor/share';
import ItemShare from '@/components/ItemShare.vue';
import { useI18n } from 'vue-i18n';
import { langContent } from '@/services/TranslateService';

const stock_qty = ref(0);
const item = ref();
const item_variant_uuid = ref(null);
const variant = ref();
const mainImage = ref();
const mainVideo = ref();
const item_price = ref();
const haveTextOption = ref(false);
const selectedOptions = ref({});

const isValid = ref(false);

const qty = ref(1);

const props = defineProps(['itemProps']);

const { t } = useI18n({ useScope: "global" });

onMounted(() => {
    trackView('item-detail-page');

    if(props.itemProps.itemImages && props.itemProps.itemImages.length > 0)
        setMainImage(props.itemProps.itemImages[0]);

    popupItemData(props.itemProps.slug);
});

onIonViewDidEnter(() => {

    const slug = router.currentRoute.value.params['slug'];

    popupItemData(slug);
});

/**
 * validate each option 
 */
function validate() {

    if (item.value.item_type == 2)  {
        isValid.value = true; 
        return;
    }

    //stock validation 
    //todo: cart validation store.state.cart[item.item_uuid]  

    if (item.value.track_quantity && qty.value > item.value.stock_qty) {
        isValid.value = false; 
        return;
    }

    //if non variant with option 
    
    for(let option of item.value.options) {

        //required field validation 

        if ((option.is_required || option.min_qty > 0) && !selectedOptions.value[option.option_id]) {
            isValid.value = false; 
            return;   
        }

        //mix qty validation 

        if (
            selectedOptions.value[option.option_id] && 
            option.min_qty > 0 && selectedOptions.value[option.option_id].length == 0
        ) {
            isValid.value = false; 
            return;  
        }

        //max qty validation

        if (
            selectedOptions.value[option.option_id] && 
            selectedOptions.value[option.option_id].length > option.max_qty
        ) {
            isValid.value = false; 
            return;  
        }
    }

    isValid.value = true; 
    return;   
}

function setMainVideo(video) {
    mainImage.value = null;
    mainVideo.value = "https://www.youtube.com/embed/" + video.youtube_video_id;
}

function setMainImage(image) {  
    mainVideo.value = null;
    mainImage.value =  'https://res.cloudinary.com/plugn/image/upload/q_auto:eco,w_500/restaurants/' + store.state.restaurant_uuid + '/items/' + image.product_file_name;
}

async function shareItem(ev) {

    trackEvent("Item Shared", "name", item.value.item_name, item_price.value, item.value.item_uuid);

    const subject = item.value.item_name;
    const message = 'Checkout ' + item.value.item_name + ' at ' + store.state.store.name;
    const url = window.location.href;

    try {
        Share.canShare().then(async canShare => {
 
            if (canShare) {

                await Share.share({
                    title: subject,
                    text: message,
                    url: url,
                    dialogTitle: t('Share with buddies'),
                });
            } 
        }).catch(async err => {
            if(isPlatform('desktop')) {
                const popover = await popoverController.create({
                    component: ItemShare,
                    componentProps: {
                        subject,
                        message,
                        url
                    },
                    event: ev,
                });
                await popover.present();
            } else {
                shareActionSheet(subject, message, url);
            }
        });
    } catch (err) {
        console.log(err);
    }
}

/**
 * show share action sheet for desktop 
 */
async function shareActionSheet(subject, message, url) {

    const actionSheet = await actionSheetController.create({
        header: t('Share'),
        cssClass: 'action-sheet-md',
        buttons: [
            {
                text: t('Facebook'),
                icon: logoFacebook,
                handler: () => {
                    const a = 'https://www.facebook.com/sharer/sharer.php?u=' + url;
                    window.open(a, '_blank');
                }
            },
            {
                text: t('Twitter'),
                icon: logoTwitter,
                handler: () => {
                    const a = 'https://twitter.com/intent/tweet?text=' + message + '&url=' + url + '&related=';
                    window.open(a, '_blank');
                }
            },
            {
                text: t('Email'),
                icon: mail,
                handler: () => {
                    const a = 'mailto:?subject=' + subject + '&body=' + encodeURI(message) + ' ' + url;
                    window.open(a, '_blank');
                }
            },
        ]
    });

    await actionSheet.present();
}

/**
 * load item details 
 * @param slug 
 */
function popupItemData(slug) {

    loadItemBySlug(slug).then(res => {

        item.value = res;

        if (item.value.item_type == 2 && !variant.value) {

            if (item.value.itemVariants.length == 0) {

                //variants missing 

                router.push('/')
                return;
            }

            onVariantSelection(item.value.itemVariants[0]);
        }

        if (item.value.item_type == 1) {
            stock_qty.value = item.value.stock_qty;
        } else {
            stock_qty.value = variant.value.stock_qty;
        }

        for (const option of res.options) {
            if (option.option_type == 3) {
                haveTextOption.value = true;
                break;
            }
        }

        if(!mainImage.value) {
            if(item.value.itemImages.length > 0)
                setMainImage(item.value.itemImages[0]);
            else if(item.value.itemVideos.length > 0)
                setMainVideo(item.value.itemVideos[0]);
        } 
 
        //set initial value 

        updateItemPrice();

    }).catch((e) => { 
        console.error(e);
    });
}

function increaseQty() {
    qty.value++;
}

function decreaseQty() {
    if (qty.value == 0)
        return;

    qty.value--;
}

function onItemImageError(index) {
    delete item.value.itemImages[index];
}

function onVariantSelection(itemVariant) {

    variant.value = itemVariant;

    stock_qty.value = variant.value.stock_qty;

    item_variant_uuid.value = itemVariant.item_variant_uuid;

    const variantOptions = {};

    variant.value.itemVariantOptions.forEach(itemVariantOption => {

        if (!variantOptions[itemVariantOption.option_id])
            variantOptions[itemVariantOption.option_id] = [];

        variantOptions[itemVariantOption.option_id].push({
            extra_option_id: itemVariantOption.extra_option_id,
            extra_option_name: itemVariantOption.extraOption.extra_option_name,
            extra_option_name_ar: itemVariantOption.extraOption.extra_option_name_ar,
            extra_option_price: itemVariantOption.extraOption.extra_option_price,
            option_id: itemVariantOption.option_id,
            stock_qty: null
        });
    });

    selectedOptions.value = variantOptions;

    if(variant.value.itemVariantImages.length > 0) {
        setMainImage(variant.value.itemVariantImages[0]);
    //todo: variant videos in future     
    //} else if(variant.value.itemVideos.length > 0) {
    //    setMainVideo(variant.value.itemVideos[0]);
    }
        
    updateItemPrice();
}

function onTextChange(event, option) {

    selectedOptions.value[option.option_id] = [{
        extra_option_name: event.target.value,
        extra_option_name_ar: event.target.value,
        option_id: option.option_id,
        extra_option_price: event.target.value.length > 0 ?
            option.option_price : 0
    }];

    updateItemPrice();
}

function onRadioChange(event, option) {

    if (event.detail.value) {
        const extraOption = option.extraOptions.find(eo => eo.extra_option_id == event.detail.value);

        if (!selectedOptions.value[option.option_id])
            selectedOptions.value[option.option_id] = [];

        selectedOptions.value[option.option_id].push(extraOption);
    }
    else {
        delete selectedOptions.value[option.option_id];
    }

    updateItemPrice();
}

function onCheckboxChange(event, option, extraOption) {

    if (!selectedOptions.value[option.option_id])
        selectedOptions.value[option.option_id] = [];

    if (event.detail.checked) {
        selectedOptions.value[option.option_id].push(extraOption);
    }
    else {
        selectedOptions.value[option.option_id] = selectedOptions.value[option.option_id]
            .filter(eo => eo.extra_option_id != extraOption.extra_option_id);
    }

    updateItemPrice();
}

function updateItemPrice() {

    let price = item.value.item_type == 1 ? parseFloat(item.value.item_price) :
        parseFloat(variant.value.price);

    for (const i in selectedOptions.value) {

        for (const j in selectedOptions.value[i]) {
            price += parseFloat(selectedOptions.value[i][j].extra_option_price);
        }
    }

    item_price.value = price;

    validate();
}

function addItemToCart() {

    //todo: add validation + show error toast for error

    const extraOptions = [];

    for (const i in selectedOptions.value) {

        for (const j in selectedOptions.value[i]) {
            extraOptions.push(selectedOptions.value[i][j]);
        }
    }

    item.value.item_price = item_price.value;

    if (item.value.itemImages && item.value.itemImages.length > 0)
        item.value.itemImage = item.value.itemImages[0];

    if (addToCart(item.value, qty.value, extraOptions, variant.value)) {
        dismiss();
    }
}

function dismiss() {
    modalController.getTop().then(o => {
        if (o) {
            modalController.dismiss();
        } else if (window.history.length > 0) {
            router.back();
        } else {
            router.push('/');
        }
    });
}

</script>
<style lang="scss" scoped>
ion-footer {
    display: flex;
    padding-bottom: 0px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 8px;

    ion-toolbar {
        display: flex;
        padding: 8px 0 0 0;
    }

    .cart-qty {
        display: inline-flex;

        input {
            border: none;
            color: var(--ion-color-dark-shade, #1A1A1A);
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            /* 150% */
            display: flex;
            width: 56px;
            padding: 12px;
            justify-content: center;
            align-items: center;
            gap: 8px;
            border-radius: 12px;
            background: var(--ion-color-light-shade, #F7F7F7);
        }

        .btn-minus,
        .btn-plus {
            display: flex;
            padding: 12px 14px;
            align-items: flex-start;
            gap: 8px;
            background: transparent;
        }
    }

    .add-to-cart {
        display: inline-flex;
        padding: 8px 16px;
        align-items: center;
        gap: 8px;
        flex: 1 0 0;
        border-radius: 16px;
        background: var(--ion-color-primary, #453E9A);
        color: var(--ion-color-primary-contrast, #FFF);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: normal;
        height: 48px;
        position: relative;
        top: -8px;

        .txt-total {
            color: var(--ion-shades-primary-p-2, #E8E5FF);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 22px;
            /* 157.143% */
        }
    }
}

.list-variant {
    list-style: none;
    padding: 0;

    li {
        border: 1px solid #eee;
        padding: 5px;
        display: inline-block;
        margin: 5px;

        span {
            display: inline-block;
            padding: 2px 12px;
            border-inline-end: 1px solid #eee;
        }

        span:last-child {
            border-inline-end: none;
        }

        b {
            clear: both;
            display: block;
            text-transform: capitalize;
        }
    }

    .selected {
        outline: 1px solid var(--ion-color-primary);
    }
}

.similar-wrapper {
    h5 {
        color: var(--ion-color-medium-shade, #202020);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22.4px;
        /* 140% */
        margin-bottom: 4px;
        margin-top: 0;
    }

    p {
        color: var(--ion-shades-neutral-n-7, #3D3D3D);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        /* 157.143% */
        margin-top: 0;
    }

    ul {
        margin: 0;
        padding: 0;

        li {
            display: inline-block;
            width: 144px;
            padding: 12px;
            flex-direction: column;
            align-items: flex-start;
            gap: 12px;
            flex-shrink: 0;
            border-radius: 16px;
            border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
            margin-inline-end: 16px;

            .item-image {
                margin-bottom: 12px;
            }

            h6 {
                color: var(--ion-color-medium-shade, #202020);
                font-size: 14px;
                font-style: normal;
                font-weight: 400;
                line-height: 22px;
                margin: 0 0 4px 0;
            }

            .price {
                color: var(--ion-color-primary, #453E9A);
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                margin-top: 0;
                margin-bottom: 12px;

                .special-price {
                    color: #8F8F8F;
                    font-size: 14px;
                    font-style: normal;
                    font-weight: 400;
                    line-height: 20px;
                    /* 142.857% */
                    text-decoration: line-through;
                    text-decoration-line: strikethrough;
                }
            }

            .btn-add {
                padding: 8px 10px 8px 6px;
                border-radius: 10px;
                background: var(--ion-color-primary, #453E9A);
                color: var(--ion-color-primary-contrast, #FFF);
                font-size: 12px;
                font-style: normal;
                font-weight: 500;
                line-height: normal;
                width: 100%;
                text-align: center;

                span {
                    position: relative;
                    top: -5px;
                }
            }
        }
    }
}

.option-wrapper {
    border-bottom: 4px solid var(--ion-color-primary-shade, #F0F0F0);
    margin-top: 24px;
    margin-bottom: 24px;

    h5 {
        color: var(--ion-color-medium-shade, #202020);
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 22.4px;
        /* 140% */
        margin-bottom: 5px;

        .alert {
            border-radius: 16px;
            font-size: 12px;
            font-style: normal;
            font-weight: 500;
            line-height: normal;
            float: var(--end);
            height: 24px;
            padding: 4px 8px;

            img {
                float: var(--start);
                margin-inline-end: 4px;
            }
        }

        .alert-warning {
            background: var(--ion-color-warning-tint, #FFF7EB);
            color: var(--ion-shades-yellow-y-5, #D07900);
        }

        .alert-success {
            color: var(--ion-color-success, #25BA69);
            background: var(--ion-color-success-contrast, #F2FDF7);
        }
    }

    p {
        color: var(--ion-shades-neutral-n-7, #3D3D3D);
        font-size: 14px;
        font-style: normal;
        font-weight: 400;
        line-height: 22px;
        margin-top: 4px;
        /* 157.143% */
    }

    ion-item {
        --inner-border-width: 0;
        border-bottom: 1px solid var(--ion-color-primary-shade, #F0F0F0);

        ion-label {
            color: var(--ion-color-dark-shade, #1A1A1A);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            /* 150% */
        }

        ion-note {
            color: var(--ion-color-medium-shade, #707070);
            text-align: var(--end);
            font-size: 16px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            /* 150% */
        }
    }

    ion-item:last-child {
        border-bottom: none;

    }
}

.image-wrapper {
    margin: -16px -16px 16px -16px;
    position: relative;
    width: calc(100% + 32px);
    height: 260px;
    display: block;
    overflow: hidden;

    .main-video,
    .main-image {
        width: 100%;
        height: 100%;
        background-position: center center;
        background-size: auto 100%;
        background-repeat: no-repeat;
    }

    .main-video iframe {
        height: 100%;
    }

    .thumbnail-list {
        top: 12px;
        left: 12px;
        position: absolute;
        overflow-y: scroll;
        height: 250px;

        .thumbnail {
            width: 48px;
            height: 48px;
            border-radius: 16px;
            margin-bottom: 8px;
            overflow: hidden;
            cursor: pointer;
            //background: url(<path-to-image>), lightgray 50% / cover no-repeat;

            ion-img,
            img {
                width: 100%;
                height: 100%;
            }
        }
    }
}

.item-title {
    color: var(--ion-color-dark-shade, #1A1A1A);
    font-size: 24px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    margin-bottom: 4px;

    ion-skeleton-text {
        height: 24px;
        margin-bottom: 15px;
    }
}

.item-description {
    color: var(--ion-color-medium, #404040);
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin: 0 0 32px;
    /* 157.143% */
}
</style>
<!-- 
    todo: option validation for add to cart 

    checkbox validation message for min max requirement 
-->