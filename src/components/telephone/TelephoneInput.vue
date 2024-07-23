<template>
    <ion-item class="form-field telephone-field">
        <ion-button @click="openPopover($event)">
            <span dir="ltr">+{{ props.country_code }} <ion-icon :icon="caretDownOutline"></ion-icon> </span>
        </ion-button>
        <!-- @onkeydown="return ( $event.ctrlKey || $event.altKey 
                    || (47 < $event.keyCode && $event.keyCode<58 && $event.shiftKey==false) 
                    || (95 < $event.keyCode && $event.keyCode<106)
                    || ($event.keyCode==8) || ($event.keyCode==9) 
                    || ($event.keyCode>34 && $event.keyCode<40) 
                    || ($event.keyCode==46) )" -->
        <ion-input autocomplete="tel" inputmode="tel" :label="$t('Phone Number')" label-placement="floating"
            :placeholder="$t('Enter phone number')" :value="props.phone_number" 
            @ionInput="setPhoneNumber($event)"></ion-input>
            <!-- @ionInput="props.phone_number.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"-->
    </ion-item>
</template>
<script setup lang="ts">
import { onMounted, reactive } from 'vue';
import TelCountryPicker from './TelCountryPicker.vue';
import { IonItem, IonButton, IonIcon, IonInput, isPlatform, modalController, popoverController } from '@ionic/vue';
import { caretDownOutline } from 'ionicons/icons';

const inputs = defineProps(['country_code', 'phone_number']);

const emit = defineEmits(['onChange']);

const props = reactive({
    'country_code': null,
    'phone_number': null
});

onMounted(() => {

    props.country_code = inputs.country_code;

    if(inputs.phone_number) { //phone_number.length > 0
        const phone_number = inputs.phone_number + '';//convert to string 
        
        props.phone_number = phone_number.replace("+" + inputs.country_code, "");
    }

    if (!props.country_code) {

        props.country_code = 965;

        /*if (_auth.currentLocation && _auth.currentLocation.country_code) {
            country_code = _auth.currentLocation.location.calling_code;
            //country_code = _auth.currentLocation.country_code;
        }
        else {
            _auth.locate().then(resp => {
                //const countryCode = resp ? resp.country_code : 'US';
                country_code = resp ? resp.location.calling_code : 965; 
            });
        }

        eventService.locationUpdated$.then(() => {
            props.country_code = _auth.currentLocation.location.calling_code;
        });*/
    }
})

async function openPopover(event) {

    event.preventDefault();
    event.stopPropagation();

    window.history.pushState({
        navigationId: window.history.state.navigationId
    }, null, window.location.pathname);

    let modal;

    if (isPlatform('desktop')) {
        modal = await popoverController.create({
            component: TelCountryPicker,
            componentProps: {
                country_code: props.country_code
            },
            event: event
        });
    } else {
        modal = await modalController.create({
            component: TelCountryPicker,
            componentProps: {
                country_code: props.country_code
            },
        });
    }

    modal.present();
    modal.onDidDismiss().then(e => {

        if (!e.data || e.data.from != 'native-back-btn') {
            window['history-back-from'] = 'onDidDismiss';
            window.history.back();
        }

        if (e.data && e.data.country) {

            props.country_code = e.data.country[1];

            setTimeout(() => {
                emit('onChange', {
                    phone_number: props.phone_number,
                    country_code: props.country_code
                });
            }, 100);
        }
    });
}

function setPhoneNumber(event) {

    props.phone_number = event.target.value;

    emit('onChange', {
        phone_number: props.phone_number,
        country_code: props.country_code
    });
}
 

</script>
<style lang="scss" scoped>
:host {
    display: block;
    padding-inline-start: 0;
}

ion-item {
    padding-inline-start: 0;
    gap: 0;
}
.country-code {
    z-index: 99999;
    margin-inline-end: 10px;
    --box-shadow: none;
}

ion-button {
    display: inline-block;
    width: 85px !important;
    height: 56px;
    //width: 100px !important;
    //height: 100%;
    border: none;
    margin-top: 0;
    margin-bottom: 0;
    margin-right: 0;
    margin-inline-start: 0;
    margin-inline-end: 16px;
    position: relative;
    --background: #f0f0f0;
    --box-shadow: none;
    --color: #1a1a1a;
    border-radius: 12px 0 0 0 !important;
    --border-radius: 12px 0 0 12px !important;
}

ion-input {
    display: inline-block;
    width: calc(100% - 105px);
}


[dir="rtl"] ion-input {
    border-radius: 12px 0 0 12px !important;
    --border-radius: 12px 0 0 12px !important;
}

[dir="rtl"] ion-button {
    border-radius: 0 12px 12px 0 !important;
    --border-radius: 0 12px 12px 0 !important;
}
</style>