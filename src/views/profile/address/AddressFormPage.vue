<template>
    <ion-page>
        <ion-header :translucent="true">
            <ion-toolbar>
                <ion-buttons slot="start">
                    <button type="button" color="primary" @click="dismiss()">
                        <img src="../../../assets/icons/close.svg" />
                    </button>
                    <!--
                    <ion-back-button text=""  defaultHref="/" :icon="chevronBack" color="primary">
                        <img src="../../../assets/icons/chevron-left.svg" />
                    </ion-back-button>-->
                </ion-buttons>
                <ion-title v-if="id">
                    {{ $t('Edit Address') }}
                </ion-title>
                <ion-title v-if="!id">
                    {{ $t('Add Address') }}
                </ion-title>
            </ion-toolbar>
        </ion-header>

        <ion-content :fullscreen="true">
            <form @submit.stop.prevent="onSubmit">

                <ion-item class="form-field area-field" tappable @click="selectArea">
                    <img src="../../../assets/icons/location.svg" slot="start" />
                    <ion-label v-if="props.area">
                        <h5>{{ $t('Area') }}</h5>
                        <p>{{ langContent(props.area.area_name, props.area.area_name_ar) }}</p>
                    </ion-label>
                    <ion-label v-if="props.city">
                        <h5>{{ $t('City') }}</h5>
                        <p>{{ langContent(props.city.city_name, props.city.city_name_ar) }}</p>
                    </ion-label>
                    <ion-label v-if="!props.city && !props.area">
                        <h5>{{ $t('Location') }}</h5>
                        <p>{{ $t('Set your location') }}</p>
                    </ion-label>
                    <img class="rotate-ar" src="../../../assets/icons/chevron-right.svg" slot="end" />
                </ion-item>
                <p class="txt-field-error" v-if="meta.validated && errors.country_id">
                    {{ $t('Location is a required field') }}
                </p>

                <div class="type-wrapper">
                    <button class="btn-home" type="button" @click="setFieldValue('unit_type', 'house')" :class="{ active: values.unit_type == 'house' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.59075 0.806447C7.83149 0.619205 8.16859 0.619205 8.40933 0.806447L14.4093 5.47311C14.5717 5.59942 14.6667 5.79362 14.6667 5.99935V13.3327C14.6667 13.8631 14.456 14.3718 14.0809 14.7469C13.7058 15.122 13.1971 15.3327 12.6667 15.3327H3.33337C2.80294 15.3327 2.29423 15.122 1.91916 14.7469C1.54409 14.3718 1.33337 13.8631 1.33337 13.3327V5.99935C1.33337 5.79362 1.42836 5.59942 1.59075 5.47311L7.59075 0.806447ZM2.66671 6.3254V13.3327C2.66671 13.5095 2.73695 13.6791 2.86197 13.8041C2.98699 13.9291 3.15656 13.9993 3.33337 13.9993H12.6667C12.8435 13.9993 13.0131 13.9291 13.1381 13.8041C13.2631 13.6791 13.3334 13.5095 13.3334 13.3327V6.3254L8.00004 2.17726L2.66671 6.3254Z"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.33337 7.99935C5.33337 7.63116 5.63185 7.33268 6.00004 7.33268H10C10.3682 7.33268 10.6667 7.63116 10.6667 7.99935V14.666C10.6667 15.0342 10.3682 15.3327 10 15.3327C9.63185 15.3327 9.33337 15.0342 9.33337 14.666V8.66602H6.66671V14.666C6.66671 15.0342 6.36823 15.3327 6.00004 15.3327C5.63185 15.3327 5.33337 15.0342 5.33337 14.666V7.99935Z" />
                        </svg>
                        <!--<img src="../../../assets/icons/home.svg" slot="end" />-->
                        {{ $t('House') }}
                    </button>
                    <button class="btn-apartment" type="button" @click="setFieldValue('unit_type', 'apartment')" :class="{ active: values.unit_type == 'apartment' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                            <path d="M1.5 14H14.5M2.5 2V14M9.5 2V14M13.5 5V14M4.5 4.5H5M4.5 6.5H5M4.5 8.5H5M7 4.5H7.5M7 6.5H7.5M7 8.5H7.5M4.5 14V11.75C4.5 11.336 4.836 11 5.25 11H6.75C7.164 11 7.5 11.336 7.5 11.75V14M2 2H10M9.5 5H14M11.5 7.5H11.5053V7.50533H11.5V7.5ZM11.5 9.5H11.5053V9.50533H11.5V9.5ZM11.5 11.5H11.5053V11.5053H11.5V11.5Z" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!-- <img src="../../../assets/icons/apartment.svg" slot="end" /> -->
                        {{ $t('Apartment') }}
                    </button>
                    <button class="btn-work" type="button" @click="setFieldValue('unit_type', 'work')" :class="{ active: values.unit_type == 'work' }">
                        <!-- <img src="../../../assets/icons/work.svg" slot="end" /> -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                           <path fill-rule="evenodd" clip-rule="evenodd" d="M2.66663 5.33398C2.29844 5.33398 1.99996 5.63246 1.99996 6.00065V12.6673C1.99996 13.0355 2.29844 13.334 2.66663 13.334H13.3333C13.7015 13.334 14 13.0355 14 12.6673V6.00065C14 5.63246 13.7015 5.33398 13.3333 5.33398H2.66663ZM0.666626 6.00065C0.666626 4.89608 1.56206 4.00065 2.66663 4.00065H13.3333C14.4379 4.00065 15.3333 4.89608 15.3333 6.00065V12.6673C15.3333 13.7719 14.4379 14.6673 13.3333 14.6673H2.66663C1.56206 14.6673 0.666626 13.7719 0.666626 12.6673V6.00065Z" />
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M5.25241 1.91977C5.62749 1.5447 6.13619 1.33398 6.66663 1.33398H9.33329C9.86372 1.33398 10.3724 1.5447 10.7475 1.91977C11.1226 2.29484 11.3333 2.80355 11.3333 3.33398V14.0007C11.3333 14.3688 11.0348 14.6673 10.6666 14.6673C10.2984 14.6673 9.99996 14.3688 9.99996 14.0007V3.33398C9.99996 3.15717 9.92972 2.9876 9.8047 2.86258C9.67967 2.73756 9.5101 2.66732 9.33329 2.66732H6.66663C6.48981 2.66732 6.32025 2.73756 6.19522 2.86258C6.0702 2.9876 5.99996 3.15717 5.99996 3.33398V14.0007C5.99996 14.3688 5.70148 14.6673 5.33329 14.6673C4.9651 14.6673 4.66663 14.3688 4.66663 14.0007V3.33398C4.66663 2.80355 4.87734 2.29484 5.25241 1.91977Z" />
                        </svg>
                        {{ $t('Work') }}
                    </button>
                </div>
                <p class="txt-field-error" v-if="meta.validated && errors.unit_type">
                    {{ $t('Unit type is a required field field') }}
                </p>

                <ion-item class="form-field" v-if="values.unit_type == 'office'">
                    <ion-input v-bind="office" inputmode="numeric" :label="$t('Office No.')" label-placement="floating"
                        :placeholder="$t('Enter office no.')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.office">
                    {{ $t('Office number is a not valid field') }}
                </p>

                <ion-item class="form-field" v-if="values.unit_type == 'house'">
                    <ion-input v-bind="house_number" inputmode="numeric" :label="$t('House No.')" label-placement="floating"
                        :placeholder="$t('Enter house no.')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.house_number">
                    {{ $t('House number is a not valid field') }}
                </p>

                <ion-item v-if="values.unit_type == 'apartment'" class="form-field">
                    <ion-input v-bind="apartment" inputmode="numeric" :label="$t('Apartment No.')" label-placement="floating"
                        :placeholder="$t('Enter apartment no.')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.apartment">
                    {{ $t('Apartment number is a not valid field') }}
                </p>

                <ion-item class="form-field">
                    <ion-input v-bind="floor" inputmode="numeric" :label="$t('Floor (optional)')" label-placement="floating"
                        :placeholder="$t('Enter floor no.')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.floor">
                    {{ $t('Floor number is a not valid field') }}
                </p>

                <!-- 
                    block 
                    avenue 
                    address_2
                -->

                <ion-item class="form-field">
                    <ion-input v-bind="building" :label="$t('Building name (optional)')" label-placement="floating" :placeholder="$t('Enter building name')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.building">
                    {{ $t('Building is a not valid field') }}
                </p>

                <ion-item class="form-field">
                    <ion-input v-bind="street" :label="$t('Street')" label-placement="floating" :placeholder="$t('Enter street')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.street">
                    {{ $t('{field} is a required field', { 'field': $t("Street") }) }}</p>

                <ion-item class="form-field">
                    <ion-input v-bind="postalcode" :label="$t('Postalcode/ Zipcode/ Pincode')" label-placement="floating" 
                        :placeholder="$t('Enter Postalcode/ Zipcode/ Pincode')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.postalcode">{{ $t(errors.postalcode) }}</p>
                
                <ion-item class="form-field">
                    <ion-input v-bind="special_directions" :label="$t('Additional directions (optional)')" label-placement="floating"
                        :placeholder="$t('Enter additional directions')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.special_directions">{{ $t(errors.special_directions) }}</p>
                
                <h5>{{ $t('Delivery Options') }}</h5>

                <div class="type-wrapper">
                    <button class="btn-leave-at-door" type="button" @click="setFieldValue('delivery_instructions', 'Leave at door')" :class="{ active: values.delivery_instructions == 'Leave at door' }">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M2.1134 4.95898L8.00006 8.36564L13.8467 4.97896" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M8.00006 14.406V8.35938" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.62004 1.65203L3.06004 3.63205C2.25337 4.07872 1.59338 5.19871 1.59338 6.11871V9.88539C1.59338 10.8054 2.25337 11.9254 3.06004 12.372L6.62004 14.3521C7.38004 14.7721 8.6267 14.7721 9.3867 14.3521L12.9467 12.372C13.7534 11.9254 14.4134 10.8054 14.4134 9.88539V6.11871C14.4134 5.19871 13.7534 4.07872 12.9467 3.63205L9.3867 1.65203C8.62003 1.22536 7.38004 1.22536 6.62004 1.65203Z" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M11.3333 8.82577V6.38578L5.00665 2.73242" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <!--<img src="../../../assets/icons/box.svg" slot="end" />-->
                        {{ $t('Leave at door') }}
                    </button>
                    <button class="btn-hand-it" type="button" @click="setFieldValue('delivery_instructions', 'Hand it to me')" :class="{ active: values.delivery_instructions == 'Hand it to me' }">
                        <!-- <img src="../../../assets/icons/user.svg" slot="end" /> -->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <path fill-rule="evenodd" clip-rule="evenodd" d="M2.97631 10.3103C3.60143 9.68517 4.44928 9.33398 5.33333 9.33398H10.6667C11.5507 9.33398 12.3986 9.68517 13.0237 10.3103C13.6488 10.9354 14 11.7833 14 12.6673V14.0007C14 14.3688 13.7015 14.6673 13.3333 14.6673C12.9651 14.6673 12.6667 14.3688 12.6667 14.0007V12.6673C12.6667 12.1369 12.456 11.6282 12.0809 11.2531C11.7058 10.878 11.1971 10.6673 10.6667 10.6673H5.33333C4.8029 10.6673 4.29419 10.878 3.91912 11.2531C3.54405 11.6282 3.33333 12.1369 3.33333 12.6673V14.0007C3.33333 14.3688 3.03486 14.6673 2.66667 14.6673C2.29848 14.6673 2 14.3688 2 14.0007V12.6673C2 11.7833 2.35119 10.9354 2.97631 10.3103Z" fill="#707070"/>
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.00002 2.66732C6.89545 2.66732 6.00002 3.56275 6.00002 4.66732C6.00002 5.77189 6.89545 6.66732 8.00002 6.66732C9.10459 6.66732 10 5.77189 10 4.66732C10 3.56275 9.10459 2.66732 8.00002 2.66732ZM4.66669 4.66732C4.66669 2.82637 6.15907 1.33398 8.00002 1.33398C9.84097 1.33398 11.3334 2.82637 11.3334 4.66732C11.3334 6.50827 9.84097 8.00065 8.00002 8.00065C6.15907 8.00065 4.66669 6.50827 4.66669 4.66732Z" fill="#707070"/>
                        </svg>

                        {{ $t('Hand it to me') }}
                    </button>
                    <button class="btn-leave" type="button" @click="setFieldValue('delivery_instructions', 'Leave with guard')" :class="{ active: values.delivery_instructions == 'Leave with guard' }">
                        <!-- <img src="../../../assets/icons/security.svg" slot="end" />-->
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                           <path d="M6.99334 1.48703L3.66668 2.73369C2.90001 3.02036 2.27335 3.92702 2.27335 4.74702V9.70035C2.27335 10.487 2.79335 11.5204 3.42669 11.9937L6.29335 14.1337C7.23335 14.8404 8.78 14.8404 9.72 14.1337L12.5867 11.9937C13.22 11.5204 13.74 10.487 13.74 9.70035V4.74702C13.74 3.92702 13.1133 3.02036 12.3467 2.73369L9.02001 1.48703C8.45334 1.28036 7.54667 1.28036 6.99334 1.48703Z" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7.99999 7.28027C7.97332 7.28027 7.93999 7.28027 7.91332 7.28027C7.28665 7.26027 6.78665 6.74027 6.78665 6.10693C6.78665 5.46027 7.31332 4.93359 7.95999 4.93359C8.60666 4.93359 9.13333 5.46027 9.13333 6.10693C9.12666 6.74693 8.62666 7.26027 7.99999 7.28027Z" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M6.67333 9.1482C6.03333 9.57487 6.03333 10.2749 6.67333 10.7015C7.4 11.1882 8.59333 11.1882 9.32 10.7015C9.96 10.2749 9.96 9.57487 9.32 9.1482C8.6 8.66154 7.40666 8.66154 6.67333 9.1482Z" stroke="#707070" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        {{ $t('Leave with guard') }}
                    </button>
                </div>

                <ion-item class="form-field">
                    <ion-input v-bind="delivery_instructions" :label="$t('Delivery Instructions')" label-placement="floating"
                        :placeholder="$t('Enter delivery instructions')"></ion-input>
                </ion-item>
                <p class="txt-field-error" v-if="errors.delivery_instructions">{{ $t(errors.delivery_instructions) }}</p>
                
                <div class="btn-wrapper">
                    <button :disabled="!meta.valid || submitting" class="btn-submit">
                        <span v-if="!submitting && id">{{ $t('Update Address') }}</span>
                        <span v-if="!submitting && !id">{{ $t('Add New Address') }}</span>
                        <IonSpinner v-if="submitting"></IonSpinner>
                    </button>
                </div>
            </form>

        </ion-content>
    </ion-page>
</template>
<script setup  lang="ts">
import router from '@/router';
import { addAddress, getAddress, updateAddress } from '@/services/AddressService';
import { errorMessage } from '@/services/HTMLService';
import { IonInput, IonItem, IonLabel, IonButtons, IonContent, IonHeader, IonPage, IonTitle, IonToolbar, onIonViewDidEnter, alertController, IonSpinner, modalController } from '@ionic/vue';

import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/yup';
import * as yup from 'yup';
import { reactive, ref } from 'vue';
import AreaPage from './AreaPage.vue';
import { trackView } from '@/services/AnalyticsService';
import { useI18n } from 'vue-i18n';
import { langContent } from '@/services/TranslateService';

const { t } = useI18n({ useScope: "global" });

const id = router.currentRoute.value.params['id'];

//{ area, city, state, country }
const props = reactive({
    area: null,
    city: null,
    state: null,
    country: null,
});

const { errors, defineInputBinds, meta, handleSubmit, values, setValues, setFieldValue } = useForm({
    validationSchema: toTypedSchema(
        yup.object({
            area_id: yup.number().nullable(),
            city_id: yup.number().nullable(),
            country_id: yup.number().required(),
            unit_type: yup.string().min(1).required(),
            house_number: yup.number().nullable(),
            floor: yup.number().nullable(),
            apartment: yup.number().nullable(),
            building: yup.string(),
            block: yup.string(),
            street: yup.string().required(),
            avenue: yup.string(),
            office: yup.number().nullable(),
            postalcode: yup.string(),
            address_1: yup.string(),
            address_2: yup.string(),
            special_directions: yup.string(),
            delivery_instructions: yup.string()
        })
    ),
});

onIonViewDidEnter(() => {

    trackView('address-form-page');

    if(!id) return;
         
    getAddress(id).then(res => {
        
        props.area = res.area; 
        props.city = res.city; 
        props.state = res.state; 
        props.country = res.country;

        setValues({
            area_id: res.area_id,
            city_id : res.city_id,
            country_id : res.country_id,
            unit_type : res.unit_type,
            house_number : res.house_number,
            floor : res.floor,
            apartment : res.apartment,
            building : res.building,
            block : res.block,
            street : res.street,
            avenue : res.avenue,
            office : res.office,
            postalcode : res.postalcode,
            address_1 : res.address_1,
            address_2: res.address_2,
            special_directions: res.special_directions,
            delivery_instructions: res.delivery_instructions,
        });
    }).catch((e) => {
        console.error(e);
    });
})

const house_number = defineInputBinds('house_number', {
    validateOnInput: true
});
const floor = defineInputBinds('floor', {
    validateOnInput: true
});
const apartment = defineInputBinds('apartment', {
    validateOnInput: true
});
const office = defineInputBinds('office', {
    validateOnInput: true
});
   
const block = defineInputBinds('block', {
    validateOnInput: true
});
const street = defineInputBinds('street', {
    validateOnInput: true
});
const avenue = defineInputBinds('avenue', {
    validateOnInput: true
});
const building = defineInputBinds('building', {
    validateOnInput: true
}); 
 
const postalcode = defineInputBinds('postalcode', {
    validateOnInput: true
});
const address_1 = defineInputBinds('address_1', {
    validateOnInput: true
});
const address_2 = defineInputBinds('address_2', {
    validateOnInput: true
});
const special_directions = defineInputBinds('special_directions', {
    validateOnInput: true
}); 
const delivery_instructions = defineInputBinds('delivery_instructions', {
    validateOnInput: true
}); 
   
const submitting = ref(false);

const onSubmit = handleSubmit(values => {

    submitting.value = true;

    const action = id? updateAddress(id, values): addAddress(values);

    action.then(async res => {

        submitting.value = false;

        if (res.operation == 'success') {
 
            router.push('/addresses');

        } else if (res.operation == 'error') {

            const alert = await alertController.create({
                header: t('Unable to Update'),
                message: errorMessage(res.message),
                buttons: [t('Okay')],
            });

            await alert.present();
        }
    }).catch(() => {
        submitting.value = false;
    });
});

const selectArea = async () => {
    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    const modal = await modalController.create({
      component: AreaPage,
    });
    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }
    });
    const { data, role } = await modal.onWillDismiss();

    if(!data) return;

    if(data.area) {
        setFieldValue('area_id', data.area.area_id);
        props.area = data.area;
    } else {
        setFieldValue('area_id', null);
        props.area = null;
    }

    if(data.city) {
        setFieldValue('city_id', data.city.city_id);
        props.city = data.city; 
    } else {
        setFieldValue('city_id', null);
        props.city = null;
    }

    if(data.country) {
        setFieldValue('country_id', data.country.country_id);
        props.country = data.country;
    }

//    props.state = data.state; 

    //if(data.state)    
    //    setFieldValue('state_id', data.state.state_id);
} 

function dismiss() {
    modalController.getTop().then(o => {
        if(o) {
            modalController.dismiss();
        } else if(window.history.length > 0) {
            router.back();
        } else {
            router.push('/');
        }
    });
}

</script>

<style lang="scss" scoped>

.btn-wrapper {
    position: relative;
    margin-top: 45px;
    width: 100%;
}

.area-field {
    --padding-end: 0;
    --inner-padding-end: 0;

    img[slot="start"] {
        margin-top: 14px;
        margin-inline-end: 14px;
    }

    img[slot="end"] {
        margin-top: 14px;
    }

    ion-label {
        margin: 5px 0;
        padding: 0;
    }
}

.type-wrapper {
    margin-bottom: 16px;

    button { 
        padding: 6px 12px;
        justify-content: center;
        align-items: center;
        gap: 4px;
        border-radius: 16px; 
        background: #fff;
        color: var(--ion-color-medium-shade, #707070);
        border: 1px solid var(--ion-color-primary-shade, #F0F0F0);
        font-size: 14px;
        font-style: normal;
        font-weight: 500;
        line-height: 22px;
        margin-inline-end: 12px;

        svg,
        img {
            width: 16px;
            font-size: 16px;
            position: relative;
            top: 2px;
        }
    }

    .btn-home,
    .btn-work {
        svg path {
            fill: #707070;
        }
    }

    .btn-apartment {
        svg path { 
            stroke: #707070;
        }
    }

    button.active {
        background: var(--ion-shades-primary-p-2, #E8E5FF);
        color: var(--ion-color-primary, #453E9A);
    }

    .btn-hand-it.active,
    .btn-home.active,
    .btn-work.active {
        svg path,
        img {
            fill: #453E9A;
        }
    }

    .btn-leave.active,
    .btn-leave-at-door.active,
    .btn-apartment.active {
        svg path { 
            stroke: #453E9A;
        }
    }
}
</style>


<!--
area_id
city_id 
country_id 

unit_type 

house_number  unit_type == 'house'
floor 
apartment unit_type == 'apartment'
building 
block 
street 
avenue 
office unit_type == 'office'
postalcode 
address_1 
address_2

special_directions

delivery_instructions

todo: 

css 
bottom button getting cover/ check for all pages 
 

-->

